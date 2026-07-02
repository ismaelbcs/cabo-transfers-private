// src/app/[lang]/tours/espiritu-santo-island-tour-from-la-paz/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="isla_espiritu_santo"
      slug="espiritu-santo-island-tour-from-la-paz"
    />
  );
}
