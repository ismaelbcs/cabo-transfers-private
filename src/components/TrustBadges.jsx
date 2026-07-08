'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function TrustBadges({ lang = 'es', showFlightMonitoring = true }) {
  return (
    <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl shadow-sm animate-fade-in">
      <ul className="space-y-2.5">
        <li className="flex items-start gap-2">
          <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} />
          <span className="text-sm font-medium text-slate-700 leading-snug">
            {lang === 'es' ? 'Cancelación Gratuita (Hasta 24 horas antes)' : 'Free Cancellation (Up to 24 hours before)'}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} />
          <span className="text-sm font-medium text-slate-700 leading-snug">
            {lang === 'es' ? 'Reserva ahora, paga después (o paga al llegar)' : 'Book now, pay later (or pay on arrival)'}
          </span>
        </li>
        {showFlightMonitoring && (
          <li className="flex items-start gap-2">
            <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} />
            <span className="text-sm font-medium text-slate-700 leading-snug">
              {lang === 'es' ? 'Monitoreo de vuelo gratuito (Te esperamos sin costo extra)' : 'Free flight monitoring (We wait at no extra cost)'}
            </span>
          </li>
        )}
        <li className="flex items-start gap-2">
          <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} />
          <span className="text-sm font-medium text-slate-700 leading-snug">
            {lang === 'es' ? 'Sin cargos ocultos (El precio que ves es el final)' : 'No hidden fees (The price you see is final)'}
          </span>
        </li>
      </ul>
    </div>
  );
}
