'use client';

import React, { useEffect, useState } from 'react';
import { Zap, Eye, Flame } from 'lucide-react';

export default function UrgencyBanner({ lang = 'es', locationName = '' }) {
  const [dayIndex, setDayIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Usamos el día actual para que sea consistente a lo largo del día
    // pero cambie al día siguiente. 0-6 (Domingo a Sábado)
    setDayIndex(new Date().getDay());
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evitar problemas de hidratación en SSR

  // Definimos los 3 tipos de mensajes/banners
  const banners = [
    {
      // Días 0, 3, 6 (Dom, Mié, Sáb)
      icon: <Zap className="text-yellow-600 fill-yellow-600 shrink-0" size={20} />,
      textES: "Se agota rápido: Solo quedan 2 SUV's disponibles para traslados este fin de semana.",
      textEN: "Selling out fast: Only 2 SUVs left for transfers this weekend.",
      bgClass: "bg-yellow-50 border-yellow-200",
      textClass: "text-yellow-900"
    },
    {
      // Días 1, 4 (Lun, Jue)
      icon: <Eye className="text-blue-600 shrink-0" size={20} />,
      textES: `43 personas están viendo traslados a ${locationName} ahora mismo.`,
      textEN: `43 people are looking at transfers to ${locationName} right now.`,
      bgClass: "bg-blue-50 border-blue-200",
      textClass: "text-blue-900"
    },
    {
      // Días 2, 5 (Mar, Vie)
      icon: <Flame className="text-red-600 fill-red-600 shrink-0" size={20} />,
      textES: "Alta demanda para temporada alta. Asegura tu vehículo hoy.",
      textEN: "High demand for peak season. Secure your vehicle today.",
      bgClass: "bg-red-50 border-red-200",
      textClass: "text-red-900"
    }
  ];

  const activeBannerIndex = dayIndex % 3;
  const activeBanner = banners[activeBannerIndex];

  return (
    <div className={`mt-0 mb-5 p-3 rounded-xl border ${activeBanner.bgClass} flex items-center gap-3 animate-fade-in shadow-sm`}>
      {activeBanner.icon}
      <span className={`text-sm font-semibold leading-snug ${activeBanner.textClass}`}>
        {lang === 'es' ? activeBanner.textES : activeBanner.textEN}
      </span>
    </div>
  );
}
