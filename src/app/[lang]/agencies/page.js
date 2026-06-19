// src/app/[lang]/agencies/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, Briefcase, ChevronDown, Shield, Star, Globe } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { dict as globalDict } from '../../../locales/dict';

// ============================================================================
// DICCIONARIO LOCAL PARA LA PÁGINA DE AGENCIAS
// (Se usa como respaldo en caso de que estas traducciones no estén en tu dict.js)
// ============================================================================
const localDict = {
  en: {
    agencies: {
      heroTag: "B2B Partnerships",
      heroTitle: "Elevate Your Clients' Journey",
      heroSubtitle: "Partner with us to provide your clients with the most reliable and luxurious transportation services in Los Cabos.",
      ctaPlan: "Become a Partner",
      discountBadge: "Earn 20% Commission on every booking",
      
      formInstruction: "Start our Partnership",
      formSubInstruction: "Leave your details and our B2B Manager will contact you shortly.",
      successTitle: "Welcome Aboard!",
      success: "Your inquiry has been successfully received. We'll be in touch soon.",
      
      agencyName: "Agency Name",
      agencyNamePh: "Ex. Elite Travel Co.",
      agencyEmail: "Corporate Email",
      agencyEmailPh: "contact@elitetravel.com",
      howFoundUs: "How did you hear about us?",
      howFoundUsPh: "Ex. Google, Referral, Travel Expo...",
      comments: "Message / Specific Needs",
      commentsPh: "Tell us about your volume of clients, primary markets, or any specific VIP requests...",
      sending: "Sending...",
      send: "Submit Inquiry",
      
      footer: "Trusted by top travel professionals worldwide."
    }
  },
  es: {
    agencies: {
      heroTag: "Alianzas B2B",
      heroTitle: "Eleva el Viaje de tus Clientes",
      heroSubtitle: "Asóciate con nosotros para brindar a tus clientes el servicio de transporte más confiable y lujoso en Los Cabos.",
      ctaPlan: "Conviértete en Socio",
      discountBadge: "Gana 20% de Comisión en cada reserva",
      
      formInstruction: "Iniciemos una Alianza",
      formSubInstruction: "Deja tus datos y nuestro Gerente B2B te contactará a la brevedad.",
      successTitle: "¡Bienvenido a bordo!",
      success: "Tu solicitud ha sido recibida con éxito. Nos pondremos en contacto pronto.",
      
      agencyName: "Nombre de la Agencia",
      agencyNamePh: "Ej. Elite Travel Co.",
      agencyEmail: "Correo Corporativo",
      agencyEmailPh: "contacto@elitetravel.com",
      howFoundUs: "¿Cómo te enteraste de nosotros?",
      howFoundUsPh: "Ej. Google, Recomendación, Expo de Viajes...",
      comments: "Mensaje / Necesidades Específicas",
      commentsPh: "Cuéntanos sobre tu volumen de clientes, mercados principales o solicitudes VIP específicas...",
      sending: "Enviando...",
      send: "Enviar Solicitud",
      
      footer: "La confianza de los mejores profesionales del turismo a nivel mundial."
    }
  }
};

// ============================================================================
// COMPONENTE DE ANIMACIÓN (Intersection Observer)
// ============================================================================
const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ============================================================================
// PÁGINA PRINCIPAL
// ============================================================================
export default function AgenciesPage({ params }) {
  const lang = params?.lang || 'en';
  // Intenta tomar del global, si no existe toma el local que creamos arriba
  const t = globalDict[lang]?.agencies || localDict[lang].agencies;

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
      setTimeout(() => setEnviado(false), 8000);
      setFormData({ agencia: '', email: '', como: '', comentario: '' });
    } catch (error) {
      console.error("Error: ", error);
      alert("Error al enviar la solicitud.");
    }
    setEnviando(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const scrollToForm = () => {
    document.getElementById('contacto-agencia').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900 overflow-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2074" 
            alt="Business Travel Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-slate-900/60 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <FadeInSection delay={100}>
            <span className="text-blue-200 uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-4 block drop-shadow-md">
              {t.heroTag}
            </span>
          </FadeInSection>
          <FadeInSection delay={300}>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 drop-shadow-lg leading-tight">
              {t.heroTitle}
            </h1>
          </FadeInSection>
          
          {/* BANNER DE DESCUENTO EN EL HERO */}
          <FadeInSection delay={400}>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold text-sm md:text-base mb-8 shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-pulse">
              <Star size={18} className="fill-slate-900" />
              <span>{t.discountBadge}</span>
              <Star size={18} className="fill-slate-900" />
            </div>
          </FadeInSection>

          <FadeInSection delay={500}>
            <p className="text-lg md:text-2xl text-slate-200 font-light mb-12 max-w-2xl mx-auto drop-shadow-md">
              {t.heroSubtitle}
            </p>
          </FadeInSection>
          <FadeInSection delay={700}>
            <button 
              onClick={scrollToForm}
              className="bg-blue-600 border border-blue-500 text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-blue-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30 flex items-center gap-2 mx-auto"
            >
              <Briefcase size={20} />
              {t.ctaPlan}
            </button>
          </FadeInSection>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/50">
          <ChevronDown size={32} strokeWidth={1.5} />
        </div>
      </section>

      {/* SECTION 2: NUESTRA FILOSOFÍA (B2B) - TEXTO DURO INYECTADO */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeInSection className="order-2 md:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1974" 
                alt="Concierge Service" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 border-4 border-white/20 rounded-2xl z-10 pointer-events-none"></div>
            </div>
          </FadeInSection>
          
          <div className="order-1 md:order-2">
            <FadeInSection delay={200}>
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
                {lang === 'es' ? 'Tu reputación,' : 'Your reputation,'} <br />
                <span className="text-blue-600 italic">{lang === 'es' ? 'en manos seguras.' : 'in safe hands.'}</span>
              </h2>
            </FadeInSection>
            <FadeInSection delay={400}>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {lang === 'es' 
                  ? 'Entendemos que cuando reservas para tus clientes VIP, la reputación de tu agencia está en juego. Garantizamos puntualidad, lujo impecable y profesionalismo absoluto.' 
                  : "We understand that when you book services for your VIP clients, your agency's reputation is on the line. We guarantee punctuality, flawless luxury, and absolute professionalism."}
              </p>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {lang === 'es' 
                  ? 'Únete a nuestra red global de agencias de viajes de élite y disfruta de beneficios exclusivos, reservas prioritarias y un equipo dedicado a superar las expectativas de tus clientes.' 
                  : "Join our network of elite travel agencies worldwide and enjoy exclusive benefits, priority booking, and a dedicated team ready to exceed your clients' expectations."}
              </p>
            </FadeInSection>
            <FadeInSection delay={600}>
              <div className="flex items-center gap-4 text-slate-800 font-medium">
                <div className="w-12 h-px bg-blue-400"></div>
                {lang === 'es' ? 'Excelencia en cada kilómetro' : 'Excellence in every mile'}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 3: BENEFICIOS (B2B) - TEXTO DURO INYECTADO */}
      <section className="bg-slate-900 text-white py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-blue-400 font-semibold tracking-widest uppercase text-sm">
                {lang === 'es' ? 'Beneficios para Socios' : 'Partner Benefits'}
              </span>
              <h2 className="text-4xl md:text-5xl font-serif mt-4">
                {lang === 'es' ? '¿Por qué trabajar con nosotros?' : 'Why Partner With Us?'}
              </h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection delay={100} className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col flex-grow">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  <Star className="text-blue-400 group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-serif text-white mb-3">{lang === 'es' ? 'Flotilla Premium' : 'Premium Fleet'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {lang === 'es' 
                    ? 'Acceso a nuestras SUV y Vans de lujo de modelo reciente, mantenidas meticulosamente para el más alto estándar de confort.' 
                    : 'Access to our late-model luxury SUVs and vans, meticulously maintained to provide the highest standard of comfort and safety.'}
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={300} className="group">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col flex-grow">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  <Shield className="text-blue-400 group-hover:text-white transition-colors" size={28} />
                </div>
                <h3 className="text-xl font-serif text-white mb-3">{lang === 'es' ? 'Soporte Dedicado' : 'Dedicated Support'}</h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {lang === 'es' 
                    ? 'Línea de concierge B2B 24/7 exclusiva para manejar tus reservas, cambios de última hora y peticiones VIP.' 
                    : 'A 24/7 dedicated B2B concierge line to handle your bookings, last-minute changes, and special VIP requests.'}
                </p>
              </div>
            </FadeInSection>

            {/* TARJETA DE DESCUENTO RESALTADA */}
            <FadeInSection delay={500} className="group">
              <div className="relative bg-gradient-to-b from-blue-900/40 to-slate-800/80 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-8 hover:border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300 h-full overflow-hidden flex flex-col flex-grow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <span className="text-white font-black text-xl">20%</span>
                </div>
                <h3 className="text-xl font-serif text-white mb-3 relative z-10">{lang === 'es' ? '20% de Descuento Especial' : '20% Partner Discount'}</h3>
                <p className="text-blue-100/80 text-sm leading-relaxed relative z-10">
                  {lang === 'es' 
                    ? 'Obtén acceso inmediato a un 20% de comisión garantizada o descuento neto en todos nuestros servicios de transporte y tours.' 
                    : 'Gain immediate access to a guaranteed 20% commission or net discount on all our transportation services and tours.'}
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 4: FORMULARIO DE ALIANZA */}
      <section id="contacto-agencia" className="py-24 md:py-32 px-6 relative bg-slate-50">
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeInSection>
            <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-100">
              
              <div className="text-center mb-10">
                <Globe className="text-blue-500 mx-auto mb-4" size={48} strokeWidth={1.5} />
                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">{t.formInstruction}</h2>
                <p className="text-slate-500">{t.formSubInstruction}</p>
              </div>

              {enviado ? (
                <div className="text-center py-16">
                  <CheckCircle size={80} className="text-blue-500 mx-auto mb-6" strokeWidth={1} />
                  <h3 className="text-3xl font-serif text-slate-900 mb-4">{t.successTitle}</h3>
                  <p className="text-slate-600 text-lg">{t.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{t.agencyName}</label>
                      <input required type="text" name="agencia" value={formData.agencia} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-slate-200 py-2 focus:border-blue-500 outline-none transition-colors text-slate-800 placeholder-slate-300" placeholder={t.agencyNamePh} />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{t.agencyEmail}</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-slate-200 py-2 focus:border-blue-500 outline-none transition-colors text-slate-800 placeholder-slate-300" placeholder={t.agencyEmailPh} />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{t.howFoundUs}</label>
                    <input required type="text" name="como" value={formData.como} onChange={handleChange} 
                      className="w-full bg-transparent border-b-2 border-slate-200 py-2 focus:border-blue-500 outline-none transition-colors text-slate-800 placeholder-slate-300" placeholder={t.howFoundUsPh} />
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">{t.comments}</label>
                    <textarea required rows="4" name="comentario" value={formData.comentario} onChange={handleChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm resize-none text-slate-800 placeholder-slate-400"
                      placeholder={t.commentsPh}
                    ></textarea>
                  </div>

                  <div className="pt-4 text-center">
                    <button type="submit" disabled={enviando} 
                      className="inline-flex justify-center items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white font-medium px-12 py-4 rounded-full transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10 hover:shadow-blue-600/20 w-full sm:w-auto"
                    >
                      {enviando ? t.sending : <><Send size={18} /> {t.send}</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>© {new Date().getFullYear()} Ballard. {t.footer}</p>
      </footer>
    </div>
  );
}