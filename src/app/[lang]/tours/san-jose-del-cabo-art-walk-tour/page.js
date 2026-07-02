// src/app/[lang]/tours/san-jose-del-cabo-art-walk-tour/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="artwalk"
      slug="san-jose-del-cabo-art-walk-tour"
    />
  );
}
