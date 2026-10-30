// src/app/[lang]/tours/[slug]/page.js
'use client';

// 1. IMPORTAMOS 'use' AQUÍ
import { use } from 'react';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
import { CheckCircle, ChevronRight } from 'lucide-react';

import { useBooking } from '../../../../context/BookingContext';
import { toursData, toursLandingPages } from '../../../../data/seoData';
import TourGuideSEO from '../../../../components/TourGuideSEO';

export default function TourLandingPage({ params }) {
  // 2. DESENVOLVEMOS LOS PARÁMETROS (El arreglo para Next.js 15)
  const resolvedParams = use(params);
  const lang = resolvedParams.lang || 'en';
  const slug = resolvedParams.slug;

  const router = useRouter();
  const { setReserva, setServicioSeleccionado, setImagenTourDestacada, setPaso } = useBooking();

  // Resolución síncrona en SSR para que Googlebot reciba el HTML completo sin depender de useEffect
  const tourSEO = toursLandingPages.find(t => t.slug === slug);
  const tourDB = toursData.find(t => t.slug === slug);

  if (!tourSEO || !tourDB) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          {lang === 'es' ? 'Tour no encontrado' : 'Tour not found'}
        </h1>
        <Link href={`/${lang}/tours`} className="text-blue-600 font-bold hover:underline">
          {lang === 'es' ? 'Ver catálogo de tours' : 'Browse all tours'}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-white pb-20 text-slate-700 min-h-screen">
      
      {/* HEADER MAJESTUOSO (Hero Image) */}
      <header className="relative bg-slate-900 text-white py-28 md:py-36 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={tourSEO.imageUrl || `/${tourDB.imagenUrl}`}
            alt={tourSEO.nombre}
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 bg-blue-950/60 z-10"></div>
        <div className="relative max-w-4xl mx-auto z-20 mt-10">
          <span className="inline-block bg-blue-600/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest border border-blue-400/30">
            {tourSEO.tipo || 'Premium Tour'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight drop-shadow-xl text-white">
            {tourSEO.nombre}
          </h1>
          <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto font-medium drop-shadow-md">
            {tourSEO.desc}
          </p>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL Y WIDGET DE CONVERSIÓN */}
      <main className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
        
        {/* Columna Izquierda: Detalles del Tour */}
        <div className="lg:col-span-2 space-y-8 text-lg leading-relaxed text-slate-600">
          <h2 className="text-3xl font-black text-slate-900 border-b border-slate-100 pb-4">Tour Overview</h2>
          <p>{tourSEO.detalle}</p>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mt-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Why Book This Experience With Us?</h3>
            <ul className="space-y-4 text-base">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> 
                <span><strong className="text-slate-800">Private & VIP Focus:</strong> Avoid massive, crowded buses. We focus on small groups and personalized attention.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> 
                <span><strong className="text-slate-800">Certified Guides:</strong> Bilingual experts who prioritize your safety and deliver unmatched local knowledge.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} /> 
                <span><strong className="text-slate-800">Round-Trip Transportation:</strong> Hotel pick-up and drop-off included to the activity location.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Columna Derecha: WIDGET DE RESERVA FLOTANTE */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-blue-900 p-8 rounded-[2rem] shadow-2xl sticky top-28">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Reserve Your Spot</h3>
            <p className="text-slate-500 mb-8 text-sm">High demand for 2026 season. Secure your date now.</p>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex justify-between items-center mb-8">
              <span className="font-bold text-blue-900">Starting at</span>
              <span className="font-black text-blue-900 text-3xl">${tourSEO.precio} <span className="text-sm font-bold text-blue-700">USD</span></span>
            </div>

            <button
              onClick={() => {
                setServicioSeleccionado('tours');
                setReserva(prev => ({ 
                  ...prev, 
                  tourId: tourDB.id, 
                  pasajeros: Math.max(prev.pasajeros || 1, tourDB.minPax), 
                  shoppingStop: false 
                }));
                setImagenTourDestacada(tourDB.imagenUrl || tourDB.imageUrl);
                setPaso(2);
                router.push(`/${lang}`); // Nos aseguramos de regresar a la Home manteniendo el idioma
              }}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 uppercase tracking-wide active:scale-95"
            >
              Book This Tour <ChevronRight size={20} />
            </button>

            <p className="text-center text-xs text-slate-400 mt-5 font-bold flex justify-center items-center gap-1 uppercase tracking-wider">
              <CheckCircle size={14} className="text-green-500" /> Instant Confirmation
            </p>
          </div>
        </div>
        
      </main>

      {/* GUÍAS DE TEXTO EXCLUSIVAS (Renderizadas desde el componente) */}
      <TourGuideSEO slug={slug} />

    </div>
  );
}