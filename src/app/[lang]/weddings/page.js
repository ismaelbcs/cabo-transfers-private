// src/app/[lang]/weddings/page.js
'use client';

import React, { useState } from 'react';
import { Send, CheckCircle, HeartHandshake } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { dict } from '../../../locales/dict';

export default function WeddingsPage({ params }) {
  const lang = params?.lang || 'en';
  const t = dict[lang]?.weddings || dict['en'].weddings;

  const [formData, setFormData] = useState({
    nombre: '', email: '', telefono: '', fecha: '', lugar: '', invitados: '',
    servicios: { guestTransport: false, vipTransport: false, photoVideo: false, makeup: false, tours: false },
    comentario: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    const serviciosSeleccionados = Object.keys(formData.servicios)
      .filter(key => formData.servicios[key])
      .map(key => t.services[key] || key)
      .join(', ');

    try {
      await addDoc(collection(db, "correos"), {
        to: "reservationballard@gmail.com",
        message: {
          subject: `NUEVA SOLICITUD DE BODA: ${formData.nombre} - ${formData.fecha}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Solicitud de Boda / Evento</h2>
              <p><strong>Organizador/Novios:</strong> ${formData.nombre}</p>
              <p><strong>Correo:</strong> ${formData.email}</p>
              <p><strong>WhatsApp:</strong> ${formData.telefono}</p>
              <p><strong>Fecha del Evento:</strong> ${formData.fecha}</p>
              <p><strong>Lugar:</strong> ${formData.lugar}</p>
              <p><strong>Invitados a transportar:</strong> ${formData.invitados}</p>
              <p><strong>Servicios de Interés:</strong> ${serviciosSeleccionados || 'Ninguno especificado'}</p>
              <h3>Visión / Comentarios:</h3>
              <p>${formData.comentario}</p>
            </div>
          `
        }
      });
      setEnviado(true);
      setTimeout(() => setEnviado(false), 8000);
    } catch (error) {
      console.error("Error: ", error);
      alert("Error al enviar.");
    }
    setEnviando(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleCheckbox = (e) => {
    setFormData({
      ...formData,
      servicios: { ...formData.servicios, [e.target.name]: e.target.checked }
    });
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pt-32 pb-24 font-sans selection:bg-rose-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-200/50">
            <HeartHandshake size={36} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-rose-600 to-rose-400 animate-gradient-x">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100 animate-fade-in">
          {enviado ? (
            <div className="text-center py-12">
              <CheckCircle size={64} className="text-rose-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.success}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-center text-rose-400 font-bold mb-8 uppercase tracking-widest text-xs">{t.formInstruction}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.coupleName}</label>
                  <input required type="text" name="nombre" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.email}</label>
                  <input required type="email" name="email" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.phone}</label>
                  <input required type="tel" name="telefono" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.date}</label>
                  <input required type="date" name="fecha" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 text-slate-500 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.venue}</label>
                  <input required type="text" name="lugar" placeholder="Ej. Acre / Sunset Monalisa" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.guests}</label>
                  <input required type="number" name="invitados" placeholder="Ej. 50" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-500 mb-4 uppercase tracking-widest">{t.servicesTitle}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(t.services).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input type="checkbox" name={key} checked={formData.servicios[key]} onChange={handleCheckbox} className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400 accent-rose-500" />
                      <span className="text-sm font-medium text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.vision}</label>
                <textarea required rows="4" name="comentario" onChange={handleChange} className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl p-4 focus:bg-white focus:border-rose-300 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm resize-none"></textarea>
              </div>

              <button type="submit" disabled={enviando} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-rose-600/30 flex justify-center items-center gap-2">
                {enviando ? t.sending : <><Send size={18} /> {t.send}</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}