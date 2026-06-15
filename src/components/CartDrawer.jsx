// src/components/CartDrawer.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { ShoppingBag, Trash2, Palmtree, Plus, Car, ChevronRight, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useBooking } from '../context/BookingContext';
import { toursData } from '../data/seoData';

export default function CartDrawer({ lang = 'es' }) {
  const router = useRouter();
  const cart = useCart() || {};
  const { combo = [], isCartOpen = false, setIsCartOpen = () => { }, eliminarDelCombo } = cart;
  const carrito = combo || [];
  
  const {
    setServicioSeleccionado,
    setSubCategoria,
    setVistaEspecial,
    setReserva,
    setImagenTourDestacada,
    setPaso
  } = useBooking();

  // Validar si el componente ya se montó en el cliente para evitar el Error 500
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isEs = lang === 'es';

  // Lista estática de servicios especiales
  const SERVICIOS_ESPECIALES = [
    { id: 'cenas', title: { es: 'Cenas y Restaurantes', en: 'Dinner Transfers' }, price: '120', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=500' },
    { id: 'nightlife', title: { es: 'Nightlife', en: 'Nightlife' }, price: '200', img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=500' },
    { id: 'hotel', title: { es: 'Hotel a Hotel', en: 'Hotel to Hotel' }, price: '50', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=500' },
    { id: 'golf', title: { es: 'Campos de Golf', en: 'Golf Transfers' }, price: '60', img: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=500' }
  ];

  // Calcular total dinámicamente
  const carritoTotal = carrito.reduce((acc, item) => acc + (item.precio || 0), 0);

  const procederAlPago = () => {
    setIsCartOpen(false);
    // Mandamos al usuario a la página de pago
    router.push(`/${lang}/cart`);
  };

  if (!isMounted) return null; // Evita que Drawer.Portal rompa Next.js en el servidor

  return (
    <Drawer.Root open={isCartOpen} onOpenChange={setIsCartOpen} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]" />

        <Drawer.Content className="bg-slate-50 flex flex-col rounded-l-[2rem] h-full fixed top-0 right-0 z-[101] w-[90%] md:w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] outline-none overflow-hidden border-l border-slate-200/60">

          {/* Encabezado: "Mi Combo" */}
          <div className="flex items-center justify-between px-8 py-8 bg-white shrink-0 border-b border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tighter" style={{ letterSpacing: '-0.03em' }}>
              <ShoppingBag className="text-blue-600" size={28} />
              {isEs ? 'Mi Combo' : 'My Combo'}
            </h2>
          </div>

          {/* Contenedor escrolleable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 bg-white custom-scrollbar">
            {carrito.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <ShoppingCart size={64} className="text-slate-300 mb-6" />
                <p className="text-slate-500 font-medium text-lg">{isEs ? 'Tu combo está vacío.' : 'Your combo is empty.'}</p>
                <button onClick={() => setIsCartOpen(false)} className="mt-8 px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                  {isEs ? 'Armar mi combo' : 'Build my combo'}
                </button>
              </div>
            ) : (
              <>
                {/* 🛒 LISTA DE COMPRAS ACTUAL */}
                <div className="space-y-4">
                  {carrito.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-5 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex gap-4 group relative overflow-hidden transition-all hover:border-slate-300">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                      <div className="flex-1 pl-2">
                        <h4 className="font-bold text-slate-900 leading-tight pr-8 tracking-tight">{item.titulo}</h4>
                        <p className="text-xs font-medium text-slate-500 mt-2">{item.subtitulo}</p>
                        {item.config?.shoppingStop && (
                          <p className="text-[10px] font-bold text-blue-600 mt-3 bg-blue-50 inline-block px-2.5 py-1 rounded border border-blue-100 tracking-widest uppercase">
                            + Shopping Stop
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          <p className="font-black text-slate-900 text-xl tracking-tighter">${item.precio?.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => eliminarDelCombo(item.id)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title={isEs ? "Eliminar" : "Remove"}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 👇 SECCIÓN DE CROSS-SELLING (TOURS) 👇 */}
                <div className="mt-10 mb-4 pt-8 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                    <Palmtree className="text-blue-500" size={24} />
                    {isEs ? 'Completa tu experiencia' : 'Complete your experience'}
                  </h4>

                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-8 px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {toursData.filter(tr => tr.activo).map((tr) => (
                      <div
                        key={tr.id}
                        onClick={() => {
                          setIsCartOpen(false);
                          setServicioSeleccionado('tours');
                          setSubCategoria('tours');
                          setReserva(prev => ({ ...prev, tourId: tr.id, pasajeros: Math.max(prev.pasajeros || 1, tr.minPax), shoppingStop: false }));
                          setImagenTourDestacada(tr.imagenUrl || tr.imageUrl);
                          setPaso(2);
                          router.push(`/${lang}#zonas`); // Te lleva arriba de forma suave
                        }}
                        className="snap-center shrink-0 w-[180px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden cursor-pointer group hover:border-slate-300 transition-all flex flex-col"
                      >
                        <div className="h-28 relative overflow-hidden bg-slate-100">
                          <img src={`/${tr.imagenUrl}`} alt={tr.nombre[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-3">
                            <span className="text-white text-xs font-bold leading-tight tracking-tight drop-shadow-md">{tr.nombre[lang]}</span>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white group-hover:bg-slate-50 transition-colors">
                          <span className="text-[10px] font-bold text-slate-900 flex items-center gap-1 uppercase tracking-widest">
                            <Plus size={14} strokeWidth={3} /> {isEs ? 'Añadir' : 'Add'}
                          </span>
                          <span className="text-sm font-black text-slate-900">${tr.precioPx}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 👇 SECCIÓN DE SERVICIOS ESPECIALES 👇 */}
                <div className="mt-6 mb-4 pt-8 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 tracking-tight">
                    <Car className="text-blue-500" size={24} />
                    {isEs ? 'Transporte Especial' : 'Special Transport'}
                  </h4>

                  <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-8 px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {SERVICIOS_ESPECIALES.map((sp) => (
                      <div
                        key={sp.id}
                        onClick={() => {
                          setIsCartOpen(false);
                          setServicioSeleccionado('tours');
                          setSubCategoria('especiales');
                          setVistaEspecial(sp.id);
                          setPaso(2);
                          router.push(`/${lang}#zonas`);
                        }}
                        className="snap-center shrink-0 w-[180px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden cursor-pointer group hover:border-slate-300 transition-all flex flex-col"
                      >
                        <div className="h-28 relative overflow-hidden bg-slate-100">
                          <img src={sp.img} alt={sp.title[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-3">
                            <span className="text-white text-xs font-bold leading-tight tracking-tight drop-shadow-md">{sp.title[lang]}</span>
                          </div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white group-hover:bg-slate-50 transition-colors">
                          <span className="text-[10px] font-bold text-slate-900 flex items-center gap-1 uppercase tracking-widest">
                            <Plus size={14} strokeWidth={3} /> {isEs ? 'Añadir' : 'Add'}
                          </span>
                          <span className="text-sm font-black text-slate-900">${sp.price}+</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 👇 FOOTER FIJO: TOTAL Y CHECKOUT 👇 */}
          {carrito.length > 0 && (
            <div className="border-t border-slate-200 p-6 md:p-8 bg-white shadow-[0_-10px_30px_rgb(0,0,0,0.05)] shrink-0">
              <div className="flex justify-between items-end mb-6">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] pb-1">{isEs ? 'Total del Combo' : 'Combo Total'}</p>
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-1">${carritoTotal.toFixed(2)}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{isEs ? 'USD, impuestos incluidos' : 'USD, taxes included'}</p>
                </div>
              </div>
              <button
                onClick={procederAlPago}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all tracking-wide text-sm"
              >
                {isEs ? 'Proceder al Checkout' : 'Proceed to Checkout'} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}