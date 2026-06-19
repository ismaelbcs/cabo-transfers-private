// src/app/[lang]/agencies/page.js
'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, Briefcase } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { dict } from '../../../locales/dict';

export default function AgenciesPage({ params }) {
  const lang = params?.lang || 'en';
  const t = dict[lang]?.agencies || dict['en'].agencies;

  const [formData, setFormData] = useState({ agencia: '', email: '', como: '', comentario: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await addDoc(collection(db, "correos"), {
        to: "reservationballard@gmail.com",
        message: {
          subject: `NUEVA SOLICITUD DE AGENCIA: ${formData.agencia}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Solicitud de Convenio - Agencia de Viajes</h2>
              <p><strong>Agencia:</strong> ${formData.agencia}</p>
              <p><strong>Correo:</strong> ${formData.email}</p>
              <p><strong>¿Cómo nos encontró?:</strong> ${formData.como}</p>
              <h3>Comentarios:</h3>
              <p>${formData.comentario}</p>
            </div>
          `
        }
      });
      setEnviado(true);
      setFormData({ agencia: '', email: '', como: '', comentario: '' });
      setTimeout(() => setEnviado(false), 6000);
    } catch (error) {
      console.error("Error: ", error);
      alert("Error al enviar.");
    }
    setEnviando(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="bg-[#fafafa] min-h-screen pt-32 pb-24 font-sans selection:bg-slate-900 selection:text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
            <Briefcase size={36} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 animate-gradient-x">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 animate-fade-in">
          {enviado ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.success}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">{t.formInstruction}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.agencyName}</label>
                  <input required type="text" name="agencia" value={formData.agencia} onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.agencyEmail}</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 outline-none transition-all text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.howFoundUs}</label>
                <input required type="text" name="como" value={formData.como} onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 outline-none transition-all text-sm" />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.comments}</label>
                <textarea required rows="4" name="comentario" value={formData.comentario} onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl p-4 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 outline-none transition-all text-sm resize-none"></textarea>
              </div>

              <button type="submit" disabled={enviando} className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2">
                {enviando ? t.sending : <><Send size={18} /> {t.send}</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}