// src/lib/seoHelper.js

export const BASE_URL = 'https://www.caboprivateairporttransfers.com';

/**
 * Genera el objeto de metadatos estándar para Next.js con canonicals y hreflang exactos.
 *
 * @param {Object} options
 * @param {string} options.lang - 'en' | 'es'
 * @param {string} options.path - Ruta relativa, ej: '/destinations/sjd-to-alegranza'
 * @param {string} options.title - Título SEO
 * @param {string} options.description - Meta descripción
 * @param {string|string[]} [options.keywords] - Palabras clave
 * @param {string} [options.image] - URL de la imagen relativa o absoluta
 * @param {string} [options.type] - Tipo OG ('website' o 'article')
 * @returns {import('next').Metadata}
 */
export function generatePageMetadata({
  lang = 'en',
  path = '',
  title,
  description,
  keywords,
  image = '/suburban-airport-los-cabos-ballard.webp',
  type = 'website'
}) {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const canonicalUrl = `${BASE_URL}/${lang}${cleanPath}`;
  const enUrl = `${BASE_URL}/en${cleanPath}`;
  const esUrl = `${BASE_URL}/es${cleanPath}`;

  const fullImageUrl = image.startsWith('http')
    ? image
    : `${BASE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  const hasBrand = typeof title === 'string' && /ballard/i.test(title);
  const resolvedTitle = hasBrand ? { absolute: title } : title;

  return {
    title: resolvedTitle,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': enUrl,
        'es': esUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Ballard Tours Cabo',
      locale: lang === 'es' ? 'es_MX' : 'en_US',
      type,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
  };
}

/**
 * Envuelve el generateMetadata de un yate para asignarle su propio canonical auto-referenciado
 * y títulos/descripciones únicos por ruta SEO (evitando "Página alternativa con etiqueta canónica adecuada").
 */
export function createYachtRouteMetadata(baseMetadataFn, routePath, customCopy = {}) {
  const cleanPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return async function generateMetadata(props) {
    const meta = await baseMetadataFn(props);
    const resolvedParams = await props.params;
    const lang = resolvedParams?.lang || 'en';
    const isEs = lang === 'es';
    const canonicalUrl = `${BASE_URL}/${lang}${cleanPath}`;
    const enUrl = `${BASE_URL}/en${cleanPath}`;
    const esUrl = `${BASE_URL}/es${cleanPath}`;

    const title = (isEs ? customCopy.titleEs : customCopy.titleEn) || meta.title;
    const description = (isEs ? customCopy.descEs : customCopy.descEn) || meta.description;

    return {
      ...meta,
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': enUrl,
          'es': esUrl,
          'x-default': enUrl,
        },
      },
      openGraph: {
        ...(meta.openGraph || {}),
        title,
        description,
        url: canonicalUrl,
      },
    };
  };
}

