// src/app/[lang]/tours/cabo-san-lucas-snorkel-tour/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="snorkeling_cabo_bay"
      slug="cabo-san-lucas-snorkel-tour"
    />
  );
}
