// src/app/[lang]/yachts/neoprene/layout.js
import React from 'react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  const canonicalUrl = `${baseUrl}/${lang}/yachts/neoprene`;

  const title = isEs
    ? 'Renta de Superyate 108 FT Mangusta "Neoprene" en Cabo San Lucas | Hasta 30 Invitados'
    : '108ft Mangusta Superyacht "Neoprene" Charter Cabo San Lucas | Up to 30 Guests';

  const description = isEs
    ? 'Reserva el exclusivo superyate negro mate Mangusta 108 "Neoprene" en Cabo San Lucas. Chárters privados todo incluido desde $6,700 USD (3h para 10 invitados, máx. 30 en chárter de día / 10 de noche). Incluye Chef privado Christian, bartender personal, barra libre premium, 4 camarotes + suite master, Seabob, kayaks y paddleboards.'
    : 'Charter the iconic matte-black 108ft Mangusta Superyacht "Neoprene" in Cabo San Lucas. All-inclusive private yacht charters starting at $6,700 USD (3-hour minimum for up to 10 base guests, up to 30 day guests / 10 overnight). Includes Private Chef Christian, personal bartender, top-shelf open bar, 4 staterooms + master suite, Seabob, kayaks, paddleboards & lily pad.';

  const keywords = isEs
    ? [
        'yate neoprene cabo san lucas',
        '108ft mangusta superyacht cabo',
        'yate negro mangusta 108 los cabos',
        'renta de superyate para 30 personas cabo san lucas',
        'neoprene 108ft yacht charter cabo',
        'alquiler de yates de lujo todo incluido cabo san lucas'
      ]
    : [
        '108ft Neoprene yacht Cabo San Lucas',
        'Mangusta 108 superyacht charter Cabo',
        'matte black yacht Cabo San Lucas Neoprene',
        'luxury superyacht rental Cabo 30 guests',
        'Neoprene 108ft Mangusta Cabo yacht charter',
        'all inclusive superyacht Cabo San Lucas private chef'
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en/yachts/neoprene`,
        'es-MX': `${baseUrl}/es/yachts/neoprene`,
        'x-default': `${baseUrl}/en/yachts/neoprene`
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
          url: `${baseUrl}/yachts/neopreno/neoprene-gallery-02.jpg`,
          width: 1200,
          height: 630,
          alt: '108ft Matte-Black Mangusta Superyacht Neoprene Charter in Cabo San Lucas'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/yachts/neopreno/neoprene-gallery-02.jpg`]
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

export default async function NeopreneYachtLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEs
      ? 'Superyate 108 Ft Mangusta "Neoprene" - Chárter Privado en Cabo San Lucas'
      : '108ft Mangusta Superyacht "Neoprene" Charter in Cabo San Lucas',
    image: [
      `${baseUrl}/yachts/neopreno/neoprene-gallery-02.jpg`,
      `${baseUrl}/yachts/neopreno/neoprene-gallery-03.jpg`,
      `${baseUrl}/yachts/neopreno/neoprene-gallery-05.jpg`,
      `${baseUrl}/yachts/neopreno/DSC03705.jpg`,
      `${baseUrl}/yachts/neopreno/neoprene-gallery-06.jpg`,
      `${baseUrl}/yachts/neopreno/neoprene-gallery-04.jpg`
    ],
    description: isEs
      ? 'El superyate más distintivo en el agua de Cabo San Lucas: Mangusta 108 negro mate "Neoprene". Capacidad hasta 30 invitados en chárter de día (10 en pernocta), 4 camarotes + suite master, Chef privado Christian, bartender personal, barra libre premium, club de playa a bordo, Seabob, kayaks, paddleboards y esnórquel.'
      : 'The most distinctive vessel on the water in Cabo: the matte-black Mangusta 108 Superyacht "Neoprene". Up to 30 guests for day charters (10 overnight), 4 staterooms + spacious master suite, Private Chef Christian, personal bartender, top-shelf open bar, onboard beach club, Seabob, kayaks, paddleboards, lily pad & snorkel gear.',
    brand: {
      '@type': 'Brand',
      name: 'Mangusta Superyachts / Ballard Tours VIP Charters'
    },
    sku: 'CABO-YACHT-MANGUSTA-108-NEOPRENE',
    offers: {
      '@type': 'AggregateOffer',
      url: `${baseUrl}/${lang}/yachts/neoprene`,
      priceCurrency: 'USD',
      lowPrice: '6700',
      highPrice: '16700',
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
      reviewCount: '48',
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
