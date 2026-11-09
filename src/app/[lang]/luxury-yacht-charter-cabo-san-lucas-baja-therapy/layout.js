// src/app/[lang]/luxury-yacht-charter-cabo-san-lucas-baja-therapy/layout.js
import BajaTherapyYachtLayout, { generateMetadata as baseMetadata } from '../yachts/baja-therapy/layout';

export async function generateMetadata(props) {
  const meta = await baseMetadata(props);
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang || 'en';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  return {
    ...meta,
    alternates: {
      canonical: `${baseUrl}/${lang}/luxury-yacht-charter-cabo-san-lucas-baja-therapy`,
      languages: {
        'en-US': `${baseUrl}/en/luxury-yacht-charter-cabo-san-lucas-baja-therapy`,
        'es-MX': `${baseUrl}/es/luxury-yacht-charter-cabo-san-lucas-baja-therapy`,
        'x-default': `${baseUrl}/en/luxury-yacht-charter-cabo-san-lucas-baja-therapy`
      }
    }
  };
}

export default BajaTherapyYachtLayout;
