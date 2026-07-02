// src/app/[lang]/tours/swim-with-whale-sharks-la-paz-cabo/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="tiburon_ballena"
      slug="swim-with-whale-sharks-la-paz-cabo"
    />
  );
}
