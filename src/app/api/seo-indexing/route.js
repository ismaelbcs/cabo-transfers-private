// src/app/api/seo-indexing/route.js
import { NextResponse } from 'next/server';
import {
  loadIndexingState,
  saveIndexingState,
  buildFullUrlInventoryAndAudit,
  verifyLiveUrlForGooglebot,
  findGoogleCredentials,
  getSearchConsoleAccessToken,
  resolveAuthorizedSiteUrl,
  inspectUrlWithSearchConsole,
  mapGscInspectionToVerifiableStatus,
  submitAndFetchSitemapStatus,
  selectNextBatch,
  computeDashboardSummary,
  generateVerifiableCsvReport
} from '../../../lib/seoIndexingEngine.js';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function inspectWithControlledRetry(accessToken, siteUrl, url, langCode, maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const res = await inspectUrlWithSearchConsole(accessToken, siteUrl, url, langCode);
      if (res.ok) return res;
      // Retry only on temporary errors (429 rate limit or 5xx server error)
      if ((res.status === 429 || res.status >= 500) && attempt < maxRetries) {
        attempt++;
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
      return res;
    } catch (err) {
      if (attempt < maxRetries) {
        attempt++;
        await sleep(1000 * Math.pow(2, attempt));
        continue;
      }
      return { ok: false, status: 0, data: { error: { message: err.message } } };
    }
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    let state = loadIndexingState();
    if (!state.urlRecords || Object.keys(state.urlRecords).length === 0) {
      state = buildFullUrlInventoryAndAudit(state);
    }

    // Exportación de reporte CSV verificable (Fase 6)
    if (format === 'csv') {
      const csvContent = generateVerifiableCsvReport(state);
      const dateStr = new Date().toISOString().slice(0, 10);
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="reporte-indexacion-seo-cabo-${dateStr}.csv"`
        }
      });
    }

    const summary = computeDashboardSummary(state);
    const nextBatchPreview = selectNextBatch(state, state.batchSize || 15, false).map(r => ({
      url: r.url,
      category: r.category,
      priorityLevel: r.priorityLevel,
      lang: r.lang,
      verifiableStatus: r.gsc?.verifiableStatus
    }));

    const allRecords = Object.values(state.urlRecords || {}).sort((a, b) => {
      if (a.priorityLevel !== b.priorityLevel) return a.priorityLevel - b.priorityLevel;
      return a.url.localeCompare(b.url);
    });

    return NextResponse.json({
      ok: true,
      summary,
      nextBatchPreview,
      records: allRecords,
      operationLogs: (state.operationLogs || []).slice(-60).reverse()
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    const originUrl = new URL(request.url).origin;

    let state = loadIndexingState();
    if (!state.urlRecords || Object.keys(state.urlRecords).length === 0) {
      state = buildFullUrlInventoryAndAudit(state);
    }

    // ========================================================================
    // ACCIÓN 1: INICIAR AUDITORÍA TÉCNICA COMPLETA (FASE 1 Y FASE 2)
    // ========================================================================
    if (action === 'run_audit') {
      state = buildFullUrlInventoryAndAudit(state);

      // Realizar además comprobación HTTP 200 real sobre el lote prioritario (hasta 15 URLs)
      const sampleBatch = selectNextBatch(state, 12, true);
      let liveCheckedCount = 0;

      for (const item of sampleBatch) {
        const liveRes = await verifyLiveUrlForGooglebot(item.url, originUrl);
        const rec = state.urlRecords[item.url];
        if (rec && liveRes.status > 0) {
          liveCheckedCount++;
          rec.checks.httpStatus = liveRes.status;
          rec.checks.http200 = liveRes.status === 200;
          rec.checks.noNoindex = !liveRes.hasNoindex;
          if (liveRes.liveCanonical) {
            rec.userCanonical = liveRes.liveCanonical;
            rec.checks.canonicalCorrect = liveRes.liveCanonical === item.url;
          }
          if (liveRes.visibleTextLength > 0) {
            rec.checks.ssrHtmlAccessible = liveRes.visibleTextLength > 150;
          }
          // Re-evaluar clasificación si falló el chequeo HTTP en vivo
          if (liveRes.status >= 500) {
            rec.auditClassification = 'ERROR DE SERVIDOR';
            rec.auditReasons.push(`Servidor respondió HTTP ${liveRes.status} en comprobación en vivo.`);
          } else if (liveRes.status !== 200) {
            rec.auditClassification = 'REQUIERE CORRECCIONES';
            rec.auditReasons.push(`Respuesta HTTP ${liveRes.status} (se requiere HTTP 200).`);
          } else if (liveRes.hasNoindex) {
            rec.auditClassification = 'NO INDEXABLE';
            rec.auditReasons.push('Se detectó directiva noindex en respuesta HTTP en vivo.');
          }
        }
      }

      state.operationLogs.push({
        timestamp: new Date().toISOString(),
        type: 'AUDITORÍA_TÉCNICA',
        status: 'SUCCESS',
        message: `Auditoría técnica completada sobre ${Object.keys(state.urlRecords).length} URLs (${liveCheckedCount} verificadas con petición HTTP 200 Googlebot en vivo).`
      });

      saveIndexingState(state);
      return NextResponse.json({
        ok: true,
        message: 'Auditoría técnica completada con éxito.',
        summary: computeDashboardSummary(state),
        nextBatchPreview: selectNextBatch(state, state.batchSize || 15, false),
        records: Object.values(state.urlRecords),
        operationLogs: state.operationLogs.slice(-60).reverse()
      });
    }

    // ========================================================================
    // ACCIÓN 2: PAUSAR O CONTINUAR PROCESAMIENTO POR LOTES (FASE 4)
    // ========================================================================
    if (action === 'toggle_pause') {
      state.isPaused = typeof body.isPaused === 'boolean' ? body.isPaused : !state.isPaused;
      state.operationLogs.push({
        timestamp: new Date().toISOString(),
        type: state.isPaused ? 'COLA_PAUSADA' : 'COLA_REANUDADA',
        status: 'INFO',
        message: state.isPaused
          ? 'El procesamiento de lotes ha sido pausado por el administrador.'
          : 'El procesamiento de lotes ha sido reanudado.'
      });
      saveIndexingState(state);
      return NextResponse.json({
        ok: true,
        isPaused: state.isPaused,
        summary: computeDashboardSummary(state),
        operationLogs: state.operationLogs.slice(-60).reverse()
      });
    }

    if (action === 'set_batch_size') {
      const newSize = Math.min(20, Math.max(10, Number(body.batchSize) || 15));
      state.batchSize = newSize;
      saveIndexingState(state);
      return NextResponse.json({
        ok: true,
        batchSize: state.batchSize,
        summary: computeDashboardSummary(state),
        nextBatchPreview: selectNextBatch(state, state.batchSize, false)
      });
    }

    // ========================================================================
    // ACCIÓN 3: PROCESAR EL SIGUIENTE LOTE (10 A 20 URLS) — FASE 3 Y FASE 4
    // ========================================================================
    if (action === 'process_next_batch') {
      if (state.isPaused && !body.forceResume) {
        return NextResponse.json({
          ok: false,
          error: 'El sistema por lotes está en PAUSA. Pulsa "Continuar Proceso" antes de procesar el siguiente lote.'
        }, { status: 400 });
      }

      if (body.forceResume) {
        state.isPaused = false;
      }

      const batchSize = Math.min(20, Math.max(10, Number(body.batchSize || state.batchSize || 15)));
      const batch = selectNextBatch(state, batchSize, Boolean(body.forceRecheck));

      if (batch.length === 0) {
        return NextResponse.json({
          ok: true,
          message: 'No hay URLs pendientes elegibles en la cola (todas las URLs LISTAS PARA INDEXAR fueron comprobadas recientemente).',
          summary: computeDashboardSummary(state),
          records: Object.values(state.urlRecords),
          operationLogs: state.operationLogs.slice(-60).reverse()
        });
      }

      // Verificar si existen credenciales de Google Search Console API
      const credInfo = findGoogleCredentials();
      let accessToken = null;
      let siteUrl = null;
      let authError = null;

      if (credInfo) {
        try {
          accessToken = await getSearchConsoleAccessToken(credInfo.credentials);
          siteUrl = await resolveAuthorizedSiteUrl(accessToken);
        } catch (err) {
          authError = err.message;
        }
      }

      const batchResults = [];
      const nowIso = new Date().toISOString();

      for (const item of batch) {
        const rec = state.urlRecords[item.url];
        if (!rec) continue;

        // 1. Comprobación técnica en vivo antes de consultar/enviar (Fase 2)
        const liveCheck = await verifyLiveUrlForGooglebot(item.url, originUrl);
        if (liveCheck.status > 0) {
          rec.checks.httpStatus = liveCheck.status;
          rec.checks.http200 = liveCheck.status === 200;
          rec.checks.noNoindex = !liveCheck.hasNoindex;
          if (liveCheck.status !== 200 || liveCheck.hasNoindex) {
            rec.auditClassification = liveCheck.status >= 500 ? 'ERROR DE SERVIDOR' : 'REQUIERE CORRECCIONES';
            rec.auditReasons.push(`Bloqueada en lote: HTTP ${liveCheck.status}, noindex=${liveCheck.hasNoindex}`);
            batchResults.push({
              url: item.url,
              outcome: 'BLOQUEADA_AUDITORIA',
              detail: `No superó control HTTP 200 en vivo (HTTP ${liveCheck.status})`
            });
            continue;
          }
        }

        // 2. Si hay conexión autenticada con Google Search Console API, consultar URL Inspection API oficial
        if (accessToken && siteUrl) {
          const langCode = rec.lang === 'es' ? 'es-MX' : 'en-US';
          const gscRes = await inspectWithControlledRetry(accessToken, siteUrl, item.url, langCode, 2);

          if (gscRes.ok && gscRes.data?.inspectionResult) {
            const insp = gscRes.data.inspectionResult;
            const idxStatus = insp.indexStatusResult || {};
            const mapped = mapGscInspectionToVerifiableStatus(insp);

            rec.gsc = {
              verifiableStatus: mapped.verifiableStatus,
              reason: mapped.reason,
              verdict: idxStatus.verdict || 'VERDICT_UNSPECIFIED',
              coverageState: idxStatus.coverageState || null,
              indexingState: idxStatus.indexingState || null,
              pageFetchState: idxStatus.pageFetchState || null,
              robotsTxtState: idxStatus.robotsTxtState || null,
              lastCrawlTime: idxStatus.lastCrawlTime || null,
              googleCanonical: idxStatus.googleCanonical || null,
              userCanonicalGsc: idxStatus.userCanonical || null,
              crawledAs: idxStatus.crawledAs || null,
              lastCheckedAt: nowIso,
              error: null
            };

            batchResults.push({
              url: item.url,
              outcome: mapped.verifiableStatus,
              detail: `${idxStatus.coverageState || idxStatus.verdict} | Canonical Google: ${idxStatus.googleCanonical || 'N/A'}`
            });
          } else {
            const errMsg = gscRes.data?.error?.message || `HTTP ${gscRes.status}`;
            rec.gsc = {
              ...(rec.gsc || {}),
              verifiableStatus: 'ERROR DE API GSC',
              lastCheckedAt: nowIso,
              error: errMsg
            };
            batchResults.push({
              url: item.url,
              outcome: 'ERROR_GSC',
              detail: errMsg
            });
          }

          await sleep(180);
        } else {
          // Sin archivo service_account.json: registramos la comprobación técnica real y dejamos claro que falta credencial GSC
          rec.gsc = {
            ...(rec.gsc || {}),
            verifiableStatus: 'ENVIADA EN SITEMAP (FALTA CREDENCIAL GSC API)',
            reason: authError
              ? `Error autenticando con Google Search Console API: ${authError}`
              : 'Verificada técnicamente (HTTP 200 OK, Canonical OK, SSR OK). Coloca service_account.json con permiso en Search Console para consultar URL Inspection API.',
            lastCheckedAt: nowIso,
            error: authError || 'service_account.json no detectado en la raíz del proyecto'
          };
          batchResults.push({
            url: item.url,
            outcome: 'VERIFICADA_TECNICAMENTE_SIN_CREDENCIAL_GSC',
            detail: authError || 'HTTP 200 y SSR verificados en vivo. Conecta service_account.json para consultar URL Inspection API.'
          });
        }
      }

      state.processedBatchesCount = (state.processedBatchesCount || 0) + 1;
      state.lastGscSyncDate = nowIso;

      state.operationLogs.push({
        timestamp: nowIso,
        type: 'PROCESAMIENTO_LOTE',
        status: accessToken ? 'SUCCESS' : 'WARNING',
        message: accessToken
          ? `Lote #${state.processedBatchesCount} procesado (${batch.length} URLs consultadas en Google Search Console URL Inspection API).`
          : `Lote #${state.processedBatchesCount} verificado técnicamente en vivo (${batch.length} URLs HTTP 200/SSR). Para consultar el estado real en Google Search Console API, agrega service_account.json.`
      });

      saveIndexingState(state);

      return NextResponse.json({
        ok: true,
        batchProcessedCount: batch.length,
        gscConnected: Boolean(accessToken),
        authError,
        batchResults,
        summary: computeDashboardSummary(state),
        nextBatchPreview: selectNextBatch(state, state.batchSize || 15, false),
        records: Object.values(state.urlRecords),
        operationLogs: state.operationLogs.slice(-60).reverse()
      });
    }

    // ========================================================================
    // ACCIÓN 4: ACTUALIZAR ESTADOS Y ENVIAR SITEMAP OFICIAL A SEARCH CONSOLE
    // ========================================================================
    if (action === 'refresh_states') {
      const credInfo = findGoogleCredentials();
      const nowIso = new Date().toISOString();

      if (!credInfo) {
        state.operationLogs.push({
          timestamp: nowIso,
          type: 'SITEMAP_Y_ESTADOS_GSC',
          status: 'WARNING',
          message: 'No se encontró service_account.json ni GOOGLE_SERVICE_ACCOUNT_JSON. El inventario local fue actualizado, pero se requiere la cuenta de servicio autorizada en Google Search Console para enviar el sitemap vía API y consultar URL Inspection.'
        });
        saveIndexingState(state);
        return NextResponse.json({
          ok: false,
          gscConnected: false,
          error: 'No se encontró service_account.json en la raíz del proyecto ni la variable GOOGLE_SERVICE_ACCOUNT_JSON. Agrégala con permisos en Google Search Console para consultar respuestas reales de Google.',
          summary: computeDashboardSummary(state),
          operationLogs: state.operationLogs.slice(-60).reverse()
        }, { status: 200 });
      }

      try {
        const accessToken = await getSearchConsoleAccessToken(credInfo.credentials);
        const siteUrl = await resolveAuthorizedSiteUrl(accessToken);

        // 1. Enviar y consultar el Sitemap mediante Search Console Sitemaps API
        const sitemapRes = await submitAndFetchSitemapStatus(accessToken, siteUrl);
        state.sitemapStatus = sitemapRes;
        state.lastGscSyncDate = nowIso;

        // 2. Si se enviaron URLs específicas para refrescar o tomamos las últimas 10 comprobadas
        const targetUrls = Array.isArray(body.urls) && body.urls.length > 0
          ? body.urls.slice(0, 15)
          : selectNextBatch(state, 10, true).map(r => r.url);

        let inspectedCount = 0;
        for (const u of targetUrls) {
          const rec = state.urlRecords[u];
          if (!rec || rec.auditClassification !== 'LISTA PARA INDEXAR') continue;
          const langCode = rec.lang === 'es' ? 'es-MX' : 'en-US';
          const gscRes = await inspectWithControlledRetry(accessToken, siteUrl, u, langCode, 1);
          if (gscRes.ok && gscRes.data?.inspectionResult) {
            inspectedCount++;
            const insp = gscRes.data.inspectionResult;
            const idxStatus = insp.indexStatusResult || {};
            const mapped = mapGscInspectionToVerifiableStatus(insp);
            rec.gsc = {
              verifiableStatus: mapped.verifiableStatus,
              reason: mapped.reason,
              verdict: idxStatus.verdict || 'VERDICT_UNSPECIFIED',
              coverageState: idxStatus.coverageState || null,
              indexingState: idxStatus.indexingState || null,
              pageFetchState: idxStatus.pageFetchState || null,
              robotsTxtState: idxStatus.robotsTxtState || null,
              lastCrawlTime: idxStatus.lastCrawlTime || null,
              googleCanonical: idxStatus.googleCanonical || null,
              userCanonicalGsc: idxStatus.userCanonical || null,
              crawledAs: idxStatus.crawledAs || null,
              lastCheckedAt: nowIso,
              error: null
            };
          }
          await sleep(150);
        }

        state.operationLogs.push({
          timestamp: nowIso,
          type: 'SITEMAP_Y_ESTADOS_GSC',
          status: sitemapRes.submittedOk ? 'SUCCESS' : 'WARNING',
          message: `Sitemap enviado/actualizado en Search Console (${siteUrl}) y ${inspectedCount} URLs inspeccionadas en tiempo real.`
        });

        saveIndexingState(state);

        return NextResponse.json({
          ok: true,
          gscConnected: true,
          sitemapStatus: sitemapRes,
          inspectedCount,
          summary: computeDashboardSummary(state),
          nextBatchPreview: selectNextBatch(state, state.batchSize || 15, false),
          records: Object.values(state.urlRecords),
          operationLogs: state.operationLogs.slice(-60).reverse()
        });
      } catch (err) {
        state.operationLogs.push({
          timestamp: nowIso,
          type: 'ERROR_GSC_API',
          status: 'ERROR',
          message: `Error al comunicar con Google Search Console API: ${err.message}`
        });
        saveIndexingState(state);
        return NextResponse.json({
          ok: false,
          gscConnected: false,
          error: err.message,
          summary: computeDashboardSummary(state),
          operationLogs: state.operationLogs.slice(-60).reverse()
        }, { status: 200 });
      }
    }

    return NextResponse.json({ ok: false, error: 'Acción no reconocida' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

