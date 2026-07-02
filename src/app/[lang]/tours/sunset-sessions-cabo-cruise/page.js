// src/app/[lang]/tours/sunset-sessions-cabo-cruise/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="sunset_sessions"
      slug="sunset-sessions-cabo-cruise"
    />
  );
}
