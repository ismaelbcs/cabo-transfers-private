/**
 * scripts/google-indexing.mjs
 * 
 * Herramienta para enviar URLs automáticamente a la Google Indexing API.
 * No requiere librerías externas (usa Node.js crypto y fetch nativos).
 * 
 * Uso:
 *   node scripts/google-indexing.mjs --la-paz           (Envía todas las URLs de La Paz en EN y ES)
 *   node scripts/google-indexing.mjs --all              (Envía hasta 200 URLs desde 'url hoteles.txt')
 *   node scripts/google-indexing.mjs https://misitio.com/url1 https://misitio.com/url2
 *   node scripts/google-indexing.mjs --check https://misitio.com/url1 (Consulta estado en Google)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import sitemap from '../src/app/sitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const KEY_FILES = [
  path.join(projectRoot, 'service_account.json'),
  path.join(projectRoot, 'google-key.json'),
  path.join(projectRoot, 'google-credentials.json')
];

function findKeyFile() {
  for (const f of KEY_FILES) {
    if (fs.existsSync(f)) return f;
  }
  return null;
}

function base64url(input) {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet = base64url(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }));

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${claimSet}`);
  const signature = sign.sign(credentials.private_key, 'base64url');
  const jwt = `${header}.${claimSet}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Error al autenticar con Google OAuth: ${data.error_description || data.error || JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function publishUrl(accessToken, targetUrl, type = 'URL_UPDATED') {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url: targetUrl,
      type: type
    })
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

async function checkUrl(accessToken, targetUrl) {
  const endpoint = `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(targetUrl)}`;
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

const LA_PAZ_SLUGS = [
  'sjd-to-casa-luna-la-paz',
  'sjd-to-casa-isla-tortuga-la-paz',
  'sjd-to-casa-moderna-la-paz-bcs',
  'sjd-to-casa-altamar-la-paz',
  'sjd-to-house-with-private-pool-for-family-use-la-paz',
  'sjd-to-bonita-casa-centrica-la-paz',
  'sjd-to-cabanas-rusticas-la-paz',
  'sjd-to-casa-colibri-la-paz',
  'sjd-to-el-aposento-alto-la-paz',
  'sjd-to-salvatierra-home-la-paz',
  'sjd-to-casa-navarro-la-paz',
  'sjd-to-sunset-apartment-la-paz',
  'sjd-to-v-1pb-la-paz',
  'sjd-to-marina-penthouse-ocean-view-la-paz',
  'sjd-to-lylas-casita-la-paz',
  'sjd-to-baja-club-hotel',
  'sjd-to-hotel-indigo-la-paz-puerta-cortes',
  'sjd-to-posada-de-las-flores-la-paz',
  'sjd-to-costa-baja-resort-spa',
  'sjd-to-hotel-catedral-la-paz',
  'sjd-to-marea-la-paz',
  'sjd-to-seven-crown-la-paz-centro-historico',
  'sjd-to-seven-crown-la-paz-malecon',
  'sjd-to-hotel-la-concha-beach-resort-la-paz',
  'sjd-to-hotel-marina-la-paz',
  'sjd-to-hyatt-place-la-paz',
  'sjd-to-city-express-by-marriott-la-paz',
  'sjd-to-one-la-paz',
  'sjd-to-hotel-perla-la-paz',
  'sjd-to-hotel-los-arcos-la-paz',
  'sjd-to-posada-luna-sol-la-paz',
  'sjd-to-hotel-aquamarina-la-paz',
  'sjd-to-hotel-miramar-la-paz',
  'sjd-to-hotel-mediterrane-la-paz',
  'sjd-to-hotel-pekin-la-paz',
  'sjd-to-hotel-hblue-la-paz',
  'sjd-to-casa-al-mar-hotel-boutique-la-paz',
  'sjd-to-hotel-maioris-la-paz',
  'sjd-to-hotel-san-carlos-la-paz',
  'sjd-to-hotel-maria-bonita-la-paz',
  'sjd-to-hotel-cuauhtemoc-la-paz',
  'sjd-to-posada-santa-fe-la-paz',
  'sjd-to-hotel-lorimar-la-paz',
  'sjd-to-hotel-zar-la-paz',
  'sjd-to-orchid-house-baja'
];

function getLaPazUrls() {
  const urls = [];
  const base = 'https://www.caboprivateairporttransfers.com';
  for (const s of LA_PAZ_SLUGS) {
    urls.push(`${base}/en/destinations/${s}`);
    urls.push(`${base}/es/destinations/${s}`);
  }
  return urls;
}

function getAllSiteUrls() {
  const base = 'https://www.caboprivateairporttransfers.com';
  const urls = new Set();

  // 1. URLs desde 'url hoteles.txt'
  const filePath = path.join(projectRoot, 'url hoteles.txt');
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const l of lines) {
      const trimmed = l.trim();
      if (trimmed.startsWith('http') && !trimmed.endsWith('sitemap.xml')) {
        urls.add(trimmed);
        if (trimmed.includes('/en/destinations/')) {
          urls.add(trimmed.replace('/en/destinations/', '/es/destinations/'));
        }
      }
    }
  }

  // 2. URLs dinámicas desde sitemap.js
  try {
    const sitemapEntries = sitemap();
    for (const entry of sitemapEntries) {
      if (entry && entry.url) {
        urls.add(entry.url);
      }
    }
  } catch (err) {
    console.warn('⚠️ Error al cargar sitemap():', err.message);
  }

  return Array.from(urls);
}

function getHistory() {
  const logFile = path.join(projectRoot, 'indexing-history.json');
  if (!fs.existsSync(logFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(logFile, 'utf8'));
  } catch (_) {
    return [];
  }
}

function getSuccessfulUrls() {
  const history = getHistory();
  const successful = new Set();
  for (const entry of history) {
    if (Array.isArray(entry.detalles)) {
      for (const d of entry.detalles) {
        if (d.status === 'SUCCESS') {
          successful.add(d.url);
        }
      }
    }
  }
  return successful;
}

function getTodayCallsCount() {
  const history = getHistory();
  const today = new Date().toISOString().slice(0, 10);
  let count = 0;
  for (const entry of history) {
    if (entry.date && entry.date.startsWith(today)) {
      count += (entry.total || (entry.detalles ? entry.detalles.length : 0));
    }
  }
  return count;
}

async function main() {
  console.log('\n======================================================');
  console.log('   🚀 GOOGLE INDEXING API AUTOMATION - CABO TRANSFERS');
  console.log('======================================================\n');

  const keyPath = findKeyFile();
  if (!keyPath) {
    console.log('❌ Archivo de credenciales no encontrado.\n');
    console.log('Para conectar con Google Indexing API necesitas tu clave de cuenta de servicio.');
    console.log('Coloca tu archivo "service_account.json" en la raíz del proyecto:\n');
    console.log('   cabo-transfers-private/service_account.json\n');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  console.log(`🔑 Clave cargada desde: ${path.basename(keyPath)}`);
  console.log(`👤 Cuenta de servicio: ${credentials.client_email}\n`);

  console.log('🔄 Autenticando con Google...');
  let token;
  try {
    token = await getAccessToken(credentials);
    console.log('✅ Autenticación exitosa con Google OAuth2.\n');
  } catch (err) {
    console.error('❌ Error de autenticación:', err.message);
    process.exit(1);
  }

  const args = process.argv.slice(2);

  // Modo chequeo individual
  if (args[0] === '--check') {
    const targetUrl = args[1];
    if (!targetUrl) {
      console.log('Uso: node scripts/google-indexing.mjs --check <URL>');
      process.exit(1);
    }
    console.log(`🔍 Consultando estado en Google de: ${targetUrl}`);
    const res = await checkUrl(token, targetUrl);
    console.log(JSON.stringify(res.data, null, 2));
    return;
  }

  let urlsToSend = [];
  const successfulAlready = getSuccessfulUrls();
  const todayCalls = getTodayCallsCount();
  const MAX_DAILY = 200;
  const remainingQuotaToday = Math.max(0, MAX_DAILY - todayCalls);

  console.log(`📊 Cuota de Google hoy: ${todayCalls}/${MAX_DAILY} usadas (${remainingQuotaToday} disponibles hoy).`);
  console.log(`✅ URLs ya indexadas exitosamente en historial previo: ${successfulAlready.size}\n`);

  if (args.includes('--la-paz')) {
    urlsToSend = getLaPazUrls();
    console.log(`🎯 Modo La Paz: seleccionadas ${urlsToSend.length} URLs.`);
  } else if (args.length > 0 && args[0].startsWith('http')) {
    urlsToSend = args.filter(a => a.startsWith('http'));
    console.log(`🎯 URLs manuales recibidas: ${urlsToSend.length}\n`);
  } else {
    // Modo --all o por defecto: todas las URLs pendientes del sitio
    const allSiteUrls = getAllSiteUrls();
    const pendingUrls = allSiteUrls.filter(u => !successfulAlready.has(u));

    console.log(`🌐 Total de URLs en el sitio web: ${allSiteUrls.length}`);
    console.log(`⏳ URLs pendientes de indexar: ${pendingUrls.length}`);

    if (pendingUrls.length === 0) {
      console.log('\n🎉 ¡Todas las URLs del sitio ya fueron enviadas a Google exitosamente!');
      return;
    }

    if (remainingQuotaToday <= 0) {
      console.log(`\n⚠️  Ya se alcanzó el límite diario de Google (${MAX_DAILY} URLs por día).`);
      console.log('   Mañana podrás correr este mismo comando para continuar con las siguientes URLs pendientes.');
      return;
    }

    // Tomamos hasta la cuota disponible de hoy
    urlsToSend = pendingUrls.slice(0, remainingQuotaToday);
    console.log(`🚀 Se enviará el lote de hoy: ${urlsToSend.length} URLs (quedarán ${pendingUrls.length - urlsToSend.length} para los siguientes días).\n`);
  }

  console.log(`📤 Enviando ${urlsToSend.length} URLs a Google Indexing API...\n`);

  let exitosas = 0;
  let fallidas = 0;
  let cuotaAgotada = false;
  const resultados = [];

  for (let i = 0; i < urlsToSend.length; i++) {
    const u = urlsToSend[i];
    process.stdout.write(`[${i + 1}/${urlsToSend.length}] ${u} ... `);

    try {
      const res = await publishUrl(token, u);
      if (res.ok) {
        console.log('✅ ENVIADA');
        exitosas++;
        resultados.push({ url: u, status: 'SUCCESS', timestamp: new Date().toISOString() });
      } else {
        const errorMsg = res.data?.error?.message || JSON.stringify(res.data);
        console.log(`❌ ERROR (${res.status}): ${errorMsg}`);
        fallidas++;
        resultados.push({ url: u, status: 'FAILED', error: res.data, timestamp: new Date().toISOString() });

        if (res.status === 429 || errorMsg.toLowerCase().includes('quota')) {
          console.log('\n⚠️  Google ha indicado que la cuota diaria se ha completado.');
          cuotaAgotada = true;
          break;
        }
      }
    } catch (e) {
      console.log(`❌ EXCEPCIÓN: ${e.message}`);
      fallidas++;
      resultados.push({ url: u, status: 'ERROR', error: e.message, timestamp: new Date().toISOString() });
    }

    // Pequeña pausa para respetar rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n======================================================');
  console.log(`🏁 RESUMEN: ${exitosas} enviadas con éxito, ${fallidas} con error.`);
  if (cuotaAgotada) {
    console.log('⚠️  Límite diario de 200 alcanzado. Puedes volver a ejecutarlo mañana para continuar.');
  }
  console.log('======================================================\n');

  // Guardar log
  const logFile = path.join(projectRoot, 'indexing-history.json');
  const history = getHistory();
  history.push({
    date: new Date().toISOString(),
    total: resultados.length,
    exitosas,
    fallidas,
    detalles: resultados
  });
  fs.writeFileSync(logFile, JSON.stringify(history, null, 2));
  console.log(`📁 Historial actualizado en: indexing-history.json\n`);
}

main().catch(err => {
  console.error('\n❌ Error inesperado:', err);
  process.exit(1);
});
