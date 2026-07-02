// src/app/[lang]/tours/pirate-ship-sunset-tour-cabo/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="pirate_show_cruise"
      slug="pirate-ship-sunset-tour-cabo"
    />
  );
}
