// src/app/[lang]/yachts/aquaholic/layout.js
import React from 'react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  const canonicalUrl = `${baseUrl}/${lang}/yachts/aquaholic`;

  const title = isEs
    ? 'Renta de Yate de Lujo 110 FT Horizon Aquaholic en Cabo San Lucas | Hasta 30 Pasajeros'
    : 'Luxury Yacht Charter Cabo | 110 FT Horizon "Aquaholic" (Up to 30 Guests)';

  const description = isEs
    ? 'Reserva el yate de lujo Horizon "Aquaholic" de 110 pies en Cabo San Lucas. Chárters privados para hasta 30 invitados desde $5,900 USD (3h), 4 camarotes, 3 baños, chef privado, mixólogo, barra libre y juguetes acuáticos.'
    : 'Step aboard the "Aquaholic", an exquisite 110ft Horizon luxury yacht in Cabo San Lucas. Private charters for up to 30 guests starting at $5,900 USD (3h) with 4 staterooms, private chef, mixologist, open bar & water toys.';

  const keywords = isEs
    ? [
        'yate aquaholic cabo san lucas',
        '110ft horizon yacht cabo',
        'renta de yates en cabo san lucas para 30 personas',
        'alquiler de yate de lujo cabo san lucas',
        'aquaholic 110ft cabo charter',
        'yates todo incluido los cabos'
      ]
    : [
        'Aquaholic 110ft Horizon yacht Cabo',
        'luxury yacht charter Cabo San Lucas 30 guests',
        '110ft Horizon yacht rental Cabo',
        'private yacht charter Cabo San Lucas all inclusive',
        'Aquaholic yacht Cabo San Lucas',
        'large group yacht rental Los Cabos'
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en/yachts/aquaholic`,
        'es-MX': `${baseUrl}/es/yachts/aquaholic`,
        'x-default': `${baseUrl}/en/yachts/aquaholic`
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
          url: `${baseUrl}/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp`,
          width: 1200,
          height: 630,
          alt: '110 Ft Horizon Aquaholic Luxury Yacht Charter in Cabo San Lucas'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp`]
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

export default async function AquaholicYachtLayout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isEs
      ? 'Yate de Lujo 110 Ft Horizon "Aquaholic" - Chárter Privado en Cabo San Lucas'
      : '110 Ft Horizon "Aquaholic" Luxury Yacht Charter in Cabo San Lucas',
    image: [
      `${baseUrl}/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-hero.webp`,
      `${baseUrl}/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-2.webp`,
      `${baseUrl}/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-5.webp`,
      `${baseUrl}/HORIZON/yate-acuaholic-horizon-110-cabo-san-lucas-7.webp`
    ],
    description: isEs
      ? 'Chárter privado todo incluido a bordo del yate Horizon "Aquaholic" de 110 pies en Cabo San Lucas. 4 camarotes, 3 baños, chef privado, mixólogo/bartender, barra libre y capacidad hasta 30 invitados.'
      : 'All-inclusive private charter aboard the 110ft Horizon "Aquaholic" motor yacht in Cabo San Lucas. Features 4 staterooms, 3 bathrooms, private chef, mixologist/bartender, open bar, and up to 30 guests capacity.',
    brand: {
      '@type': 'Brand',
      name: 'Horizon Yachts'
    },
    sku: 'YACHT-AQUAHOLIC-110FT-CSL',
    offers: {
      '@type': 'AggregateOffer',
      url: `${baseUrl}/${lang}/yachts/aquaholic`,
      priceCurrency: 'USD',
      lowPrice: '5900',
      highPrice: '14650',
      offerCount: '4',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '38',
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

