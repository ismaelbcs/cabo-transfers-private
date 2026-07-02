// src/app/[lang]/tours/sunset-fajita-cruise-cabo/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="sunset_fajita_cruise"
      slug="sunset-fajita-cruise-cabo"
    />
  );
}
