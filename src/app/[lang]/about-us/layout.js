// src/app/[lang]/about-us/layout.js
import { generatePageMetadata } from '../../../lib/seoHelper.js';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'en';

  if (lang === 'es') {
    return generatePageMetadata({
      lang: 'es',
      path: '/about-us',
      title: "Quiénes Somos | Ballard Tours Los Cabos",
      description: "Conoce más sobre Ballard Tours, tu empresa confiable de transporte privado y tours exclusivos en Los Cabos."
    });
  }

  return generatePageMetadata({
    lang: 'en',
    path: '/about-us',
    title: "About Us | Ballard Tours Los Cabos",
    description: "Learn more about Ballard Tours, your trusted provider for private airport transportation and exclusive tours in Los Cabos."
  });
}

export default function Layout({ children }) {
  return children;
}
