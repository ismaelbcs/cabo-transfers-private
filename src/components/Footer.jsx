// src/components/Footer.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Mail } from 'lucide-react';

const Footer = ({ lang = 'en' }) => {
  const isEs = lang === 'es';

  // Diccionario bilingüe para el Footer
  const t = {
    desc: isEs 
      ? "Transporte privado premium y excursiones de lujo en Los Cabos. Confiables, cómodos y siempre a tiempo." 
      : "Premium private transportation and luxury tours in Los Cabos. Reliable, comfortable, and always on time.",
    contactTitle: isEs ? "Información de Contacto" : "Contact Information",
    companyTitle: isEs ? "Compañía" : "Company",
    legalTitle: isEs ? "Legal" : "Legal",
    address: "Cabo San Lucas, Baja California Sur, Mexico.",
    about: isEs ? "Sobre Nosotros" : "About Us",
    contact: isEs ? "Contáctanos" : "Contact Us",
    fleet: isEs ? "Nuestra Flota" : "Fleet",
    tours: isEs ? "Tours y Excursiones" : "Tours & Excursions",
    terms: isEs ? "Términos y Condiciones" : "Terms & Conditions",
    privacy: isEs ? "Aviso de Privacidad" : "Privacy Policy",
    cancel: isEs ? "Políticas de Cancelación" : "Cancellation Policy",
    rights: isEs ? "Todos los derechos reservados." : "All rights reserved."
  };

  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900 font-sans selection:bg-white selection:text-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* ================= 1. MARCA, DESCRIPCIÓN Y REDES SOCIALES ================= */}
          <div className="lg:col-span-4 flex flex-col">
            <Link href={`/${lang}`} className="inline-block mb-6 group w-max">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo-cabo-airport-shuttle.png" 
                  alt="Cabo Airport Shuttle Logo" 
                  className="h-30 w-auto object-contain group-hover:scale-105 transition-transform duration-300 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-black text-2xl tracking-tighter leading-none text-white">
                    Cabo<span className="text-slate-400">Private Transportation</span>
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase mt-0.5 text-slate-500">
                    by Ballard Tours
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-sm mb-8">
              {t.desc}
            </p>

            {/* Redes Sociales (SVGs Originales) */}
            <div className="flex space-x-5">
              {/* Facebook */}
              <a href="https://www.facebook.com/ballardtourservices" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/ballardtours/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@ballardtours" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors duration-300 transform hover:scale-110" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.39-3.16-3.8-5.46-.4-2.08-.04-4.28 1.09-6.09 1.54-2.52 4.54-3.81 7.42-3.15v4.06c-1.57-.46-3.32-.01-4.45 1.13-1.04 1.08-1.37 2.69-1.04 4.16.32 1.44 1.45 2.62 2.87 3.02 1.34.37 2.8-.02 3.8-1.01.88-.86 1.32-2.12 1.28-3.37.04-4.49.02-8.98.02-13.47.01-1.93.01-3.86.02-5.79z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* ================= 2. CONTACTO ================= */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-bold tracking-tight mb-6">{t.contactTitle}</h3>
            <ul className="space-y-4">
              {/* Ubicación */}
              <li className="flex items-start gap-3 text-slate-400 text-sm font-medium hover:text-white transition-colors group">
                <MapPin size={18} className="shrink-0 mt-0.5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                <a href="https://maps.app.goo.gl/1bmFeQCRgwVfs9GZ9" target="_blank" rel="noopener noreferrer">
                  {t.address}
                </a>
              </li>
              {/* Teléfono */}
              <li className="flex items-center gap-3 text-slate-400 text-sm font-medium group">
                <Phone size={18} className="shrink-0 text-slate-500 group-hover:text-green-400 transition-colors" />
                <a href="tel:+526241393497" className="hover:text-white transition-colors">+52 (624) 139-3497</a>
              </li>
              {/* WhatsApp 1 */}
              <li className="flex items-center gap-3 text-slate-400 text-sm font-medium group">
                <MessageCircle size={18} className="shrink-0 text-slate-500 group-hover:text-green-400 transition-colors" />
                <a href="https://wa.me/526241393497" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+52 (624) 139-3497</a>
              </li>
              {/* WhatsApp 2 */}
              <li className="flex items-center gap-3 text-slate-400 text-sm font-medium group">
                <MessageCircle size={18} className="shrink-0 text-slate-500 group-hover:text-green-400 transition-colors" />
                <a href="https://wa.me/526121943286" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+52 (612) 194-3286</a>
              </li>
              {/* Email */}
              <li className="flex items-center gap-3 text-slate-400 text-sm font-medium group">
                <Mail size={18} className="shrink-0 text-slate-500 group-hover:text-blue-400 transition-colors" />
                <a href="mailto:reservationballard@gmail.com" className="hover:text-white transition-colors truncate">reservationballard@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* ================= 3. COMPAÑÍA ================= */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold tracking-tight mb-6">{t.companyTitle}</h3>
            <ul className="space-y-4 flex flex-col">
              <li>
                <Link href={`/${lang}/about-us`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.contact}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/fleet`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.fleet}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/tours`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.tours}
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= 4. LEGAL ================= */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold tracking-tight mb-6">{t.legalTitle}</h3>
            <ul className="space-y-4 flex flex-col">
              <li>
                <Link href={`/${lang}/terms-and-conditions`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/privacy-policy`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/politicas-de-cancelacion`} className="text-slate-400 text-sm font-medium hover:text-white hover:translate-x-1 transition-all duration-300">
                  {t.cancel}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <p className="text-slate-500 text-xs font-medium tracking-wide">
            © {new Date().getFullYear()} Ballard Tours Los Cabos. {t.rights}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;