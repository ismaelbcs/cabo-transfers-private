// src/app/[lang]/contact/page.js
'use client';

import React, { useState, use } from 'react';
import { Phone, MessageCircle, Send, User, BookOpen, CheckCircle, Mail, Car, ArrowRight } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { FAQSection } from '../../../components/FAQSection'; 

export default function ContactPage({ params }) {
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';

  // 1. Agregamos 'email' al estado inicial
  const [formData, setFormData] = useState({ nombre: '', email: '', asunto: '', comentario: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const maxLength = 600;

  const content = {
    en: {
      seoTitle: "Private Transportation Los Cabos | Airport Transfers & Luxury Transportation | Cabo Private Transportation",
      seoDesc: "Premium transportation services in Los Cabos. Private airport transportation, hotel transfers, luxury SUVs, and group transportation. Trusted by travelers visiting Cabo San Lucas and San José del Cabo.",
      title: "Get in touch.",
      subtitle: "We're here to help you plan the perfect Los Cabos experience. Reach out to our local experts.",
      wpRes: "Reservations",
      wpSup: "Support",
      callUs: "Direct Call",
      emailUs: "Email",
      clickChat: "Chat on WhatsApp",
      clickCall: "Call us now",
      clickEmail: "Send an email",
      formTitle: "Send a message",
      formDesc: "Fill out the form below and our team will get back to you shortly.",
      nameLabel: "Name",
      namePh: "John Doe",
      emailFormLabel: "Email", // Nuevo en Inglés
      emailFormPh: "john@example.com", // Nuevo en Inglés
      subLabel: "Subject",
      subPh: "e.g. Airport Transfer Quote",
      msgLabel: "Message",
      msgPh: "How can we help you?",
      sending: "Sending...",
      sendBtn: "Send Message",
      successTitle: "Message Sent",
      successDesc: "We've received your request. We'll be in touch shortly.",
      errorAlert: "There was an error connecting to the server. Please try contacting us via WhatsApp.",
      bannerTitle: "Travel in Style.",
      bannerDesc: "Our fleet of Luxury SUVs is ready to provide you with the best private service from the airport to your destination.",
      bannerBadge: "Premium Fleet"
    },
    es: {
      seoTitle: "Los Cabos Private Transportation | Airport Transfers, Tours & Luxury SUVs",
      seoDesc: "Professional private transportation in Los Cabos. Airport transfers, resort transportation, luxury SUVs, and tourist transportation services. Safe, comfortable, and available 24/7. Book online with Ballard Tours.",
      title: "Hablemos.",
      subtitle: "Estamos aquí para ayudarte a planear la experiencia perfecta en Los Cabos. Contacta a nuestros expertos.",
      wpRes: "Reservas",
      wpSup: "Soporte",
      callUs: "Llamada Directa",
      emailUs: "Correo",
      clickChat: "Chat en WhatsApp",
      clickCall: "Llamar ahora",
      clickEmail: "Enviar un correo",
      formTitle: "Envía un mensaje",
      formDesc: "Llena el formulario y nuestro equipo te responderá a la brevedad.",
      nameLabel: "Nombre",
      namePh: "Juan Pérez",
      emailFormLabel: "Email", // Nuevo en Español (O "Correo Electrónico", pero 'Email' es universal)
      emailFormPh: "juan@ejemplo.com", // Nuevo en Español
      subLabel: "Asunto",
      subPh: "Ej. Cotización de traslado",
      msgLabel: "Mensaje",
      msgPh: "¿En qué te podemos ayudar?",
      sending: "Enviando...",
      sendBtn: "Enviar Mensaje",
      successTitle: "Mensaje Enviado",
      successDesc: "Hemos recibido tu solicitud. Te contactaremos muy pronto.",
      errorAlert: "Hubo un error al conectar con el servidor. Por favor, intenta contactarnos por WhatsApp.",
      bannerTitle: "Viaja con Estilo.",
      bannerDesc: "Nuestra flotilla de Luxury SUVs está lista para brindarte el mejor servicio privado desde el aeropuerto hasta tu destino.",
      bannerBadge: "Flota Premium"
    }
  };
  const t = content[lang] || content.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await addDoc(collection(db, "correos"), {
        to: "reservationballard@gmail.com",
        message: {
          subject: `NUEVO MENSAJE WEB: ${formData.asunto} - ${formData.nombre}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; padding: 40px; color: #111827;">
              <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #eaeaea; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
                <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.5px;">Nuevo Mensaje Web</h2>
                <div style="margin-top: 24px; margin-bottom: 24px; border-bottom: 1px solid #eaeaea; padding-bottom: 24px;">
                  <p style="font-size: 14px; color: #666; margin: 4px 0;"><strong>Cliente:</strong> ${formData.nombre}</p>
                  <p style="font-size: 14px; color: #666; margin: 4px 0;"><strong>Correo:</strong> <a href="mailto:${formData.email}" style="color: #2563eb; text-decoration: none;">${formData.email}</a></p>
                  <p style="font-size: 14px; color: #666; margin: 4px 0;"><strong>Asunto:</strong> ${formData.asunto}</p>
                </div>
                <h3 style="color: #111827; font-size: 14px; font-weight: 500; margin-bottom: 8px;">Mensaje:</h3>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #374151;">
                  ${formData.comentario}
                </div>
              </div>
            </div>
          `
        }
      });
      setEnviado(true);
      // Limpiamos también el campo email al terminar
      setFormData({ nombre: '', email: '', asunto: '', comentario: '' });
      setTimeout(() => setEnviado(false), 5000);
    } catch (error) {
      console.error("Error al enviar el mensaje: ", error);
      alert(t.errorAlert);
    }
    setEnviando(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'comentario' && value.length > maxLength) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24 font-sans selection:bg-slate-900 selection:text-white">
      <title>{t.seoTitle}</title>
      <meta name="description" content={t.seoDesc} />

      {/* HERO SECTION */}
      <div className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
          {t.title}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-16">
        
        {/* COLUMNA IZQUIERDA: BENTO BOX CONTACT CARDS */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 h-max">
          
          {/* WhatsApp 1 */}
          <a href="https://wa.me/526241393497" target="_blank" rel="noopener noreferrer" className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-out group min-h-[160px]">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
              <MessageCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{t.wpRes}</h3>
              <p className="text-slate-500 text-xs font-medium mb-3">+52 (624) 139-3497</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                {t.clickChat} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* WhatsApp 2 */}
          <a href="https://wa.me/526121943286" target="_blank" rel="noopener noreferrer" className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-out group min-h-[160px]">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
              <MessageCircle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{t.wpSup}</h3>
              <p className="text-slate-500 text-xs font-medium mb-3">+52 (612) 194-3286</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                {t.clickChat} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* Teléfono */}
          <a href="tel:+526241393497" className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-out group min-h-[160px]">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
              <Phone size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{t.callUs}</h3>
              <p className="text-slate-500 text-xs font-medium mb-3">+52 (624) 139-3497</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                {t.clickCall} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* Correo */}
          <a href="mailto:reservationballard@gmail.com" className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 ease-out group min-h-[160px]">
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4 transition-colors duration-300">
              <Mail size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">{t.emailUs}</h3>
              <p className="text-slate-500 text-[11px] font-medium mb-3 truncate">reservationballard@gmail.com</p>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-widest">
                {t.clickEmail} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>

          {/* BANNER PREMIUM EN EL GRID */}
          <div className="sm:col-span-2 relative rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 bg-slate-900 group min-h-[220px] flex items-end">
            <div className="absolute inset-0">
              <img 
                src="/suburban-airport-los-cabos-ballard.webp" 
                alt="Luxury Suburban Airport Los Cabos" 
                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            
            <div className="relative z-10 p-6 w-full">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded text-white text-[9px] font-bold uppercase tracking-widest mb-3">
                <Car size={12} /> {t.bannerBadge}
              </div>
              <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight">
                {t.bannerTitle}
              </h3>
              <p className="text-slate-300 font-medium text-xs leading-relaxed max-w-[90%]">
                {t.bannerDesc}
              </p>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: FORMULARIO SÚPER LIMPIO */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 h-full flex flex-col justify-center">
            
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">{t.formTitle}</h2>
              <p className="text-slate-500 font-medium text-sm">{t.formDesc}</p>
            </div>

            {enviado ? (
              <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-10 text-center flex flex-col items-center justify-center flex-grow animate-fade-in">
                <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm text-slate-900 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{t.successTitle}</h3>
                <p className="text-slate-500 text-sm font-medium">{t.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Fila 1: Nombre y Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.nameLabel}</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                      <input
                        type="text"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder={t.namePh}
                        className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium text-sm placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.emailFormLabel}</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.emailFormPh}
                        className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium text-sm placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Fila 2: Asunto */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">{t.subLabel}</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                    <input
                      type="text"
                      name="asunto"
                      required
                      value={formData.asunto}
                      onChange={handleChange}
                      placeholder={t.subPh}
                      className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium text-sm placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Comentario */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">{t.msgLabel}</label>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${formData.comentario.length >= maxLength ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.comentario.length} / {maxLength}
                    </span>
                  </div>
                  <textarea
                    name="comentario"
                    required
                    rows="4"
                    value={formData.comentario}
                    onChange={handleChange}
                    placeholder={t.msgPh}
                    className="w-full bg-[#f9fafb] border border-slate-200/80 rounded-2xl p-4 text-slate-900 focus:bg-white focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium text-sm placeholder-slate-400 resize-none"
                  ></textarea>
                </div>

                {/* Botón Enviar */}
                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-4 px-8 rounded-2xl transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] duration-200 ease-out mt-4"
                >
                  {enviando ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm">{t.sending}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm tracking-wide">{t.sendBtn}</span> <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN DEL EQUIPO / TEAM SECTION */}
      <div className="max-w-6xl mx-auto px-4 mb-16 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {lang === 'es' ? 'Conoce a nuestro equipo' : 'Meet our team'}
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            {lang === 'es' ? 'Las personas detrás de tu excelente experiencia.' : 'The people behind your excellent experience.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Tania */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-4 border-white mb-5 group-hover:scale-105 transition-transform duration-500 ease-out">
              <img 
                src="/tania-ballard-tours-trafic-los-cabos-transportation-airport-private.webp" 
                alt="Tania" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Tania</h3>
            <span className="text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              {lang === 'es' ? 'Tráfico' : 'Traffic'}
            </span>
          </div>

          {/* Alex */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-4 border-white mb-5 group-hover:scale-105 transition-transform duration-500 ease-out">
              <img 
                src="/alex-ballard-tours-trafic-los-cabos-transportation-airport-private.webp" 
                alt="Alex" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Alex</h3>
            <span className="text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              Call Center
            </span>
          </div>

          {/* Dayana */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-4 border-white mb-5 group-hover:scale-105 transition-transform duration-500 ease-out">
              <img 
                src="/dayana.png" 
                alt="Dayana" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Dayana</h3>
            <span className="text-[11px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              {lang === 'es' ? 'Socia' : 'Partner'}
            </span>
          </div>
        </div>
      </div>

      {/* PREGUNTAS FRECUENTES (SEO) */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60">
          <FAQSection lang={lang} />
        </div>
      </div>

    </div>
  );
}