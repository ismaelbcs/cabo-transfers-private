// src/app/[lang]/links/page.js
'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Star, ArrowRight, Home, Map, ChevronRight, Ticket } from 'lucide-react';

// Custom stylesheet for specific cubic-bezier easings 
const customStyles = `
  @keyframes elegant-enter {
    from {
      opacity: 0;
      transform: scale(0.92) translateY(20px);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
      filter: blur(0px);
    }
  }

  .animate-tasteful {
    opacity: 0;
    animation: elegant-enter 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .emil-interactive {
    transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.1), 
                box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                border-color 0.3s ease,
                background-color 0.3s ease;
  }
  .emil-interactive:active {
    transform: scale(0.94);
    transition: transform 0.1s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .emil-inner-ring {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0,0,0,0.02);
  }
  .emil-inner-ring-dark {
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }

  .emil-shadow {
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.04), 0 12px 30px -4px rgba(0, 0, 0, 0.03);
  }
  .emil-shadow-hover {
    box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.06), 0 20px 40px -8px rgba(0, 0, 0, 0.05);
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-shimmer {
    animation: shimmer 2.5s infinite;
  }

  .delay-100 { animation-delay: 50ms; }
  .delay-200 { animation-delay: 150ms; }
  .delay-300 { animation-delay: 250ms; }
  .delay-400 { animation-delay: 350ms; }
  .delay-500 { animation-delay: 450ms; }
`;

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LinkInBioPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Diccionario Bilingüe
  const t = {
    groupDiscount: isEs ? 'Descuento de Grupo' : 'Group Discount',
    titlePromo: isEs ? '¿Viajas con amigos o familia?' : 'Traveling with friends?',
    descPromo: isEs ? 'Cada reseña obtiene un cupón del ' : 'Each review gets a ',
    descPromoHighlight: isEs ? '10% de descuento' : '10% voucher',
    descPromoEnd: isEs ? '. ¡Son acumulables!' : '. They stack!',
    reviews: isEs ? 'Reseñas' : 'Reviews',
    review: isEs ? 'Reseña' : 'Review',
    validFuture: isEs ? 'Válido en futuras reservas' : 'Valid on future reservations',
    rateTitle: isEs ? 'Califica tu Experiencia' : 'Rate Your Experience',
    rateDesc: isEs ? 'Ayuda a otros a descubrir lo mejor de Cabo compartiendo tu opinión en Google.' : 'Help others discover the best of Cabo by sharing your thoughts on Google.',
    exploreTitle: isEs ? 'Explora Los Cabos' : 'Explore Cabo',
    homeTitle: isEs ? 'Visitar Página Principal' : 'Visit Homepage',
    generateCode: isEs ? 'Generar Código de Descuento' : 'Generate Discount Code',
  };

  // ==========================================================
  // BLOQUES DE INTERFAZ (Se separan para acomodarlos fácil)
  // ==========================================================

  const promoBanner = (
    <div className="w-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-[28px] p-5 animate-tasteful delay-100 relative emil-inner-ring-dark flex flex-col text-center overflow-hidden shadow-2xl shadow-zinc-900/10">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-24 bg-amber-500/15 blur-[40px] rounded-full pointer-events-none"></div>
      <div className="flex justify-center mb-3">
        <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-amber-300 text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full backdrop-blur-md">
          <Star size={10} className="fill-amber-300" />
          {t.groupDiscount}
        </div>
      </div>
      <h2 className="text-[18px] font-semibold mb-1.5 text-white tracking-tight">{t.titlePromo}</h2>
      <p className="text-zinc-300 text-[13px] mb-4 leading-relaxed">
        {t.descPromo}<span className="text-white font-semibold">{t.descPromoHighlight}</span>{t.descPromoEnd}
      </p>
      <div className="w-full bg-black/30 rounded-2xl p-3 mb-3 emil-inner-ring-dark backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-zinc-300">
          <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg"><span>1 {t.review}</span><span className="text-amber-400 font-semibold">10%</span></div>
          <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg"><span>2 {t.reviews}</span><span className="text-amber-400 font-semibold">20%</span></div>
          <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg"><span>3 {t.reviews}</span><span className="text-amber-400 font-semibold">30%</span></div>
          <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg"><span>4 {t.reviews}</span><span className="text-amber-400 font-semibold">40%</span></div>
        </div>
      </div>
      <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">{t.validFuture}</p>
    </div>
  );

  const googleReview = (
    <a href="https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" target="_blank" rel="noopener noreferrer" className="group relative w-full bg-white rounded-[32px] p-7 flex flex-col items-center text-center emil-shadow emil-inner-ring animate-tasteful delay-200 emil-interactive hover:-translate-y-1 hover:emil-shadow-hover">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50 rounded-t-[32px]"></div>
      <div className="absolute top-4 right-4 bg-zinc-50 text-zinc-300 p-2.5 rounded-full emil-interactive group-hover:bg-zinc-100 group-hover:text-zinc-900 group-hover:translate-x-1 group-hover:-translate-y-1">
        <ArrowRight size={18} />
      </div>
      <div className="bg-zinc-50 p-4 rounded-2xl mb-5 emil-interactive group-hover:scale-110 group-hover:bg-white emil-inner-ring"><GoogleIcon /></div>
      <h3 className="text-xl font-semibold tracking-tight mb-2 text-zinc-900">{t.rateTitle}</h3>
      <p className="text-[15px] text-zinc-500 mb-6 leading-relaxed max-w-[90%]">{t.rateDesc}</p>
      <div className="flex gap-1.5 emil-interactive group-hover:scale-105">
        {[1, 2, 3, 4, 5].map((star, i) => (
          <Star key={star} size={28} className="fill-[#FBBC05] text-[#FBBC05]" style={{ transitionDelay: `${i * 50}ms` }} />
        ))}
      </div>
    </a>
  );

  const generateCode = (
    <Link href={`/${lang}/claim-discount`} className="group relative w-full bg-zinc-900 text-white rounded-[24px] p-5 flex items-center justify-center gap-2 emil-shadow emil-interactive hover:-translate-y-1 hover:bg-zinc-800 overflow-hidden animate-tasteful delay-300">
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none"></div>
      <Ticket size={20} className="text-amber-400 emil-interactive group-hover:rotate-12 group-hover:scale-110" />
      <span className="font-semibold tracking-tight text-[16px]">{t.generateCode}</span>
      <div className="absolute inset-0 rounded-[24px] emil-inner-ring-dark pointer-events-none"></div>
    </Link>
  );

  const testimonialImage = (
    <div className="relative w-full rounded-[32px] overflow-hidden emil-shadow emil-inner-ring bg-white aspect-[4/5] flex items-center justify-center p-2 animate-tasteful delay-400">
      <div className="w-full h-full rounded-[24px] overflow-hidden relative">
        <img src="/cabo-private-transportation-airport-cabo-reviewes.webp" alt="Guest Testimonials and Discounts" className="w-full h-full object-cover transition-transform duration-[2s] ease-out hover:scale-[1.02]" />
        <div className="absolute inset-0 emil-inner-ring pointer-events-none rounded-[24px]"></div>
      </div>
    </div>
  );

  const exploreCabo = (
    <Link href={`/${lang}/tours`} className="group relative w-full h-40 rounded-[28px] overflow-hidden animate-tasteful delay-500 emil-shadow emil-inner-ring block emil-interactive hover:-translate-y-1 hover:emil-shadow-hover">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110" style={{ backgroundImage: 'url("/cabo-airport-transfers-boton-qr.webp")' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-1.5 opacity-90 transform transition-transform duration-500 group-hover:-translate-y-1">
          <Map size={14} className="text-white" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white">Ballard Tours</span>
        </div>
        <div className="flex items-end justify-between transform transition-transform duration-500 group-hover:-translate-y-1">
          <div><h3 className="text-xl font-semibold text-white tracking-tight">{t.exploreTitle}</h3></div>
          <div className="bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full emil-interactive group-hover:bg-white group-hover:text-zinc-900 group-hover:scale-110">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );

  const homeLink = (
    <Link href={`/${lang}`} className="group w-full bg-white rounded-[24px] p-4 flex items-center justify-between emil-inner-ring emil-shadow animate-tasteful delay-500 emil-interactive hover:-translate-y-1 hover:emil-shadow-hover">
      <div className="flex items-center gap-4">
        <div className="bg-[#F9F8F6] p-3 rounded-2xl text-zinc-500 emil-interactive group-hover:text-zinc-900 group-hover:bg-zinc-100 group-hover:scale-105">
          <Home size={18} />
        </div>
        <div><h3 className="text-[15px] font-semibold tracking-tight text-zinc-900">{t.homeTitle}</h3></div>
      </div>
      <div className="text-zinc-300 emil-interactive group-hover:text-zinc-900 group-hover:translate-x-1 pr-2">
        <ChevronRight size={18} />
      </div>
    </Link>
  );

  const footerNode = (
    <footer className="mt-8 text-center animate-tasteful delay-500 pb-8">
      <p className="text-[11px] uppercase tracking-widest font-medium text-zinc-400">
        © {new Date().getFullYear()} Ballard Tours Los Cabos
      </p>
    </footer>
  );

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-zinc-900 font-sans selection:bg-zinc-200 flex justify-center pt-24 md:pt-32">
      <style>{customStyles}</style>

      <div className="w-full max-w-4xl px-5 flex flex-col md:flex-row gap-8 items-start justify-center">
        
        {/* ======================================= */}
        {/* VISTA PARA CELULAR (Orden exacto pedido) */}
        {/* ======================================= */}
        <div className="w-full flex flex-col gap-4 md:hidden">
          {promoBanner}
          {googleReview}
          {generateCode}
          {testimonialImage}
          {exploreCabo}
          {homeLink}
          {footerNode}
        </div>

        {/* ======================================= */}
        {/* VISTA PARA COMPUTADORA (Dos columnas) */}
        {/* ======================================= */}
        
        {/* Columna Izquierda Computadora */}
        <div className="hidden md:flex w-[55%] flex-col gap-4">
          {promoBanner}
          {googleReview}
          {exploreCabo}
          {homeLink}
          {footerNode}
        </div>

        {/* Columna Derecha Computadora */}
        <div className="hidden md:flex w-[45%] flex-col gap-4 sticky top-28">
          {testimonialImage}
          {generateCode}
        </div>

      </div>
    </div>
  );
}