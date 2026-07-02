// src/app/[lang]/tours/camel-safari-tour-cabo-san-lucas/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="camellos"
      slug="camel-safari-tour-cabo-san-lucas"
    />
  );
}
