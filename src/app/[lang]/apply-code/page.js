// src/app/[lang]/apply-code/page.js
'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Ticket, ArrowRight, X, Loader2, Sparkles, CheckCircle2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// IMPORTACIONES DE FIREBASE
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../../firebase';

// ESTILOS EMIL KOWALSKI
const customStyles = `
  @keyframes elegant-enter {
    from { opacity: 0; transform: scale(0.92) translateY(20px); filter: blur(4px); }
    to { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
  }
  .animate-tasteful { opacity: 0; animation: elegant-enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .emil-interactive {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .emil-interactive:active { transform: scale(0.96); transition: transform 0.1s cubic-bezier(0.32, 0.72, 0, 1); }
  .emil-inner-ring { box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0,0,0,0.02); }
  .emil-shadow { box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.08); }
`;

export default function ApplyCodePage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';
  const router = useRouter();

  // DICCIONARIO
  const t = {
    title: isEs ? "Añadir Código" : "Add Discount Code",
    subtitle: isEs ? "Ingresa tus cupones. ¡Puedes acumular hasta 10!" : "Enter your coupons. You can stack up to 10!",
    placeholder: isEs ? "Ej: CABO-XXXX o Chofer" : "Ex: CABO-XXXX or Driver",
    addAnother: isEs ? "+ Añadir otro cupón" : "+ Add another coupon",
    applyBtn: isEs ? "Aplicar Descuentos" : "Apply Discounts",
    verifying: isEs ? "Verificando..." : "Verifying...",
    totalSaved: isEs ? "Descuento Total" : "Total Discount",
    errorMax: isEs ? "Máximo 10 códigos permitidos." : "Maximum 10 codes allowed.",
    errorDup: isEs ? "Este código ya está en la lista." : "This code is already added.",
    errorUsed: isEs ? "Este código de reseña ya fue utilizado." : "This review code has already been used.",
    errorInvalid: isEs ? "Código inválido." : "Invalid code.",
    back: isEs ? "Volver" : "Back",
  };

  const [cupones, setCupones] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar cupones previos si el usuario regresa
  useEffect(() => {
    const guardados = localStorage.getItem('cabo_cupones');
    if (guardados) setCupones(JSON.parse(guardados));
  }, []);

  const totalDiscount = cupones.reduce((acc, c) => acc + (c.descuento || 10), 0);

  const handleVerificarYAgregar = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const codigoLimpio = input.trim().toUpperCase();
    if (!codigoLimpio) return;

    if (cupones.length >= 10) { setError(t.errorMax); return; }
    if (cupones.some(c => c.codigo === codigoLimpio)) { setError(t.errorDup); return; }

    setLoading(true);
    try {
      const docRef = doc(db, "cupones", codigoLimpio);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const datosCupon = docSnap.data();
        if (datosCupon.tipo === 'resena' && datosCupon.utilizado === true) {
          setError(t.errorUsed);
        } else {
          setCupones(prev => [...prev, datosCupon]);
          setInput('');
        }
      } else {
        setError(t.errorInvalid);
      }
    } catch (err) {
      setError("Error de conexión / Connection error.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = (codigo) => {
    setCupones(prev => prev.filter(c => c.codigo !== codigo));
  };

  const handleAplicarFinal = () => {
    localStorage.setItem('cabo_cupones', JSON.stringify(cupones));
    // Regresamos al inicio para que siga comprando, o al checkout si ya estaba ahí
    router.push(`/${lang}`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center p-4 sm:p-6 relative font-sans overflow-x-hidden pt-24 md:pt-32">
      <style>{customStyles}</style>

      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      <div className="z-10 w-full max-w-md animate-tasteful">
        
        <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 font-bold text-sm flex items-center gap-1 mb-6 transition-colors">
          <ChevronLeft size={16} /> {t.back}
        </button>

        <div className="bg-white rounded-[32px] p-6 sm:p-8 emil-shadow emil-inner-ring">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-[16px] flex items-center justify-center shadow-lg">
              <Ticket size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{t.title}</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">{t.subtitle}</p>
            </div>
          </div>

          {/* LISTA DE CUPONES AGREGADOS */}
          {cupones.length > 0 && (
            <div className="mb-6 space-y-2">
              {cupones.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-xl p-3 animate-tasteful" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-blue-500" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{c.codigo}</p>
                      <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black">-{c.descuento || 10}%</p>
                    </div>
                  </div>
                  <button onClick={() => handleEliminar(c.codigo)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm border border-slate-100 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-xl mt-4">
                <span className="font-bold text-sm">{t.totalSaved}</span>
                <span className="font-black text-xl text-amber-400">-{totalDiscount}%</span>
              </div>
            </div>
          )}

          {/* INPUT PARA NUEVO CUPÓN */}
          <form onSubmit={handleVerificarYAgregar} className="mb-6">
            <div className="relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.placeholder}
                className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 font-bold rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all uppercase text-center tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-medium"
              />
            </div>
            {error && <p className="text-red-500 font-bold text-xs mt-2 text-center">{error}</p>}
            
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="mt-4 w-full bg-blue-50 text-blue-600 font-bold py-3.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Ticket size={18} />}
              {loading ? t.verifying : t.addAnother}
            </button>
          </form>

        </div>

        {/* BOTÓN FINAL DE APLICAR */}
        <button 
          onClick={handleAplicarFinal}
          className="mt-6 w-full bg-slate-900 text-white font-bold py-5 rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-slate-800 emil-interactive flex items-center justify-center gap-2 text-lg"
        >
          {t.applyBtn} <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
}