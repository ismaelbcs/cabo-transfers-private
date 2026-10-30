// src/app/[lang]/yachts/papillon-9/layout.js
import React from 'react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  const canonicalUrl = `${baseUrl}/${lang}/yachts/papillon-9`;

  const title = isEs
    ? 'Renta de Yate Negro 80 FT Sunseeker Manhattan "Papillon 9" en Cabo San Lucas'
    : 'Black Yacht in Cabo | 80 FT Sunseeker Manhattan "Papillon 9" Charter';

  const description = isEs
    ? 'Explora Los Cabos a bordo del icónico Yate Negro Sunseeker Manhattan de 80 pies "Papillon 9". 1 a 12 invitados base (hasta 30 máx.), 4 recámaras, 4 baños, plataforma hidráulica, chef a bordo, barra libre premium y equipo de pesca.'
    : 'Explore Cabo like never before aboard the 80ft Black Yacht Sunseeker Manhattan "Papillon 9". All-inclusive private charters for 1 to 12 base guests (up to 30 max) with 4 bedrooms, hydraulic swim platform, private chef, open bar & fishing gear.';

  const keywords = isEs
    ? [
        'yate negro cabo san lucas',
        'sunseeker manhattan 80ft cabo',
        'papillon 9 yacht cabo san lucas',
        'renta de yate negro en los cabos',
        'alquiler de yates para 30 personas cabo',
        'black yacht in cabo'
      ]
    : [
        'black yacht in Cabo',
        '80ft Sunseeker Manhattan Cabo San Lucas',
        'Papillon 9 yacht charter Cabo',
        'luxury black yacht rental Cabo San Lucas',
        'all inclusive yacht charter Cabo 30 guests',
        'Sunseeker 80ft Cabo rental'
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en/yachts/papillon-9`,
        'es-MX': `${baseUrl}/es/yachts/papillon-9`,
        'x-default': `${baseUrl}/en/yachts/papillon-9`
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
          url: `${baseUrl}/yachts/papillon-9/papillon-1.avif`,
          width: 1200,
          height: 630,
          alt: '80 Ft Black Sunseeker Manhattan Papillon 9 Yacht Charter in Cabo San Lucas'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/yachts/papillon-9/papillon-1.avif`]
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

export default async function Papillon9YachtLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEs
      ? 'Yate Negro 80 Ft Sunseeker Manhattan "Papillon 9" - Chárter Privado en Cabo San Lucas'
      : '80 Ft Black Yacht Sunseeker Manhattan "Papillon 9" Charter in Cabo San Lucas',
    image: [
      `${baseUrl}/yachts/papillon-9/papillon-1.avif`,
      `${baseUrl}/yachts/papillon-9/papillon-3.avif`,
      `${baseUrl}/yachts/papillon-9/papillon-15.avif`,
      `${baseUrl}/yachts/papillon-9/papillon-16.avif`
    ],
    description: isEs
      ? 'Chárter privado todo incluido a bordo del Yate Negro Sunseeker Manhattan de 80 pies "Papillon 9" en Cabo San Lucas. 4 recámaras, 4 baños, plataforma hidráulica, chef privado, barra libre y capacidad hasta 30 invitados.'
      : 'All-inclusive private charter aboard the 80ft Black Sunseeker Manhattan "Papillon 9" in Cabo San Lucas. Features 4 bedrooms, 4 bathrooms, hydraulic swim platform, stabilizers, private chef, open bar, and up to 30 guests capacity.',
    brand: {
      '@type': 'Brand',
      name: 'Sunseeker'
    },
    sku: 'YACHT-PAPILLON9-80FT-CSL',
    offers: {
      '@type': 'AggregateOffer',
      url: `${baseUrl}/${lang}/yachts/papillon-9`,
      priceCurrency: 'USD',
      lowPrice: '5500',
      highPrice: '10300',
      offerCount: '4',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '44',
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

