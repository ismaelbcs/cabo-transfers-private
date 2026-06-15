// src/components/TrustAndReviews.jsx
'use client';

import React from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TrustAndReviews({ lang = 'es' }) {
  
  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('reviews-carousel');
    if (carousel) {
      carousel.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' });
    }
  };

  // Componente para dibujar las burbujas exactas de TripAdvisor
  const TripAdvisorBubbles = () => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="9" stroke="#00aa6c" strokeWidth="2.5" fill="none" />
          <circle cx="12" cy="12" r="4.5" fill="#00aa6c" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* 🌟 KEY TAKEAWAYS (SECCIÓN DE CONFIANZA) 🌟 */}
      <div className="max-w-7xl mx-auto px-4 mb-20 animate-fade-in">
        <div className="bg-blue-50 rounded-3xl p-6 md:p-8 border border-blue-100 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
          
          <div className="w-full lg:w-1/4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-blue-200 pb-4 lg:pb-0 lg:pr-6">
            <h3 className="text-2xl font-black text-blue-900">
              {lang === 'es' ? '¿Por qué elegir Ballard Tours?' : 'Key Takeaways for Ballard Tours'}
            </h3>
          </div>
          
          <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-700"><strong>{lang === 'es' ? 'Experiencia Comprobada:' : 'Proven Experience:'}</strong> {lang === 'es' ? ' Más de 350,000 servicios realizados en 24 años resaltan nuestro compromiso con la excelencia.' : ' Over 350,000 services performed in 24 years highlight our commitment to excellence.'}</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-700"><strong>{lang === 'es' ? 'Lujo Exclusivo:' : 'Exclusive Luxury:'}</strong> {lang === 'es' ? ' Choferes bilingües, bebidas de cortesía y paradas al supermercado (con reserva previa).' : ' Bilingual private chauffeurs, welcome beverages, and grocery stops (with advance reservation).'}</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-700"><strong>{lang === 'es' ? 'Reserva Online o por Teléfono:' : 'Book Online or Call:'}</strong> {lang === 'es' ? ' Reserva en www.ballardtours.com, llama gratis o envía WhatsApp al +52 624 139 3497.' : ' Pre-book online, call toll-free, or WhatsApp +52 624 139 3497 for peace of mind.'}</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <p className="text-sm text-gray-700"><strong>{lang === 'es' ? 'Viaja a tu Medida:' : 'Tailored to You:'}</strong> {lang === 'es' ? ' Desde Shuttles económicos con espacio extra hasta SUVs VIP sin tiempos de espera.' : ' From cost-effective shuttles with extra luggage room to VIP SUVs with zero wait times.'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* 🌟 MULTIPLATAFORMA DE RESEÑAS (CARRUSEL) 🌟 */}
      <div className="max-w-7xl mx-auto px-4 mb-16 animate-fade-in">
        
        {/* Encabezado de Reseñas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <img src="/facebook.png" alt="Facebook" className="w-8 h-8 rounded-full border-2 border-white z-30 object-contain bg-white shadow-sm" />
                <div className="w-8 h-8 bg-white rounded-full border-2 border-white z-20 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" width="14" height="14"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                </div>
                <img src="/tripadvisor.png" alt="TripAdvisor" className="w-8 h-8 rounded-full border-2 border-white z-10 object-contain bg-white shadow-sm" />
              </div>
              <div className="flex text-yellow-400 text-lg tracking-widest drop-shadow-sm">★★★★★</div>
              <span className="font-bold text-gray-700 text-sm ml-2">5.0 / 5</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {lang === 'es' ? 'Lo que dicen nuestros clientes' : 'What Our Clients Say'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botones de Navegación del Carrusel (Solo Desktop) */}
            <div className="hidden md:flex gap-2">
              <button onClick={() => scrollCarousel('left')} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollCarousel('right')} className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors shadow-sm">
                <ChevronRight size={20} />
              </button>
            </div>
            {/* Botón Ver Facebook Oficial */}
            <a href="https://www.facebook.com/ballardtourservices/reviews/?id=100048743395137&sk=reviews" target="_blank" rel="noopener noreferrer" className="text-[#1877F2] font-bold hover:bg-[#1877F2] hover:text-white border border-[#1877F2] transition-all duration-300 flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl shadow-sm">
              {lang === 'es' ? 'Ver Facebook Oficial' : 'Read Official Facebook'} <ChevronRight size={16} />
            </a>
          </div>
        </div>

        {/* Contenedor del Carrusel (Tarjetas) */}
        <div id="reviews-carousel" className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {[
            { platform: 'google', name: "Karina Delgadillo", date: "Hace 2 semanas", text: { es: "Outstanding service! Everyone was always on time, friendly, and professional. Thank you for a wonderful experience! 😊", en: "Outstanding service! Everyone was always on time, friendly, and professional. Thank you for a wonderful experience! 😊" } },
            { platform: 'tripadvisor', name: "Jani O", title: "Servicio y comunicación impecables", date: "oct 2024", text: { es: "Reservé dos viajes de ida y vuelta separados para la familia para dos días diferentes. Tuve que hacer algunos cambios cerca de las fechas de recogida y todos se manejaron profesional y fácilmente. La comunicación por WhatsApp fue casi instantánea.", en: "Booked two separate round trips for the family for two different days. Had to make some changes close to the pickup dates and all were handled professionally and easily. WhatsApp communication was almost instantaneous." } },
            { platform: 'google', name: "Andy B", date: "20 ago 2024", text: { es: "Our driver Martin was waiting for us upon arrival at the airport in Los Cabos, he was very friendly and helpful and professional. He quickly got us into our resort and helped unload all of our luggage... I strongly recommend this company.", en: "Our driver Martin was waiting for us upon arrival at the airport in Los Cabos, he was very friendly and helpful and professional. He quickly got us into our resort and helped unload all of our luggage... I strongly recommend this company." } },
            { platform: 'facebook', name: "Telesfira Aguilar", date: "30 de mayo", text: { es: "magnífico servicio atención esmerada, conducción responsable es por eso que lo seguiré eligiendo...", en: "magnificent service, careful attention, responsible driving is why I will continue to choose it..." } },
            { platform: 'tripadvisor', name: "Kathleen", title: "Fácil y agradable", text: { es: "Antonio era un gran comunicador antes de aterrizar y era súper profesional todo el camino a playa grande. gracias Antonio, recomiendo encarecidamente.", en: "Antonio was a great communicator before landing and was super professional all the way to playa grande. thanks Antonio, highly recommend." } },
            { platform: 'facebook', name: "José Romero", date: "7 de febrero de 2023", text: { es: "El traslado a mi hotel fue muy cómodo, el chófer Ismael siempre amable y atento, lo recomiendo", en: "The transfer to my hotel was very comfortable, the driver Ismael always friendly and attentive, I recommend it" } },
            { platform: 'google', name: "Monika Abos", date: "Hace 34 semanas", text: { es: "Booked through Viator- Excellent transfer service! Communications (whatsapp) was great, punctuality was off by 15 mins at arrival, but right on the way back. We were a group of 10- comfy and quick way from airport to hotel and reverse. Gracias!", en: "Booked through Viator- Excellent transfer service! Communications (whatsapp) was great, punctuality was off by 15 mins at arrival, but right on the way back. We were a group of 10- comfy and quick way from airport to hotel and reverse. Gracias!" } },
            { platform: 'facebook', name: "Ana Palacio Rhi", date: "7 de febrero de 2023", text: { es: "Muy agradable el servicio, la camioneta limpia y segura, nos dieron de regalo aguas y cervezas", en: "Very pleasant service, clean and safe van, they gave us water and beers as a gift" } },
            { platform: 'tripadvisor', name: "Usuario de TripAdvisor", title: "Muy fiable", text: { es: "Nos recogieron a su llegada por Martin y él ya estaba afuera esperándonos cuando salimos del aeropuerto, era muy servicial, amable y profesional.", en: "We were picked up upon arrival by Martin and he was already outside waiting for us... he was very helpful, friendly and professional." } }
          ].map((review, idx) => {
            const isFB = review.platform === 'facebook';
            const isTA = review.platform === 'tripadvisor';
            const isGoogle = review.platform === 'google';

            const cardClasses = "snap-center shrink-0 w-[85vw] sm:w-[320px] lg:w-[360px] bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between";
            
            const cardContent = (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    {isFB && <img src="/facebook.png" alt="Facebook" className="w-6 h-6 object-contain" />}
                    {isTA && <img src="/tripadvisor.png" alt="TripAdvisor" className="w-6 h-6 object-contain" />}
                    {isGoogle && (
                      <div className="w-6 h-6 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="22" height="22"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      </div>
                    )}
                    
                    {/* Renderizamos las Burbujas de TripAdvisor o las Estrellas más grandes */}
                    {isTA ? (
                      <TripAdvisorBubbles />
                    ) : (
                      <div className="flex text-yellow-400 text-lg tracking-widest drop-shadow-sm">★★★★★</div>
                    )}
                  </div>
                  
                  {review.title && <p className="font-bold text-gray-900 text-sm mb-3">{review.title}</p>}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">"{review.text[lang]}"</p>
                </div>
                
                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                    {review.date && <span className="text-xs text-gray-500 font-medium mt-0.5">{review.date}</span>}
                  </div>
                  <span className={`text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider ${isTA ? 'text-[#00aa6c]' : isGoogle ? 'text-[#34A853]' : 'text-[#1877F2]'}`}>
                    <CheckCircle size={14} /> {lang === 'es' ? 'Verificado' : 'Verified'}
                  </span>
                </div>
              </>
            );

            if (isFB) return <a key={idx} href="https://www.facebook.com/ballardtourservices/reviews/?id=100048743395137&sk=reviews" target="_blank" rel="noopener noreferrer" className={cardClasses}>{cardContent}</a>;
            return <div key={idx} className={`${cardClasses} cursor-default`}>{cardContent}</div>;
          })}
        </div>
      </div>
    </div>
  );
}