// src/app/[lang]/weddings/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, CheckCircle, HeartHandshake, ChevronDown, Car, Map, Sparkles } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { dict as globalDict } from '../../../locales/dict';

// ============================================================================
// DICCIONARIO LOCAL PARA LA PÁGINA DE BODAS
// (Se usa como respaldo en caso de que estas traducciones no estén en tu dict.js)
// ============================================================================
const localDict = {
  en: {
    weddings: {
      heroTag: "Exclusive Services",
      heroTitle: "Your Dream Wedding",
      heroSubtitle: "We create unforgettable moments with attention to every detail.",
      ctaPlan: "Start Planning",
      
      philosophyTitle1: "Every detail,",
      philosophyTitle2: "perfectly executed.",
      philosophyP1: "We know your wedding day is one of the most important moments of your life. Our goal is to take away the stress of logistics so you and your guests can just focus on enjoying.",
      philosophyP2: "From luxury transportation ensuring punctual and elegant arrivals, to additional experiences for those traveling from afar.",
      philosophyTag: "Your vision, our mission",

      servicesTag: "What we offer",
      servicesMainTitle: "Comprehensive Services",
      serv1Title: "Logistics & Transportation",
      serv1Desc: "Modern and comfortable fleet to safely transport all your guests from the hotel to the altar, and back.",
      serv2Title: "VIP Attention",
      serv2Desc: "Exclusive luxury vehicles for the couple. A moment of peace, comfort, and privacy before and after the 'I do'.",
      serv3Title: "Experiences & Tours",
      serv3Desc: "Guests coming from out of town? We organize local tours and pre/post wedding activities to make their vacation complete.",

      formInstruction: "Tell us about your big day",
      formSubInstruction: "Fill out this form and a specialist will contact you.",
      successTitle: "Congratulations & Thank You!",
      success: "Your request has been successfully sent! We will contact you soon.",
      
      coupleName: "Couple's Names / Organizer",
      coupleNamePh: "Ex. Mariana & Carlos",
      email: "Email Address",
      emailPh: "email@example.com",
      phone: "Phone / WhatsApp",
      phonePh: "+1 234 567 8900",
      date: "Event Date",
      venue: "Event Venue",
      venuePh: "Ex. Sunset Monalisa or Beach",
      guests: "Number of Guests",
      guestsPh: "Ex. 150",
      servicesTitle: "Services of Interest",
      vision: "Vision / Additional Comments",
      visionPh: "Tell us a little more about your wedding style, approximate times, or any special details...",
      sending: "Sending...",
      send: "Send Request",
      
      footer: "Designed with passion for unforgettable moments.",

      services: {
        guestTransport: "Guest Transportation",
        vipTransport: "VIP Transportation (Couple)",
        photoVideo: "Photography & Video",
        makeup: "Hair & Makeup",
        tours: "Guest Tours"
      }
    }
  },
  es: {
    weddings: {
      heroTag: "Servicios Exclusivos",
      heroTitle: "Tu Boda de Ensueño",
      heroSubtitle: "Creamos momentos inolvidables con atención a cada detalle.",
      ctaPlan: "Comienza a Planear",
      
      philosophyTitle1: "Cada detalle,",
      philosophyTitle2: "perfectamente ejecutado.",
      philosophyP1: "Sabemos que el día de tu boda es uno de los momentos más importantes de tu vida. Nuestro objetivo es quitarte el estrés de la logística para que tú y tus invitados solo se preocupen por disfrutar.",
      philosophyP2: "Desde transporte de lujo que asegura llegadas puntuales y elegantes, hasta experiencias adicionales para quienes viajan de lejos.",
      philosophyTag: "Tu visión, nuestra misión",

      servicesTag: "Lo que ofrecemos",
      servicesMainTitle: "Servicios Integrales",
      serv1Title: "Logística y Transporte",
      serv1Desc: "Flotilla moderna y cómoda para trasladar a todos tus invitados desde el hotel hasta el altar, y de regreso a salvo.",
      serv2Title: "Atención VIP",
      serv2Desc: "Vehículos de lujo exclusivos para los novios. Un momento de paz, confort y privacidad antes y después del 'Sí, acepto'.",
      serv3Title: "Experiencias y Tours",
      serv3Desc: "¿Tus invitados vienen de fuera? Organizamos recorridos locales y actividades pre/post boda para que sus vacaciones sean completas.",

      formInstruction: "Cuéntanos sobre tu gran día",
      formSubInstruction: "Llena este formato y un especialista se pondrá en contacto contigo.",
      successTitle: "¡Felicidades y Gracias!",
      success: "¡Tu solicitud ha sido enviada con éxito! Nos pondremos en contacto pronto.",
      
      coupleName: "Nombre de los Novios / Organizador",
      coupleNamePh: "Ej. Mariana & Carlos",
      email: "Correo Electrónico",
      emailPh: "correo@ejemplo.com",
      phone: "Teléfono / WhatsApp",
      phonePh: "+52 123 456 7890",
      date: "Fecha del Evento",
      venue: "Lugar del Evento",
      venuePh: "Ej. Hacienda o Playa",
      guests: "Número de Invitados",
      guestsPh: "Ej. 150",
      servicesTitle: "Servicios de Interés",
      vision: "Visión / Comentarios Adicionales",
      visionPh: "Cuéntanos un poco más sobre el estilo de tu boda, horarios aproximados o cualquier detalle especial...",
      sending: "Enviando...",
      send: "Enviar Solicitud",
      
      footer: "Diseñado con pasión para momentos inolvidables.",

      services: {
        guestTransport: "Transporte de Invitados",
        vipTransport: "Transporte VIP (Novios)",
        photoVideo: "Fotografía y Video",
        makeup: "Maquillaje y Peinado",
        tours: "Tours para Invitados"
      }
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
export default function WeddingsPage({ params }) {
  const lang = params?.lang || 'en';
  // Intenta tomar del global, si no existe toma el local que creamos arriba
  const t = globalDict[lang]?.weddings || localDict[lang].weddings;

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
      setFormData({
        nombre: '', email: '', telefono: '', fecha: '', lugar: '', invitados: '',
        servicios: { guestTransport: false, vipTransport: false, photoVideo: false, makeup: false, tours: false },
        comentario: ''
      });
    } catch (error) {
      console.error("Error: ", error);
      alert("Error al enviar la solicitud.");
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

  const scrollToForm = () => {
    document.getElementById('contacto-boda').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-800 selection:bg-rose-200 selection:text-stone-900 overflow-hidden">
      
      {/* SECTION 1: HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=2070" 
            alt="Wedding Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-stone-900/40 bg-gradient-to-b from-stone-900/20 via-transparent to-stone-900/60"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <FadeInSection delay={100}>
            <span className="text-rose-100 uppercase tracking-[0.3em] text-sm md:text-base font-semibold mb-4 block drop-shadow-md">
              {t.heroTag}
            </span>
          </FadeInSection>
          <FadeInSection delay={300}>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 drop-shadow-lg">
              {t.heroTitle}
            </h1>
          </FadeInSection>
          <FadeInSection delay={500}>
            <p className="text-lg md:text-2xl text-stone-100 font-light mb-12 max-w-2xl mx-auto drop-shadow-md">
              {t.heroSubtitle}
            </p>
          </FadeInSection>
          <FadeInSection delay={700}>
            <button 
              onClick={scrollToForm}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-medium tracking-wide hover:bg-white hover:text-stone-900 transition-all duration-300"
            >
              {t.ctaPlan}
            </button>
          </FadeInSection>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/70">
          <ChevronDown size={32} strokeWidth={1.5} />
        </div>
      </section>

      {/* SECTION 2: NUESTRA FILOSOFÍA */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeInSection className="order-2 md:order-1">
            <div className="relative rounded-t-full overflow-hidden aspect-[3/4] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=2070" 
                alt="Wedding Details" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </FadeInSection>
          
          <div className="order-1 md:order-2">
            <FadeInSection delay={200}>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
                {t.philosophyTitle1} <br />
                <span className="text-rose-500 italic">{t.philosophyTitle2}</span>
              </h2>
            </FadeInSection>
            <FadeInSection delay={400}>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                {t.philosophyP1}
              </p>
              <p className="text-stone-600 text-lg leading-relaxed mb-8">
                {t.philosophyP2}
              </p>
            </FadeInSection>
            <FadeInSection delay={600}>
              <div className="flex items-center gap-4 text-stone-800 font-medium">
                <div className="w-12 h-px bg-rose-300"></div>
                {t.philosophyTag}
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICIOS Y EXPERIENCIAS */}
      <section className="bg-stone-100 py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="text-rose-500 font-semibold tracking-widest uppercase text-sm">{t.servicesTag}</span>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mt-4">{t.servicesMainTitle}</h2>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeInSection delay={100} className="group cursor-pointer">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="h-48 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1533558701576-23c65e0272fb?auto=format&fit=crop&q=80&w=800" alt="Transport" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <div className="p-8">
                  <Car className="text-rose-400 mb-4" size={32} strokeWidth={1.5} />
                  <h3 className="text-xl font-serif text-stone-900 mb-3">{t.serv1Title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{t.serv1Desc}</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={300} className="group cursor-pointer">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="h-48 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800" alt="VIP" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <div className="p-8">
                  <Sparkles className="text-rose-400 mb-4" size={32} strokeWidth={1.5} />
                  <h3 className="text-xl font-serif text-stone-900 mb-3">{t.serv2Title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{t.serv2Desc}</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={500} className="group cursor-pointer">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="h-48 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800" alt="Tours" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <div className="p-8">
                  <Map className="text-rose-400 mb-4" size={32} strokeWidth={1.5} />
                  <h3 className="text-xl font-serif text-stone-900 mb-3">{t.serv3Title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{t.serv3Desc}</p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 4: FORMULARIO DE CONTACTO */}
      <section id="contacto-boda" className="py-24 md:py-32 px-6 relative">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-stone-100 z-0"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeInSection>
            <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-[0_20px_50px_rgb(0,0,0,0.05)] border border-stone-100">
              
              <div className="text-center mb-10">
                <HeartHandshake className="text-rose-300 mx-auto mb-4" size={48} strokeWidth={1} />
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">{t.formInstruction}</h2>
                <p className="text-stone-500">{t.formSubInstruction}</p>
              </div>

              {enviado ? (
                <div className="text-center py-16">
                  <CheckCircle size={80} className="text-green-400 mx-auto mb-6" strokeWidth={1} />
                  <h3 className="text-3xl font-serif text-stone-900 mb-4">{t.successTitle}</h3>
                  <p className="text-stone-600 text-lg">{t.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest">{t.coupleName}</label>
                      <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-stone-200 py-2 focus:border-rose-400 outline-none transition-colors text-stone-800 placeholder-stone-300" placeholder={t.coupleNamePh} />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest">{t.email}</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-stone-200 py-2 focus:border-rose-400 outline-none transition-colors text-stone-800 placeholder-stone-300" placeholder={t.emailPh} />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest">{t.phone}</label>
                      <input required type="tel" name="telefono" value={formData.telefono} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-stone-200 py-2 focus:border-rose-400 outline-none transition-colors text-stone-800 placeholder-stone-300" placeholder={t.phonePh} />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest">{t.date}</label>
                      <input required type="date" name="fecha" value={formData.fecha} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-stone-200 py-2 focus:border-rose-400 outline-none transition-colors text-stone-600" />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest">{t.venue}</label>
                      <input required type="text" name="lugar" value={formData.lugar} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-stone-200 py-2 focus:border-rose-400 outline-none transition-colors text-stone-800 placeholder-stone-300" placeholder={t.venuePh} />
                    </div>
                    
                    <div className="relative group">
                      <label className="block text-[10px] font-bold text-stone-400 mb-1 uppercase tracking-widest">{t.guests}</label>
                      <input required type="number" name="invitados" value={formData.invitados} onChange={handleChange} 
                        className="w-full bg-transparent border-b-2 border-stone-200 py-2 focus:border-rose-400 outline-none transition-colors text-stone-800 placeholder-stone-300" placeholder={t.guestsPh} />
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-100">
                    <label className="block text-[10px] font-bold text-stone-400 mb-4 uppercase tracking-widest">{t.servicesTitle}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(t.services).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 cursor-pointer hover:border-rose-300 transition-colors group">
                          <div className="relative flex items-center justify-center">
                            <input type="checkbox" name={key} checked={formData.servicios[key]} onChange={handleCheckbox} 
                              className="peer appearance-none w-5 h-5 border-2 border-stone-300 rounded focus:ring-0 checked:border-rose-500 checked:bg-rose-500 transition-all cursor-pointer" />
                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-sm text-stone-600 group-hover:text-stone-900 transition-colors">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="block text-[10px] font-bold text-stone-400 mb-2 uppercase tracking-widest">{t.vision}</label>
                    <textarea required rows="4" name="comentario" value={formData.comentario} onChange={handleChange} 
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-50 outline-none transition-all text-sm resize-none text-stone-800 placeholder-stone-400"
                      placeholder={t.visionPh}
                    ></textarea>
                  </div>

                  <div className="pt-4 text-center">
                    <button type="submit" disabled={enviando} 
                      className="inline-flex justify-center items-center gap-3 bg-stone-900 hover:bg-rose-600 text-white font-medium px-12 py-4 rounded-full transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-stone-900/10 hover:shadow-rose-600/20 w-full sm:w-auto"
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
      <footer className="py-8 text-center text-stone-400 text-sm border-t border-stone-200 bg-white">
        <p>© {new Date().getFullYear()} Ballard. {t.footer}</p>
      </footer>
    </div>
  );
}