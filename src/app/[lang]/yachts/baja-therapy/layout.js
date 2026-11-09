// src/app/[lang]/yachts/baja-therapy/layout.js
import React from 'react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  const canonicalUrl = `${baseUrl}/${lang}/yachts/baja-therapy`;

  const title = isEs
    ? 'Renta de Pontón de Lujo 30 Ft "Baja Therapy" Doble Piso en Cabo San Lucas | Hasta 20 Pasajeros'
    : '30 Ft "Baja Therapy" Luxury Double-Deck Pontoon Charter Cabo San Lucas | Up to 20 Guests';

  const description = isEs
    ? 'Sube a bordo de "Baja Therapy", un pontón de lujo de doble piso de 30 pies en Los Cabos ideal para cumpleaños, despedidas de soltero(a) y celebraciones de hasta 20 pasajeros. Desde $1,560 USD (3h para 10 invitados) con barra libre, tobogán desde el segundo piso, sonido premium, esnórquel, paddleboard y tapete flotante.'
    : 'Step aboard the 30 Ft "Baja Therapy", a luxury double-deck pontoon designed for unforgettable private charters in Los Cabos up to 20 guests. Starting at $1,560 USD (3h for 10 base guests) with open bar, upper deck lounge & water slide, premium sound system, snorkel gear, paddleboard & floating mat.';

  const keywords = isEs
    ? [
        '30 ft baja therapy cabo san lucas',
        'ponton de lujo doble piso los cabos',
        'party boat cabo san lucas 20 personas',
        'renta de barco para cumpleaños y despedidas cabo',
        'baja therapy pontoon charter cabo',
        'crucero al atardecer el arco cabo san lucas'
      ]
    : [
        '30 Ft Baja Therapy Cabo San Lucas',
        'luxury double-deck pontoon Los Cabos',
        'Cabo party boat charter 20 guests',
        'bachelor bachelorette party boat Cabo San Lucas',
        'Baja Therapy yacht charter Cabo',
        'Sunset Cruise Cabo 30ft Baja Therapy'
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en/yachts/baja-therapy`,
        'es-MX': `${baseUrl}/es/yachts/baja-therapy`,
        'x-default': `${baseUrl}/en/yachts/baja-therapy`
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
          url: `${baseUrl}/yachts/Baja%20Therapy/cover.Bzegnl3K_1cRkvD.webp`,
          width: 1200,
          height: 630,
          alt: '30 Ft Baja Therapy Luxury Double-Deck Pontoon Charter in Cabo San Lucas'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/yachts/Baja%20Therapy/cover.Bzegnl3K_1cRkvD.webp`]
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

export default async function BajaTherapyYachtLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEs
      ? 'Pontón de Lujo Doble Piso 30 Ft "Baja Therapy" - Chárter Privado en Los Cabos'
      : '30 Ft "Baja Therapy" Luxury Double-Deck Pontoon Charter in Los Cabos',
    image: [
      `${baseUrl}/yachts/Baja%20Therapy/cover.Bzegnl3K_1cRkvD.webp`,
      `${baseUrl}/yachts/Baja%20Therapy/4.CCpvPTJP_ZcyhUS.webp`,
      `${baseUrl}/yachts/Baja%20Therapy/1.5MxG9lIe_wdbkQ.webp`,
      `${baseUrl}/yachts/Baja%20Therapy/2.CHNNoIqn_Z1VPJSD.webp`,
      `${baseUrl}/yachts/Baja%20Therapy/3.D2bq6Z5Q_Z139WxH.webp`
    ],
    description: isEs
      ? 'Pontón de lujo de doble piso (2 niveles) diseñado para chárters privados inolvidables en Los Cabos, ideal para cumpleaños, despedidas y celebraciones grupales de hasta 20 pasajeros (10 incluidos en tarifa base). Incluye barra libre, tripulación profesional, sistema de sonido premium, tobogán, esnórquel, paddleboard y tapete flotante.'
      : 'A luxury double-deck pontoon designed for unforgettable private charters in Los Cabos, perfect for birthdays, bachelor/bachelorette parties, and group celebrations up to 20 passengers (10 included in base rate). Features open bar, professional crew, upper deck lounge & slide, premium sound system, snorkel gear, paddleboard & floating mat.',
    brand: {
      '@type': 'Brand',
      name: 'Baja Therapy / Ballard Tours VIP Charters'
    },
    sku: 'CABO-PONTOON-30FT-BAJA-THERAPY',
    offers: {
      '@type': 'AggregateOffer',
      url: `${baseUrl}/${lang}/yachts/baja-therapy`,
      priceCurrency: 'USD',
      lowPrice: '1560',
      highPrice: '2430',
      offerCount: '4',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Cabo Private Airport Transfers & VIP Yacht Charters'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '39',
      bestRating: '5',
      worstRating: '1'
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
