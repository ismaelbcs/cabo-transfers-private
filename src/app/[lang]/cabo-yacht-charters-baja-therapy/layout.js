// src/app/[lang]/cabo-yacht-charters-baja-therapy/layout.js
import BajaTherapyYachtLayout, { generateMetadata as baseMetadata } from '../yachts/baja-therapy/layout';

export async function generateMetadata(props) {
  const meta = await baseMetadata(props);
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang || 'en';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';

  return {
    ...meta,
    alternates: {
      canonical: `${baseUrl}/${lang}/cabo-yacht-charters-baja-therapy`,
      languages: {
        'en-US': `${baseUrl}/en/cabo-yacht-charters-baja-therapy`,
        'es-MX': `${baseUrl}/es/cabo-yacht-charters-baja-therapy`,
        'x-default': `${baseUrl}/en/cabo-yacht-charters-baja-therapy`
      }
    }
  };
}

export default BajaTherapyYachtLayout;
