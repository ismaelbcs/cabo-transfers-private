// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-neoprene/layout.js
import NeopreneYachtLayout, { generateMetadata as baseMetadata } from '../yachts/neoprene/layout';

export async function generateMetadata(props) {
  const meta = await baseMetadata(props);
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang || 'en';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  return {
    ...meta,
    alternates: {
      canonical: `${baseUrl}/${lang}/luxury-yacht-charter-cabo-san-lucas-neoprene`,
      languages: {
        'en-US': `${baseUrl}/en/luxury-yacht-charter-cabo-san-lucas-neoprene`,
        'es-MX': `${baseUrl}/es/luxury-yacht-charter-cabo-san-lucas-neoprene`,
        'x-default': `${baseUrl}/en/luxury-yacht-charter-cabo-san-lucas-neoprene`
      }
    }
  };
}

export default NeopreneYachtLayout;

