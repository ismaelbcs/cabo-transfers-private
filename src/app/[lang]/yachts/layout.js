// src/app/[lang]/yachts/layout.js
import { generatePageMetadata, BASE_URL } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/yachts',
      title: "Renta de Yate de Lujo en Cabo San Lucas | Capella 116 FT | Ballard Tours",
      description: "Vive la mejor experiencia de renta de yate de lujo en Cabo San Lucas a bordo del Capella, un superyate Azimut-Benetti de 116 pies con tripulación profesional, jacuzzi, juguetes acuáticos, chef privado y navegación exclusiva en Los Cabos.",
      keywords: [
        "Luxury Yacht Charter Cabo San Lucas",
        "Yacht Rental Cabo San Lucas",
        "Private Yacht Charter Los Cabos",
        "Luxury Yacht Rental Cabo",
        "Azimut Yacht Charter",
        "Private Yacht Tours Cabo",
        "Yacht Rental Baja California",
        "Cabo San Lucas Private Boat Charter",
        "Luxury Yacht Experience Mexico",
        "Cabo Yacht Fishing and Snorkeling",
        "renta de yates los cabos",
        "alquiler de yates cabo san lucas",
        "yate capella 116ft los cabos",
        "yates de lujo los cabos"
      ],
      image: '/yachts/capella-exterior-cruising.jpg'
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/yachts',
    title: "Luxury Yacht Charter Cabo San Lucas | Capella 116 FT",
    description: "Experience a luxury yacht charter in Cabo San Lucas aboard Capella, a 116-foot Azimut-Benetti yacht featuring a professional crew, jacuzzi, water toys and private cruising in Los Cabos.",
    keywords: [
      "Luxury Yacht Charter Cabo San Lucas",
      "Yacht Rental Cabo San Lucas",
      "Private Yacht Charter Los Cabos",
      "Luxury Yacht Rental Cabo",
      "Azimut Yacht Charter",
      "Private Yacht Tours Cabo",
      "Yacht Rental Baja California",
      "Cabo San Lucas Private Boat Charter",
      "Luxury Yacht Experience Mexico",
      "Cabo Yacht Fishing and Snorkeling",
      "cabo yacht charters",
      "rent yacht los cabos",
      "capella yacht cabo",
      "116 ft azimut benetti yacht charter cabo"
    ],
    image: '/yachts/capella-exterior-cruising.jpg'
  });
}

export default async function Layout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  // Schema Markup Structured Data for Google (Product, TouristTrip, Offer)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${BASE_URL}/${lang}/yachts#product`,
        "name": isEs ? "Renta de Yate de Lujo Capella 116ft Azimut-Benetti" : "Capella 116ft Azimut-Benetti Luxury Yacht Charter",
        "image": `${BASE_URL}/yachts/capella-exterior-profile.jpg`,
        "description": isEs 
          ? "Exclusivo superyate de 116 pies Azimut-Benetti en Los Cabos con jacuzzi en cubierta, asoleadero de proa, mosaicos artesanales, chef privado internacional, barra libre y juguetes acuáticos."
          : "Exclusive 116ft Azimut-Benetti superyacht charter in Los Cabos featuring upper deck jacuzzi, bow sunpad, hand-laid mosaic companionway, international private chef, open bar, and water toys.",
        "brand": {
          "@type": "Brand",
          "name": "Azimut-Benetti"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "8000",
          "highPrice": "16000",
          "offerCount": "4",
          "offers": [
            {
              "@type": "Offer",
              "name": isEs ? "Paseo al Atardecer de 2.5 Horas" : "2.5 Hours Sunset Cruise",
              "price": "8000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 4 Horas" : "4 Hours All Inclusive Charter",
              "price": "11000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 6 Horas" : "6 Hours All Inclusive Charter",
              "price": "13500",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Día Completo Todo Incluido de 8 Horas" : "8 Hours Full Day All Inclusive",
              "price": "16000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "48"
        }
      },
      {
        "@type": "TouristTrip",
        "@id": `${BASE_URL}/${lang}/yachts#trip`,
        "name": isEs ? "Paseo Privado en Yate de Lujo Los Cabos" : "Private Luxury Yacht Charter Los Cabos",
        "description": isEs 
          ? "Navegación privada por el Arco de Cabo San Lucas, Playa del Amor, Bahía de Santa María y el Mar de Cortés a bordo del Capella 116ft."
          : "Private cruising tour to Land's End Arch, Lover's Beach, Santa Maria Bay, and the Sea of Cortez aboard the 116ft Capella.",
        "touristType": ["Luxury Travel", "Family Vacation", "VIP Celebrations", "Corporate Events"],
        "provider": {
          "@type": "TravelAgency",
          "name": "Ballard Tours Los Cabos",
          "url": BASE_URL
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
