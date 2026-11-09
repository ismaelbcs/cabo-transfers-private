// src/app/[lang]/yachts/capella/layout.js
import CapellaYachtLayout, { generateMetadata as baseMetadata } from '../layout.js';

export async function generateMetadata(props) {
  const meta = await baseMetadata(props);
  const resolvedParams = await props.params;
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const baseUrl = 'https://www.caboprivateairporttransfers.com';
  const canonicalUrl = `${baseUrl}/${lang}/yachts/capella`;

  const title = isEs
    ? 'Yate Capella 116 FT Azimut-Benetti en Cabo San Lucas | Chárter Privado Todo Incluido'
    : 'Capella 116 FT Azimut-Benetti Superyacht Charter Cabo San Lucas | All-Inclusive';

  const description = isEs
    ? 'Reserva el superyate Capella de 116 pies Azimut-Benetti en Cabo San Lucas. 5 camarotes, jacuzzi en flybridge, chef privado, barra libre premium y lancha Pursuit de 31 pies incluida.'
    : 'Charter the 116ft Capella Azimut-Benetti superyacht in Cabo San Lucas. Features 5 staterooms, flybridge jacuzzi, private chef, open bar, water toys, and a 31ft Pursuit sportfishing boat.';

  return {
    ...meta,
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en/yachts/capella`,
        'es-MX': `${baseUrl}/es/yachts/capella`,
        'x-default': `${baseUrl}/en/yachts/capella`
      }
    },
    openGraph: {
      ...(meta.openGraph || {}),
      title,
      description,
      url: canonicalUrl
    }
  };
}

export default CapellaYachtLayout;
