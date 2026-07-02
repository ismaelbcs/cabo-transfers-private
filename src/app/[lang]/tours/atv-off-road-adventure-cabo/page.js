// src/app/[lang]/tours/atv-off-road-adventure-cabo/page.js
'use client';

import React, { use } from 'react';
import TourDetailPageTemplate from '../../../../components/TourDetailPageTemplate';

export default function TourPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  return (
    <TourDetailPageTemplate
      lang={lang}
      tourId="atv"
      slug="atv-off-road-adventure-cabo"
    />
  );
}
