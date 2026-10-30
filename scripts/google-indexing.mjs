/**
 * scripts/google-indexing.mjs
 *
 * Sistema CLI Oficial de Auditoría, Envío de Sitemap e Inspección por Lotes
 * mediante Google Search Console API (URL Inspection API + Sitemaps API).
 *
 * IMPORTANTE: Cumple con las políticas de Google NO utilizando Google Indexing API
 * para páginas normales de servicios, hoteles, tours, restaurantes o transporte.
 *
 * Uso:
 *   node scripts/google-indexing.mjs --audit          (Ejecuta auditoría técnica de las 1,354 URLs)
 *   node scripts/google-indexing.mjs --batch          (Procesa el siguiente lote de 15 URLs listas para indexar)
 *   node scripts/google-indexing.mjs --sitemap        (Envía y consulta sitemap.xml en Search Console)
 *   node scripts/google-indexing.mjs --csv            (Genera reporte-indexacion-seo.csv verificable)
 *   node scripts/google-indexing.mjs --check <URL>    (Inspecciona una URL específica en Search Console)
 */

import fs from 'fs';
import path from 'path';
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
} from '../src/lib/seoIndexingEngine.js';

async function main() {
  console.log('\n====================================================================');
  console.log('   📊 SISTEMA PROFESIONAL DE INDEXACIÓN SEO – CABO TRANSFERS (GSC)');
  console.log('====================================================================\n');

  const args = process.argv.slice(2);
  let state = loadIndexingState();

  if (!state.urlRecords || Object.keys(state.urlRecords).length === 0 || args.includes('--audit')) {
    console.log('🔍 Ejecutando Auditoría Técnica sobre el inventario completo de URLs...');
    state = buildFullUrlInventoryAndAudit(state);
    const s = computeDashboardSummary(state);
    console.log(`✅ Auditoría completada:`);
    console.log(`   • Total URLs detectadas:     ${s.totalDetected}`);
    console.log(`   • LISTAS PARA INDEXAR:       ${s.listasParaIndexar}`);
    console.log(`   • REQUIEREN CORRECCIONES:    ${s.requiereCorrecciones}`);
    console.log(`   • DUPLICADAS (Alias):        ${s.duplicadas}`);
    console.log(`   • NO INDEXABLES (Privadas):  ${s.noIndexables}`);
    console.log(`   • ERRORES DE SERVIDOR:       ${s.erroresServidor}\n`);
    if (args.includes('--audit') && args.length === 1) return;
  }

  if (args.includes('--csv')) {
    const csv = generateVerifiableCsvReport(state);
    const outPath = path.join(process.cwd(), 'reporte-indexacion-seo.csv');
    fs.writeFileSync(outPath, csv, 'utf8');
    console.log(`📥 Reporte CSV verificable generado en: ${outPath}\n`);
    return;
  }

  const credInfo = findGoogleCredentials();
  if (!credInfo) {
    console.log('⚠️  No se encontró archivo de credenciales "service_account.json" en la raíz.');
    console.log('   Para consultar la API oficial de Google Search Console (URL Inspection API y Sitemaps API),');
    console.log('   coloca tu archivo service_account.json en la raíz del proyecto y agrega el email de la');
    console.log('   cuenta de servicio como usuario en tu propiedad de Google Search Console.\n');
    return;
  }

  console.log(`🔑 Credencial detectada (${credInfo.source}): ${credInfo.credentials.client_email}`);
  const accessToken = await getSearchConsoleAccessToken(credInfo.credentials);
  const siteUrl = await resolveAuthorizedSiteUrl(accessToken);
  console.log(`🌐 Propiedad Search Console autorizada: ${siteUrl}\n`);

  if (args.includes('--sitemap')) {
    console.log('📤 Enviando y verificando sitemap.xml en Google Search Console...');
    const sm = await submitAndFetchSitemapStatus(accessToken, siteUrl);
    state.sitemapStatus = sm;
    saveIndexingState(state);
    console.log(JSON.stringify(sm, null, 2));
    return;
  }

  if (args[0] === '--check' && args[1]) {
    const targetUrl = args[1];
    console.log(`🔎 Inspeccionando URL en Search Console: ${targetUrl}`);
    const res = await inspectUrlWithSearchConsole(accessToken, siteUrl, targetUrl);
    console.log(JSON.stringify(res.data, null, 2));
    return;
  }

  // Por defecto o --batch: procesa el siguiente lote de 15 URLs
  const batch = selectNextBatch(state, state.batchSize || 15, false);
  console.log(`📦 Procesando lote prioritario de ${batch.length} URLs (solo LISTAS PARA INDEXAR)...\n`);

  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    process.stdout.write(`[${i + 1}/${batch.length}] (Prioridad ${item.priorityLevel}) ${item.url} ... `);
    const live = await verifyLiveUrlForGooglebot(item.url);
    if (live.status !== 200 || live.hasNoindex) {
      console.log(`❌ Bloqueada en verificación previa (HTTP ${live.status})`);
      continue;
    }

    const gscRes = await inspectUrlWithSearchConsole(
      accessToken,
      siteUrl,
      item.url,
      item.lang === 'es' ? 'es-MX' : 'en-US'
    );

    if (gscRes.ok && gscRes.data?.inspectionResult) {
      const insp = gscRes.data.inspectionResult;
      const idx = insp.indexStatusResult || {};
      const mapped = mapGscInspectionToVerifiableStatus(insp);
      state.urlRecords[item.url].gsc = {
        verifiableStatus: mapped.verifiableStatus,
        reason: mapped.reason,
        verdict: idx.verdict || null,
        coverageState: idx.coverageState || null,
        lastCrawlTime: idx.lastCrawlTime || null,
        googleCanonical: idx.googleCanonical || null,
        userCanonicalGsc: idx.userCanonical || null,
        crawledAs: idx.crawledAs || null,
        lastCheckedAt: new Date().toISOString(),
        error: null
      };
      console.log(`✅ ${mapped.verifiableStatus} (${idx.coverageState || idx.verdict})`);
    } else {
      const errMsg = gscRes.data?.error?.message || `HTTP ${gscRes.status}`;
      console.log(`⚠️ Error GSC: ${errMsg}`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  state.processedBatchesCount = (state.processedBatchesCount || 0) + 1;
  state.lastGscSyncDate = new Date().toISOString();
  saveIndexingState(state);
  console.log('\n✅ Lote finalizado y registrado en seo-indexing-state.json.\n');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
