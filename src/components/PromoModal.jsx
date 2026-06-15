// src/components/PromoModal.jsx
'use client';

import React from 'react';
import { Drawer } from 'vaul';
import { Gift, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function PromoModal({ lang = 'en' }) {
  const { 
    showPromoModal, setShowPromoModal, promoInput, 
    setPromoInput, promoError, procesarCodigo 
  } = useBooking();

  return (
    <Drawer.Root open={showPromoModal} onOpenChange={setShowPromoModal}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[2rem] fixed bottom-0 left-0 right-0 z-[111] max-w-md mx-auto shadow-2xl outline-none">
          
          <div className="p-4 flex justify-center shrink-0">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div className="p-8 pt-0 text-center relative">
            <button onClick={() => setShowPromoModal(false)} className="absolute top-0 right-6 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-5 transform -rotate-12 shadow-sm border border-amber-100">
              <Gift size={32} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {lang === 'es' ? '¿Tienes un Código?' : 'Have a Promo Code?'}
            </h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">
              {lang === 'es' 
                ? 'Ingresa tu código para desbloquear descuentos exclusivos en tu combo.' 
                : 'Enter your exclusive coupon code below to unlock special deal discounts.'
              }
            </p>

            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="Ej. VIP10"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 font-black text-xl text-center text-slate-900 focus:border-blue-900 outline-none tracking-widest bg-slate-50"
            />
            
            {promoError && <p className="text-red-500 text-xs font-bold mt-2 text-left bg-red-50 border border-red-200 p-2 rounded-lg">{promoError}</p>}

            <button 
              onClick={() => procesarCodigo(promoInput, null, lang)} 
              className="w-full mt-5 bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-xl transition-colors uppercase text-sm tracking-wider shadow-md active:scale-95"
            >
              {lang === 'es' ? 'Aplicar Código' : 'Apply Code'}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}