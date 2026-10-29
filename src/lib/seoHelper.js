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

  return {
    title,
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
