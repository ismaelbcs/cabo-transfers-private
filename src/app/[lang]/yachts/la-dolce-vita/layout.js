// src/app/[lang]/yachts/la-dolce-vita/layout.js
import React from 'react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  const canonicalUrl = `${baseUrl}/${lang}/yachts/la-dolce-vita`;

  const title = isEs
    ? 'Yate Privado 57 FT "La Dolce Vita" en Cabo San Lucas con Barra Libre y Snorkel | Hasta 12 Pasajeros'
    : 'Cabo San Lucas Private 57ft Yacht "La Dolce Vita" with Open Bar & Snorkel (Up to 12 Guests)';

  const description = isEs
    ? 'Disfruta una experiencia VIP a bordo del yate privado de 57 pies "La Dolce Vita" en Cabo San Lucas. Chárters privados de 2, 4 y 8 horas desde $1,999 USD para hasta 12 invitados con capitán, combustible, esnórquel, paddleboards y bebidas incluidas.'
    : 'Enjoy a VIP experience aboard the 57-foot luxury yacht "La Dolce Vita" in Cabo San Lucas. Private charters for 2, 4, or 8 hours starting at $1,999 USD for up to 12 guests with captain, fuel, open bar beverages, snorkeling gear, and paddleboards.';

  const keywords = isEs
    ? [
        'yate 57 pies cabo san lucas',
        'la dolce vita yacht cabo',
        'renta de yate privado 57ft cabo san lucas',
        'alquiler de yate para 12 personas los cabos',
        'cabo san lucas private 57ft yacht',
        'paseo en yate al arco cabo san lucas'
      ]
    : [
        'Cabo San Lucas Private 57ft Yacht with Open Bar & Snorkel',
        'La Dolce Vita 57ft yacht Cabo San Lucas',
        '57 foot yacht charter Cabo San Lucas',
        'private yacht rental Cabo 12 guests',
        '2 hour yacht charter Cabo San Lucas',
        'luxury motor boat rental Cabo San Lucas'
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en/yachts/la-dolce-vita`,
        'es-MX': `${baseUrl}/es/yachts/la-dolce-vita`,
        'x-default': `${baseUrl}/en/yachts/la-dolce-vita`
      }
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Cabo Private Airport Transfers & VIP Yacht Charters',
      locale: isEs ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/yachts/LA%20DOLCE%20VITA/Luend-3_t1FqE6w_cropped.avif`,
          width: 1200,
          height: 630,
          alt: 'Cabo San Lucas Private 57ft Yacht La Dolce Vita with Open Bar & Snorkel'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/yachts/LA%20DOLCE%20VITA/Luend-3_t1FqE6w_cropped.avif`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

export default async function LaDolceVitaYachtLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEs
      ? 'Yate Privado 57 Ft "La Dolce Vita" con Barra Libre y Snorkel en Cabo San Lucas'
      : 'Cabo San Lucas Private 57ft Yacht "La Dolce Vita" with Open Bar & Snorkel',
    image: [
      `${baseUrl}/yachts/LA%20DOLCE%20VITA/Luend-3_t1FqE6w_cropped.avif`,
      `${baseUrl}/yachts/LA%20DOLCE%20VITA/Luend-6_tJNgFCz_cropped.avif`,
      `${baseUrl}/yachts/LA%20DOLCE%20VITA/Luend-7.avif`,
      `${baseUrl}/yachts/LA%20DOLCE%20VITA/Luen-1.avif`
    ],
    description: isEs
      ? 'Chárter privado a bordo del yate de 57 pies "La Dolce Vita" (Custom Build 2020) en Cabo San Lucas. Capacidad hasta 12 pasajeros, 1 cabina, 1 baño, capitán, combustible, equipo de esnórquel y paddleboards.'
      : 'Private VIP charter aboard the 57ft "La Dolce Vita" yacht (Custom Build 2020) in Cabo San Lucas. Up to 12 guests, 1 cabin, 1 bathroom, captain, fuel, snorkeling gear, and paddleboards included.',
    brand: {
      '@type': 'Brand',
      name: 'Ballard Tours Cabo Yacht Charters'
    },
    sku: 'YACHT-LA-DOLCE-VITA-57FT-CSL',
    offers: {
      '@type': 'AggregateOffer',
      url: `${baseUrl}/${lang}/yachts/la-dolce-vita`,
      priceCurrency: 'USD',
      lowPrice: '1999',
      highPrice: '7500',
      offerCount: '3',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '94'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  );
}

