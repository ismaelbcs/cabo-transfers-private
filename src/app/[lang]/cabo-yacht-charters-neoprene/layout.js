// src/app/[lang]/cabo-yacht-charters-neoprene/layout.js
import NeopreneYachtLayout, { generateMetadata as baseMetadata } from '../yachts/neoprene/layout';

export async function generateMetadata(props) {
  const meta = await baseMetadata(props);
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang || 'en';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  return {
    ...meta,
    alternates: {
      canonical: `${baseUrl}/${lang}/cabo-yacht-charters-neoprene`,
      languages: {
        'en-US': `${baseUrl}/en/cabo-yacht-charters-neoprene`,
        'es-MX': `${baseUrl}/es/cabo-yacht-charters-neoprene`,
        'x-default': `${baseUrl}/en/cabo-yacht-charters-neoprene`
      }
    }
  };
}

export default NeopreneYachtLayout;

