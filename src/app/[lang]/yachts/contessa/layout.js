// src/app/[lang]/yachts/contessa/layout.js
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/luxury-sportfishing-yacht-charter-cabo-contessa',
      title: "Chárter de Yate de Lujo y Pesca Deportiva en Cabo | Contessa 85 FT",
      description: "Reserva un chárter de yate de lujo y pesca deportiva en Cabo San Lucas a bordo del Contessa de 85 pies con equipo de pesca de altura, tangones, vivero de carnada viva, alta cocina y navegación privada.",
      keywords: [
        "Luxury Sportfishing Yacht Charter Cabo",
        "Cabo deep sea fishing",
        "Private fishing yacht Cabo",
        "Marlin fishing charter Cabo San Lucas",
        "Cabo offshore fishing yacht",
        "Luxury sportfishing boat Los Cabos",
        "Contessa 85ft Cabo yacht charter",
        "Sea of Cortez yacht tours",
        "renta de yate de pesca de lujo cabo san lucas",
        "yate contessa 85ft los cabos"
      ],
      image: '/yachts/contessa/contessa-1.jpg'
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/luxury-sportfishing-yacht-charter-cabo-contessa',
    title: "Luxury Sportfishing Yacht Charter Cabo | Contessa 85 FT",
    description: "Book a luxury sportfishing yacht charter in Cabo San Lucas aboard Contessa, an 85ft yacht featuring deep sea fishing gear, outriggers, live bait well, gourmet dining and private cruising.",
    keywords: [
      "Luxury Sportfishing Yacht Charter Cabo",
      "Cabo deep sea fishing",
      "Private fishing yacht Cabo",
      "Marlin fishing charter",
      "Cabo offshore fishing",
      "Luxury sportfishing boat",
      "Luxury yacht rental Cabo",
      "Private yacht cruise Cabo San Lucas",
      "Family yacht experience Los Cabos",
      "Sunset yacht charter Cabo",
      "Sea of Cortez yacht tours",
      "85 ft her shine marine contessa"
    ],
    image: '/yachts/contessa/contessa-1.jpg'
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
        "@id": `${BASE_URL}/${lang}/luxury-sportfishing-yacht-charter-cabo-contessa#product`,
        "name": isEs ? "Chárter de Yate de Lujo y Pesca Deportiva Contessa 85ft" : "Contessa – Luxury Sportfishing Yacht Charter in Cabo San Lucas (85ft)",
        "image": `${BASE_URL}/yachts/contessa/contessa-1.jpg`,
        "description": isEs 
          ? "Yate de lujo y pesca deportiva de 85 pies Her Shine Marine Contessa en Cabo San Lucas con equipo de pesca de altura Penn y Avet, vivero de carnada viva, tangones, 4 camarotes en suite, 4 paddleboards y alta gastronomía."
          : "Book a luxury sportfishing yacht charter in Cabo San Lucas aboard Contessa, an 85ft yacht featuring deep sea fishing gear, outriggers, live bait well, gourmet dining and private cruising.",
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
        "@type": "FAQPage",
        "@id": `${BASE_URL}/${lang}/luxury-sportfishing-yacht-charter-cabo-contessa#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Can you go deep sea fishing aboard Contessa in Cabo San Lucas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Contessa is equipped for private sportfishing adventures, including offshore fishing and bottom fishing. Her onboard equipment includes outriggers, Penn and Avet fishing tackle, fighting belts, harnesses, and a portable live bait well."
            }
          },
          {
            "@type": "Question",
            "name": "What fish can you catch in Cabo San Lucas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Cabo San Lucas is known for marlin, yellowfin tuna, dorado, wahoo, roosterfish, yellowtail, and snapper. Available species vary depending on the season and fishing conditions."
            }
          },
          {
            "@type": "Question",
            "name": "Is Contessa suitable for both fishing and cruising?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Contessa combines sportfishing equipment with luxury accommodations, spacious entertainment areas, snorkeling gear, and paddleboards, making her suitable for guests interested in both fishing and relaxing on the water."
            }
          }
        ]
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
