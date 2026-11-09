// src/app/[lang]/cabo-yacht-charters/layout.js
import { generatePageMetadata, BASE_URL } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/cabo-yacht-charters',
      title: "Renta de Yates de Lujo en Los Cabos | Yate Capella 116ft Azimut-Benetti | Ballard Tours",
      description: "Exclusivo alquiler del superyate Capella de 116 pies en Cabo San Lucas. 5 camarotes de lujo, jacuzzi en cubierta, chef galardonado, barra libre premium y tender de pesca de 31 pies. Traslados VIP disponibles.",
      keywords: [
        "renta de yates los cabos",
        "alquiler de yates cabo san lucas",
        "yate capella 116ft los cabos",
        "yates de lujo los cabos",
        "yate privado cabo san lucas todo incluido",
        "charter de yates los cabos azimut",
        "paseo en yate el arco cabo san lucas",
        "renta de superyates cabo san lucas",
        "capella azimut benetti cabo"
      ],
      image: '/yachts/capella-arch.jpg'
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/cabo-yacht-charters',
    title: "Cabo Yacht Charters | 116 ft Luxury Superyacht Capella | Los Cabos Yacht Rental",
    description: "Private luxury yacht charter in Cabo San Lucas aboard the 116 ft Azimut-Benetti Capella. 5 luxury staterooms, flybridge jacuzzi, private chef, premium open bar, 31ft Pursuit tender & water toys. Book now.",
    keywords: [
      "cabo yacht charters",
      "luxury yacht rental cabo san lucas",
      "rent yacht los cabos",
      "capella yacht cabo",
      "116 ft azimut benetti yacht charter cabo",
      "private yacht rental los cabos all inclusive",
      "cabo superyacht rental",
      "sunset yacht cruise cabo san lucas",
      "yacht charters cabo san lucas mexico"
    ],
    image: '/yachts/capella-arch.jpg'
  });
}

export default async function Layout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  // Schema Markup Structured Data for Google (Product, TouristTrip, FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${BASE_URL}/${lang}/cabo-yacht-charters#product`,
        "name": isEs ? "Renta de Yate de Lujo Capella 116ft Azimut-Benetti" : "Capella 116ft Azimut-Benetti Luxury Yacht Charter",
        "image": `${BASE_URL}/yachts/capella-arch.jpg`,
        "description": isEs 
          ? "Exclusivo superyate de 116 pies Azimut-Benetti en Los Cabos con jacuzzi en cubierta, chef privado internacional, barra libre y juguetes acuáticos."
          : "Exclusive 116ft Azimut-Benetti superyacht charter in Los Cabos featuring upper deck jacuzzi, international private chef, open bar, and premium water toys.",
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
        "@id": `${BASE_URL}/${lang}/cabo-yacht-charters#trip`,
        "name": isEs ? "Paseo Privado en Yate de Lujo Los Cabos" : "Private Luxury Yacht Charter Los Cabos",
        "description": isEs 
          ? "Navegación privada por el Arco de Cabo San Lucas, Playa del Amor, Bahía de Santa María y el Mar de Cortés."
          : "Private cruising tour to Land's End Arch, Lover's Beach, Santa Maria Bay, and the Sea of Cortez.",
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
