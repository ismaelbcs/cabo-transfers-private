'use client';

import React from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GoogleReviewsWidget({ lang = 'es' }) {
  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('google-reviews-widget-carousel');
    if (carousel) {
      carousel.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const reviews = [
    { name: "Jaziel alejandro Hernandez ponce", date: "Hace 2 semanas", text: "Muy buena atención excelente servicio" },
    { name: "Karina Aragon", date: "Hace 2 semanas", text: "My friends and I booked Cabo Private Transportation for our vacation, and it was the best decision! Dayana was..." },
    { name: "Alejandro Romero", date: "Hace 2 semanas", text: "Fantastic experience with Cabo Private Transportation! Booking our round trip was effortless, largely thanks to Ismael...." },
    { name: "NAHOMY GUADALUPE ROMERO ARAGON", date: "Hace 2 semanas", text: "I can't say enough good things about Cabo Private Transportation. Our flight was slightly delayed, but Dayana kept in..." },
    { name: "Alexa Yuleny Romero Aragon", date: "Hace 2 semanas", text: "We had an amazing time in Mexico, and Cabo Private Transportation started our trip off perfectly. Ismael provided..." },
    { name: "Jair Javier Caballero", date: "Hace 2 semanas", text: "Algo bien" },
    { name: "Tania Erisbeth Álvarez Delgadillo", date: "Hace 2 semanas", text: "5 stars for Cabo Private Transportation! Ismael and Dayana were absolutely wonderful to work with. They communicated..." },
    { name: "Ceseña Ojeda Dilan Eduardo", date: "Hace 2 semanas", text: "Excelente servicio, recondenado" },
    { name: "Alvarez Delgadillo Tania Erisbeth", date: "Hace 2 semanas", text: "I highly suggest using Cabo Private Transportation! Booking online was a breeze, but what really stood out was the text..." },
    { name: "Silvia Luna", date: "Hace 2 semanas", text: "Outstanding experience with Cabo Private Transportation. From the initial reservation to the day of service, everything..." },
    { name: "Karina Delgadillo", date: "Hace 2 semanas", text: "Absolutely the best transportation service in Los Cabos! We booked a round trip from the Los Cabos airport to our..." },
    { name: "Eduardo Cabrera", date: "Hace 2 semanas", text: "I highly recommend Cabo Private Transportation! Booking was super easy, and Ismael provided excellent customer service..." },
    { name: "francisco alvarez R", date: "Hace 2 semanas", text: "Nothing but positive review for transportation for cabo private transportation . They not only picked us up from the..." }
  ];

  return (
    <div className="w-full my-8 animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full border border-slate-100 shadow-sm">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'es' ? 'Lo que dicen nuestros clientes' : 'What Our Clients Say'}
          </h3>
        </div>
        
        <div className="flex gap-2 hidden sm:flex">
          <button onClick={() => scrollCarousel('left')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scrollCarousel('right')} className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Carrusel */}
      <div id="google-reviews-widget-carousel" className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {reviews.map((review, idx) => (
          <a 
            key={idx} 
            href="https://g.page/r/CYogd8iYqsEMEAE/review" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="snap-center shrink-0 w-[280px] sm:w-[300px] bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex text-yellow-400 text-sm tracking-widest mb-3">★★★★★</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 italic">"{review.text}"</p>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-xs">{review.name}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{review.date}</span>
              </div>
              <span className="text-[9px] font-bold flex items-center gap-1 uppercase tracking-widest text-[#34A853]">
                <CheckCircle size={10} /> {lang === 'es' ? 'Verificado' : 'Verified'}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
