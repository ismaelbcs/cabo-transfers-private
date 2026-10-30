// src/app/[lang]/yachts/contessa/layout.js
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/yachts/contessa',
      title: "Renta de Yate de Lujo en Cabo San Lucas | Contessa 85 FT Her Shine Marine | Ballard Tours",
      description: "Renta el yate de lujo Contessa de 85 pies Her Shine Marine en Cabo San Lucas. 4 camarotes con baño, cubierta sombreada, equipo de pesca deportiva, 4 paddleboards y menú personalizado por el Mar de Cortés.",
      keywords: [
        "renta de yates los cabos",
        "alquiler de yates cabo san lucas",
        "yate contessa 85ft los cabos",
        "her shine marine 85ft cabo",
        "yates de lujo los cabos",
        "yate privado cabo san lucas todo incluido",
        "paseo en yate mar de cortes",
        "renta de yate 85 pies cabo san lucas"
      ],
      image: '/yachts/contessa/contessa-1.jpg'
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/yachts/contessa',
    title: "85 Ft Her Shine Marine Contessa | Luxury Yacht Charter Cabo San Lucas",
    description: "Charter the 85-foot Her Shine Marine luxury yacht Contessa in Cabo San Lucas. Ideal for exploring the Sea of Cortez with 4 en-suite staterooms, al fresco dining, 4 paddleboards, snorkel gear, and stand-up fishing tackle.",
    keywords: [
      "85 ft her shine marine contessa",
      "contessa yacht cabo san lucas",
      "cabo yacht charters",
      "luxury yacht charter cabo san lucas",
      "private yacht charter los cabos",
      "sea of cortez yacht charter",
      "85ft yacht rental cabo",
      "all inclusive yacht charter cabo san lucas"
    ],
    image: '/yachts/capella-exterior-cruising.jpg'
  });
}

export default async function Layout({ children, params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${BASE_URL}/${lang}/yachts/contessa#product`,
        "name": isEs ? "Renta de Yate de Lujo Contessa 85ft Her Shine Marine" : "85ft Her Shine Marine Contessa Luxury Yacht Charter",
        "image": `${BASE_URL}/yachts/contessa/contessa-1.jpg`,
        "description": isEs 
          ? "Yate de lujo de 85 pies Her Shine Marine Contessa en Cabo San Lucas con 4 camarotes en suite, comedor al aire libre, cubierta superior sombreada, 4 paddleboards, equipo de pesca stand-up y menú todo incluido."
          : "85ft Her Shine Marine Contessa luxury charter yacht in Cabo San Lucas featuring 4 en-suite staterooms, al fresco aft dining, shaded upper deck, 4 stand-up paddleboards, stand-up fishing gear, and all-inclusive dining.",
        "brand": {
          "@type": "Brand",
          "name": "Her Shine Marine"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "3700",
          "highPrice": "7000",
          "offerCount": "4",
          "offers": [
            {
              "@type": "Offer",
              "name": isEs ? "Crucero de 2 Horas" : "2 Hour Cruise",
              "price": "3700",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 4 Horas" : "4 Hours All Inclusive",
              "price": "5000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 6 Horas" : "6 Hours All Inclusive",
              "price": "6000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 8 Horas" : "8 Hours All Inclusive",
              "price": "7000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "39"
        }
      },
      {
        "@type": "TouristTrip",
        "@id": `${BASE_URL}/${lang}/yachts/contessa#trip`,
        "name": isEs ? "Chárter Privado en Yate Contessa 85ft Los Cabos" : "Private 85ft Contessa Yacht Charter Los Cabos",
        "description": isEs 
          ? "Navegación privada por el Arco de Cabo San Lucas, Playa del Amor y el Mar de Cortés a bordo del yate Contessa de 85 pies."
          : "Private cruising tour to Land's End Arch, Lover's Beach, and the Sea of Cortez aboard the 85ft Her Shine Marine Contessa.",
        "touristType": ["Luxury Travel", "Family Vacation", "Sportfishing", "VIP Celebrations"],
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

