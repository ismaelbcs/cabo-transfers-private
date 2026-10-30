'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Play,
  Pause,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Ban,
  Globe,
  Clock,
  Layers,
  ExternalLink,
  ArrowLeft,
  FileSpreadsheet,
  Server,
  Activity,
  Check,
  Info
} from 'lucide-react';

export default function SeoIndexingAdminPage({ params }) {
  const resolvedParams = React.use(params);
  const lang = resolvedParams?.lang || 'es';

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [nextBatchPreview, setNextBatchPreview] = useState([]);
  const [operationLogs, setOperationLogs] = useState([]);
  const [lastBatchResults, setLastBatchResults] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Filtros de la tabla de inventario
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterAudit, setFilterAudit] = useState('ALL');
  const [filterGsc, setFilterGsc] = useState('ALL');
  const [filterLang, setFilterLang] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/seo-indexing');
      const data = await res.json();
      if (data.ok) {
        setSummary(data.summary);
        setRecords(data.records || []);
        setNextBatchPreview(data.nextBatchPreview || []);
        setOperationLogs(data.operationLogs || []);
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Error al cargar el panel SEO: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = async (action, extraPayload = {}) => {
    setActionLoading(action);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/seo-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extraPayload })
      });
      const data = await res.json();

      if (data.summary) setSummary(data.summary);
      if (data.records) setRecords(data.records);
      if (data.nextBatchPreview) setNextBatchPreview(data.nextBatchPreview);
      if (data.operationLogs) setOperationLogs(data.operationLogs);
      if (data.batchResults) setLastBatchResults(data.batchResults);

      if (!data.ok && data.error) {
        setStatusMessage({ type: 'warning', text: data.error });
      } else if (data.message) {
        setStatusMessage({ type: 'success', text: data.message });
      } else if (action === 'process_next_batch') {
        setStatusMessage({
          type: data.gscConnected ? 'success' : 'warning',
          text: data.gscConnected
            ? `Lote de ${data.batchProcessedCount} URLs inspeccionado exitosamente con Google Search Console API.`
            : `Lote de ${data.batchProcessedCount} URLs verificado técnicamente en vivo (HTTP 200 / SSR OK). Para consultar URL Inspection API en tiempo real, coloca service_account.json en la raíz.`
        });
      } else if (action === 'refresh_states') {
        setStatusMessage({
          type: data.gscConnected ? 'success' : 'warning',
          text: data.gscConnected
            ? `Sitemap enviado/actualizado en Search Console y ${data.inspectedCount || 0} estados sincronizados con Google.`
            : data.error || 'Se requiere service_account.json para conectar con Google Search Console API.'
        });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Error ejecutando acción: ${err.message}` });
    } finally {
      setActionLoading('');
    }
  };

  const categories = useMemo(() => {
    const set = new Set(records.map(r => r.category).filter(Boolean));
    return Array.from(set);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      if (filterCategory !== 'ALL' && r.category !== filterCategory) return false;
      if (filterAudit !== 'ALL' && r.auditClassification !== filterAudit) return false;
      if (filterLang !== 'ALL' && r.lang !== filterLang) return false;
      if (filterGsc !== 'ALL') {
        const vStatus = r.gsc?.verifiableStatus || '';
        if (!vStatus.includes(filterGsc)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchUrl = r.url.toLowerCase().includes(q);
        const matchTitle = (r.title || '').toLowerCase().includes(q);
        const matchCat = (r.category || '').toLowerCase().includes(q);
        if (!matchUrl && !matchTitle && !matchCat) return false;
      }
      return true;
    });
  }, [records, filterCategory, filterAudit, filterGsc, filterLang, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderAuditBadge = (classification) => {
    switch (classification) {
      case 'LISTA PARA INDEXAR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
            <CheckCircle2 size={12} /> LISTA PARA INDEXAR
          </span>
        );
      case 'REQUIERE CORRECCIONES':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
            <AlertTriangle size={12} /> REQUIERE CORRECCIONES
          </span>
        );
      case 'DUPLICADA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#faf6f0] text-[#7c5e3c] border border-[#dccbb5] whitespace-nowrap">
            <Copy size={12} /> DUPLICADA (ALIAS)
          </span>
        );
      case 'NO INDEXABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
            <Ban size={12} /> NO INDEXABLE
          </span>
        );
      case 'ERROR DE SERVIDOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-50 text-red-800 border border-red-200 whitespace-nowrap">
            <XCircle size={12} /> ERROR DE SERVIDOR
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{classification}</span>;
    }
  };

  const renderGscBadge = (vStatus) => {
    if (!vStatus) return <span className="text-xs text-slate-400">Pendiente</span>;
    if (vStatus === 'INDEXADA POR GOOGLE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white whitespace-nowrap">
          <CheckCircle2 size={12} /> INDEXADA POR GOOGLE
        </span>
      );
    }
    if (vStatus === 'RASTREO REALIZADO') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200 whitespace-nowrap">
          <Activity size={12} /> RASTREO REALIZADO
        </span>
      );
    }
    if (vStatus === 'DESCUBIERTA POR GOOGLE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200 whitespace-nowrap">
          <Globe size={12} /> DESCUBIERTA POR GOOGLE
        </span>
      );
    }
    if (vStatus === 'NO INDEXADA Y MOTIVO') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap">
          <AlertTriangle size={12} /> NO INDEXADA (VER MOTIVO)
        </span>
      );
    }
    if (vStatus.startsWith('ENVIADA EN SITEMAP')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#003865] border border-blue-200 whitespace-nowrap">
          <Clock size={12} /> {vStatus}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
        {vStatus}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ENCABEZADO Y BOTONES DE ACCIÓN PRINCIPAL (FASE 5 Y FASE 6) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={`/${lang}/admin`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition"
                >
                  <ArrowLeft size={14} /> Volver a Admin
                </Link>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf6f0] text-[#7c5e3c] border border-[#dccbb5] text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck size={14} /> Sistema Oficial Google Search Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#003865] tracking-tight">
                Panel de Auditoría e Indexación SEO por Lotes
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                Control verificable de inventario, auditoría técnica de 10 controles, envío de sitemap y seguimiento oficial mediante <strong>Google Search Console API (URL Inspection API & Sitemaps API)</strong> — sin utilizar Google Indexing API ni simular resultados.
              </p>
            </div>

            {/* Botones Principales solicitados en Fase 5 y 6 */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={() => handleAction('run_audit')}
                className="px-4 py-3 rounded-xl bg-[#003865] hover:bg-[#00284b] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Search size={16} className={actionLoading === 'run_audit' ? 'animate-spin' : ''} />
                <span>{actionLoading === 'run_audit' ? 'Auditando...' : '1. Iniciar Auditoría'}</span>
              </button>

              <button
                type="button"
                disabled={Boolean(actionLoading) || summary?.isPaused}
                onClick={() => handleAction('process_next_batch')}
                className="px-4 py-3 rounded-xl bg-[#7c5e3c] hover:bg-[#664c30] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <Play size={16} className={actionLoading === 'process_next_batch' ? 'animate-pulse' : ''} />
                <span>
                  {actionLoading === 'process_next_batch'
                    ? 'Procesando Lote...'
                    : `2. Procesar Siguiente Lote (${summary?.batchSize || 15} URLs)`}
                </span>
              </button>

              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={() => handleAction('toggle_pause')}
                className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 border cursor-pointer whitespace-nowrap ${
                  summary?.isPaused
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                }`}
              >
                {summary?.isPaused ? <Play size={16} /> : <Pause size={16} />}
                <span>{summary?.isPaused ? 'Continuar Proceso' : 'Pausar Lotes'}</span>
              </button>

              <button
                type="button"
                disabled={Boolean(actionLoading)}
                onClick={() => handleAction('refresh_states')}
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw size={16} className={actionLoading === 'refresh_states' ? 'animate-spin' : ''} />
                <span>{actionLoading === 'refresh_states' ? 'Actualizando...' : '3. Actualizar Estados / Sitemap'}</span>
              </button>

              <a
                href="/api/seo-indexing?format=csv"
                download
                className="px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Download size={16} />
                <span>Descargar CSV</span>
              </a>
            </div>
          </div>

          {/* Estado de Credenciales de Google Search Console API */}
          <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Server size={15} className={summary?.gscCredentialsConfigured ? 'text-emerald-600' : 'text-[#7c5e3c]'} />
              {summary?.gscCredentialsConfigured ? (
                <span className="text-slate-700">
                  <strong>Conexión Google Search Console API activa:</strong>{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800 font-bold">
                    {summary.gscServiceAccountEmail}
                  </code>{' '}
                  ({summary.gscCredentialsSource})
                </span>
              ) : (
                <span className="text-slate-700">
                  <strong>Estado de Credencial Google Search Console API:</strong> No se detectó{' '}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">service_account.json</code> en la raíz. La auditoría técnica y el verificación HTTP 200 en vivo están activos; coloca tu JSON de cuenta de servicio con acceso a Search Console para consultar <em>URL Inspection API</em> en vivo.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label className="font-bold text-slate-700">Tamaño de Lote (10–20):</label>
              <select
                value={summary?.batchSize || 15}
                onChange={(e) => handleAction('set_batch_size', { batchSize: Number(e.target.value) })}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-bold text-slate-900"
              >
                <option value={10}>10 URLs por lote</option>
                <option value={15}>15 URLs por lote</option>
                <option value={20}>20 URLs por lote</option>
              </select>
            </div>
          </div>

          {/* Mensaje de respuesta de última acción */}
          {statusMessage && (
            <div
              className={`mt-4 p-4 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : statusMessage.type === 'warning'
                  ? 'bg-[#faf6f0] border-[#dccbb5] text-[#5c452b]'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <Info size={18} className="shrink-0 mt-0.5" />
              <div>{statusMessage.text}</div>
            </div>
          )}
        </div>

        {/* TARJETAS DE INDICADORES CLAVE DEL PANEL (FASE 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total URLs Detectadas</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{summary?.totalDetected ?? '—'}</div>
            <div className="text-[11px] text-slate-500 mt-1">1,340 en Sitemap + 14 privadas</div>
          </div>

          <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Listas para Indexar</div>
            <div className="text-3xl font-black text-emerald-700 mt-1">{summary?.listasParaIndexar ?? '—'}</div>
            <div className="text-[11px] text-emerald-700 mt-1">Superan los 10 controles SEO</div>
          </div>

          <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#003865]">URLs Enviadas a Google</div>
            <div className="text-3xl font-black text-[#003865] mt-1">{summary?.enviadasAGoogle ?? '—'}</div>
            <div className="text-[11px] text-slate-500 mt-1">Vía Sitemap oficial (sin duplicadas)</div>
          </div>

          <div className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">URLs Rastreadas (GSC)</div>
            <div className="text-3xl font-black text-indigo-900 mt-1">{summary?.rastreadasPorGoogle ?? 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Descubiertas sin rastrear: <strong>{summary?.descubiertasPorGoogle ?? 0}</strong>
            </div>
          </div>

          <div className="bg-[#faf6f0] border-2 border-[#dccbb5] rounded-2xl p-5 shadow-2xs">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#7c5e3c]">Realmente Indexadas (GSC)</div>
            <div className="text-3xl font-black text-[#7c5e3c] mt-1">{summary?.realmenteIndexadas ?? 0}</div>
            <div className="text-[11px] text-[#5c452b] mt-1">Solo con veredicto PASS de Google</div>
          </div>
        </div>

        {/* SEGUNDA FILA DE MÉTRICAS: EXCLUIDAS, ERRORES Y FECHAS DE RASTREO/COMPROBACIÓN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500">URLs Excluidas / Alias / Privadas</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">{summary?.excluidasPorGoogle ?? 0}</div>
              <div className="text-[11px] text-slate-500">
                {summary?.duplicadas ?? 0} alias duplicadas • {summary?.noIndexables ?? 0} no indexables
              </div>
            </div>
            <Ban className="text-slate-400" size={26} />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500">URLs con Errores / Correcciones</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                {(summary?.conErrores || 0) + (summary?.requiereCorrecciones || 0)}
              </div>
              <div className="text-[11px] text-slate-500">
                {summary?.requiereCorrecciones ?? 0} por corregir • {summary?.conErrores ?? 0} errores API/Server
              </div>
            </div>
            <AlertTriangle className="text-amber-600" size={26} />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500">Fecha del Último Rastreo (Google)</div>
              <div className="text-sm font-black text-slate-900 mt-1">
                {summary?.lastCrawlTime
                  ? new Date(summary.lastCrawlTime).toLocaleString()
                  : 'Pendiente de consulta GSC API'}
              </div>
              <div className="text-[11px] text-slate-500">Reportado por URL Inspection API</div>
            </div>
            <Clock className="text-[#003865]" size={24} />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase text-slate-500">Fecha de Última Comprobación</div>
              <div className="text-sm font-black text-slate-900 mt-1">
                {summary?.lastCheckTime
                  ? new Date(summary.lastCheckTime).toLocaleString()
                  : 'Sin comprobaciones aún'}
              </div>
              <div className="text-[11px] text-slate-500">
                Lotes procesados: <strong>{summary?.processedBatchesCount ?? 0}</strong>
              </div>
            </div>
            <Layers className="text-[#7c5e3c]" size={24} />
          </div>
        </div>

        {/* COLA DEL PRÓXIMO LOTE PRIORIZADO (FASE 4) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-black text-[#003865] flex items-center gap-2">
                <Layers size={18} className="text-[#7c5e3c]" />
                Próximo Lote en Cola ({nextBatchPreview.length} URLs seleccionadas por prioridad)
              </h2>
              <p className="text-xs text-slate-600">
                Orden de prioridad: 1. Home → 2. Servicios Principales → 3. Transporte SJD → 4. Tours → 5. Hoteles → 6. Restaurantes → 7. Yates y Golf → 8. Secundarias.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#faf6f0] text-[#7c5e3c] border border-[#dccbb5] self-start">
              Solo incluye URLs con estado: LISTA PARA INDEXAR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {nextBatchPreview.map((item, idx) => (
              <div
                key={item.url}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs flex items-center justify-between gap-2"
              >
                <div className="truncate">
                  <span className="font-black text-[#7c5e3c] mr-1.5">#{idx + 1}</span>
                  <span className="font-bold text-slate-800" title={item.url}>
                    {item.url.replace('https://www.caboprivateairporttransfers.com', '')}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    Prioridad {item.priorityLevel} • {item.category}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-[#003865] font-extrabold text-[10px] uppercase shrink-0 border border-blue-200">
                  {item.lang}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FILTROS Y TABLA VERIFICABLE DE LAS 1,354 URLS (FASE 2 Y FASE 6) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Inventario Completo y Estado Verificable por URL ({filteredRecords.length} de {records.length})
              </h2>
              <p className="text-xs text-slate-500">
                Cada fila distingue entre páginas enviadas en Sitemap, descubiertas, rastreadas e indexadas según comprobaciones técnicas y respuestas reales de Google.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por URL, hotel, yate, tour..."
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-[#003865]"
              />

              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="ALL">Todas las Categorías</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filterAudit}
                onChange={(e) => {
                  setFilterAudit(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="ALL">Auditoría: Todas</option>
                <option value="LISTA PARA INDEXAR">LISTA PARA INDEXAR</option>
                <option value="REQUIERE CORRECCIONES">REQUIERE CORRECCIONES</option>
                <option value="DUPLICADA">DUPLICADA (Alias)</option>
                <option value="NO INDEXABLE">NO INDEXABLE</option>
                <option value="ERROR DE SERVIDOR">ERROR DE SERVIDOR</option>
              </select>

              <select
                value={filterGsc}
                onChange={(e) => {
                  setFilterGsc(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="ALL">Estado Google: Todos</option>
                <option value="INDEXADA POR GOOGLE">Indexada por Google</option>
                <option value="RASTREO REALIZADO">Rastreo realizado</option>
                <option value="DESCUBIERTA POR GOOGLE">Descubierta por Google</option>
                <option value="NO INDEXADA">No indexada y motivo</option>
                <option value="ENVIADA EN SITEMAP">Enviada en Sitemap</option>
              </select>

              <select
                value={filterLang}
                onChange={(e) => {
                  setFilterLang(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
              >
                <option value="ALL">Idioma: EN + ES</option>
                <option value="en">Inglés (/en)</option>
                <option value="es">Español (/es)</option>
              </select>
            </div>
          </div>

          {/* Tabla de URLs */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
                  <th className="py-3 px-3">Prioridad / Categoría</th>
                  <th className="py-3 px-3">URL & Título SEO</th>
                  <th className="py-3 px-3">Controles Técnicos (Fase 2)</th>
                  <th className="py-3 px-3">Clasificación Auditoría</th>
                  <th className="py-3 px-3">Estado Verificable Google (Fase 6)</th>
                  <th className="py-3 px-3">Último Rastreo / Canonical GSC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                      Cargando inventario y auditoría SEO...
                    </td>
                  </tr>
                ) : paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      No se encontraron URLs con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((rec) => (
                    <tr key={rec.url} className="hover:bg-slate-50/80 transition align-top">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#003865] text-white font-extrabold text-[10px] mr-1.5">
                          P{rec.priorityLevel}
                        </span>
                        <span className="uppercase font-extrabold text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                          {rec.lang}
                        </span>
                        <div className="font-bold text-slate-700 mt-1 text-[11px]">{rec.category}</div>
                      </td>

                      <td className="py-3 px-3 max-w-md">
                        <a
                          href={rec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#003865] hover:underline flex items-center gap-1 break-all"
                        >
                          <span>{rec.pathname}</span>
                          <ExternalLink size={11} className="shrink-0" />
                        </a>
                        {rec.title && (
                          <div className="text-[11px] text-slate-700 font-semibold mt-1 line-clamp-1" title={rec.title}>
                            {rec.title}
                          </div>
                        )}
                        {rec.userCanonical && (
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate" title={rec.userCanonical}>
                            Canonical: {rec.userCanonical.replace('https://www.caboprivateairporttransfers.com', '')}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${rec.checks?.http200 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                            HTTP {rec.checks?.httpStatus || 200}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${rec.checks?.noRobotsBlock ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
                            {rec.checks?.noRobotsBlock ? 'Robots OK' : 'Disallow'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${rec.checks?.canonicalCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                            {rec.checks?.canonicalCorrect ? 'Canonical OK' : 'Alias Canonical'}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${rec.checks?.ssrHtmlAccessible ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800'}`}>
                            {rec.checks?.ssrHtmlAccessible ? 'SSR HTML OK' : 'Sin SSR'}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                            {rec.internalLinksCount} enlaces
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {renderAuditBadge(rec.auditClassification)}
                        {rec.auditReasons?.length > 0 && (
                          <div className="text-[10px] text-slate-600 mt-1 max-w-xs">
                            {rec.auditReasons.join(' ')}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {renderGscBadge(rec.gsc?.verifiableStatus)}
                        {rec.gsc?.coverageState && (
                          <div className="text-[10px] font-bold text-slate-700 mt-1">
                            GSC: {rec.gsc.coverageState}
                          </div>
                        )}
                        {rec.gsc?.reason && (
                          <div className="text-[10px] text-slate-500 mt-0.5 max-w-xs">
                            {rec.gsc.reason}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-[11px] text-slate-600 whitespace-nowrap">
                        <div>
                          <strong>Rastreo:</strong>{' '}
                          {rec.gsc?.lastCrawlTime
                            ? new Date(rec.gsc.lastCrawlTime).toLocaleString()
                            : 'Sin registro GSC'}
                        </div>
                        <div className="mt-0.5">
                          <strong>Canonical Google:</strong>{' '}
                          {rec.gsc?.googleCanonical
                            ? rec.gsc.googleCanonical.replace('https://www.caboprivateairporttransfers.com', '')
                            : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-600">
            <div>
              Mostrando página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredRecords.length} URLs filtradas)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-bold disabled:opacity-40 cursor-pointer"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 font-bold disabled:opacity-40 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* BITÁCORA DE OPERACIONES Y LOTES (FASE 4) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <h3 className="text-base font-black text-slate-900 mb-3">
            Historial Verificable de Operaciones ({operationLogs.length})
          </h3>
          {operationLogs.length === 0 ? (
            <p className="text-xs text-slate-500">Aún no se han registrado operaciones manuales en la bitácora.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
              {operationLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-extrabold text-[#003865] mr-2">[{log.type}]</span>
                    <span className="text-slate-700">{log.message}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

