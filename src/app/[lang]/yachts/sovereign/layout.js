// src/app/[lang]/yachts/sovereign/layout.js
import { generatePageMetadata, BASE_URL } from '../../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/yachts/sovereign',
      title: "Renta de Superyate de Lujo y Pesca en Cabo | Sovereign 130 FT | Ballard Tours",
      description: "Renta el superyate de lujo Sovereign de 130 pies en Cabo San Lucas. Reconstruido en 2018 con estabilizadores Zero-Speed, 20 carretes Shimano Talica, silla de pelea, 2 Sea-Doo Sparks, tender de 18ft y capacidad para 25 invitados.",
      keywords: [
        "Sovereign 130ft yacht charter Cabo",
        "130 ft Sovereign Yachts Cabo San Lucas",
        "renta de superyates cabo san lucas",
        "yate de lujo y pesca deportiva los cabos",
        "superyate 130 pies cabo san lucas",
        "charter de pesca de lujo marlin cabo",
        "yates para 25 personas cabo san lucas"
      ],
      image: '/yachts/sovereign/sovereign-6.jpg'
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/yachts/sovereign',
    title: "130 Ft Sovereign Luxury Superyacht & Sportfishing Charter Cabo San Lucas",
    description: "Charter the 130ft Sovereign luxury superyacht and sportfisher in Cabo San Lucas. Totally rebuilt in 2018 with Zero-Speed stabilizers, 20 Custom Talica Shimano reels, fighting chair, 2 Sea-Doo Sparks, 18ft tender & up to 25 guests.",
    keywords: [
      "130 ft Sovereign Yachts Cabo San Lucas",
      "Sovereign 130ft luxury yacht charter Cabo",
      "cabo superyacht rental",
      "luxury sportfishing superyacht cabo",
      "private yacht charter 25 guests cabo san lucas",
      "tournament sportfishing yacht cabo",
      "130ft yacht rental los cabos"
    ],
    image: '/yachts/sovereign/sovereign-6.jpg'
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
        "@id": `${BASE_URL}/${lang}/yachts/sovereign#product`,
        "name": isEs ? "Superyate de Lujo y Pesca Deportiva Sovereign 130ft" : "130ft Sovereign Luxury Superyacht & Sportfishing Charter",
        "image": `${BASE_URL}/yachts/sovereign/sovereign-6.jpg`,
        "description": isEs 
          ? "Superyate de 130 pies totalmente reconstruido en 2018 en Cabo San Lucas con estabilizadores Zero-Speed, 20 carretes Shimano Talica, silla de pelea profesional, 2 Sea-Doo Sparks, lancha de 18 pies y 5 camarotes de lujo."
          : "130ft luxury sportfisher and cruising superyacht in Cabo San Lucas, totally rebuilt in 2018 with Zero-Speed stabilizers, 20 Custom Talica Shimano reels, fighting chair, 2 Sea-Doo Sparks, 18ft runabout, and 5 staterooms.",
        "brand": {
          "@type": "Brand",
          "name": "Sovereign Yachts"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "15000",
          "highPrice": "25000",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 4 Horas" : "4 Hours All Inclusive",
              "price": "15000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 6 Horas" : "6 Hours All Inclusive",
              "price": "20000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": isEs ? "Chárter Todo Incluido de 8 Horas" : "8 Hours All Inclusive",
              "price": "25000",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": "34"
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

