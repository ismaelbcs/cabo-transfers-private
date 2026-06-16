// src/components/Navbar.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Globe, Menu, X, Users, LogOut, Ticket } from 'lucide-react';

export default function Navbar({ t, lang = 'en', cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const isEs = lang === 'es';

  // Detector de sesión del cliente
  useEffect(() => {
    const storedUser = localStorage.getItem('cabo_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleAuthChange = (e) => setUser(e.detail);
    window.addEventListener('authUserChanged', handleAuthChange);
    return () => window.removeEventListener('authUserChanged', handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('cabo_user');
    setUser(null);
    window.dispatchEvent(new CustomEvent('authUserChanged', { detail: null }));
  };

  const toggleLanguage = () => {
    if (!pathname) return router.push(lang === 'en' ? '/es' : '/en');
    const newLang = lang === 'en' ? 'es' : 'en';
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    if (newPath === pathname) router.push(`/${newLang}${pathname}`);
    else router.push(newPath);
  };

  // 🔥 NAVEGACIÓN INTELIGENTE Y NATIVA
  const handleNavClick = (e, targetId) => {
    setIsMenuOpen(false);

    const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;

    if (isHomePage) {
      if (targetId === 'home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId === 'zonas') {
        e.preventDefault();
        const element = document.getElementById('zonas');
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  };

  const renderAuthButton = (isMobile = false) => {
    if (user) {
      return (
        <button
          onClick={handleLogout}
          className={`flex items-center gap-1.5 transition-all focus:outline-none group ${isMobile ? 'hover:text-red-500 text-left' : 'hover:text-red-500 text-slate-500'}`}
          title={isEs ? "Cerrar Sesión" : "Logout"}
        >
          <div className="flex items-center gap-1.5 group-hover:hidden">
            <Users size={isMobile ? 18 : 16} className={isMobile ? "text-slate-400" : ""} />
            <span className="capitalize">{user.nombre.split(' ')[0]}</span>
          </div>
          <div className="hidden items-center gap-1.5 group-hover:flex">
            <LogOut size={isMobile ? 18 : 16} className="text-red-500" />
            <span className="text-red-500">{isEs ? "Salir" : "Logout"}</span>
          </div>
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          if (isMobile) setIsMenuOpen(false);
          window.dispatchEvent(new CustomEvent('openLoginModal'));
        }}
        className={`flex items-center gap-1.5 transition-colors focus:outline-none hover:text-slate-900 ${isMobile ? 'text-left' : 'text-slate-500'}`}
      >
        <Users size={isMobile ? 18 : 16} className={isMobile ? "text-slate-400" : ""} />
        {t?.nav?.login || (isEs ? 'Iniciar Sesión' : 'Login')}
      </button>
    );
  };

  return (
    // NAVBAR SIEMPRE BLANCO Y SÓLIDO
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* LOGO */}
          <Link href={`/${lang}`} onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-3 group">
            <img src="/logo-cabo-airport-shuttle.png" alt="Cabo Airport Shuttle Logo" className="h-38 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[13px] sm:text-base md:text-xl font-black text-slate-900 leading-tight">
                Cabo <span className="font-bold text-slate-500">Private Transportation</span>
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-xs font-bold tracking-widest text-slate-400 mt-0.5 uppercase">
                By Ballard Tours
              </span>
            </div>
          </Link>

          {/* MENÚ ESCRITORIO (TEXTOS SIEMPRE GRISES OSCUROS) */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold tracking-tight text-slate-500">
            <Link href={`/${lang}`} onClick={(e) => handleNavClick(e, 'home')} className="hover:text-slate-900 transition-colors">{t?.nav?.home || 'Home'}</Link>
            <Link href={`/${lang}#zonas`} onClick={(e) => handleNavClick(e, 'zonas')} className="hover:text-slate-900 transition-colors">{t?.nav?.rates || 'Rates & Zones'}</Link>
            <Link href={`/${lang}/fleet`} className="hover:text-slate-900 transition-colors">{t?.nav?.fleet || 'Fleet'}</Link>
            <Link href={`/${lang}/tours`} className="hover:text-slate-900 transition-colors">{t?.nav?.experiences || 'Experiences'}</Link>

            <div className="h-5 w-px bg-slate-200"></div>

            {renderAuthButton(false)}

            <Link href={`/${lang}/cart`} className="relative p-2 hover:text-slate-900 transition-colors group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={toggleLanguage} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest active:scale-95 transition-all bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900">
              <Globe size={14} /> {lang === 'en' ? 'EN' : 'ES'}
            </button>
            
            {/* BOTÓN CUPÓN ESCRITORIO */}
            <Link href={`/${lang}/apply-code`} className="flex flex-col items-center justify-center group ml-2">
              <div className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors shadow-sm active:scale-95">
                <Ticket size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  {lang === 'es' ? 'Pon tu Código' : 'Add Code'}
                </span>
              </div>
            </Link>
          </div>

          {/* ICONOS MÓVILES (DERECHA) */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 border border-slate-200 text-slate-600">
              <Globe size={12} /> {lang}
            </button>
            <Link href={`/${lang}/cart`} className="relative text-slate-700">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none p-1 text-slate-900">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div className={`md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 border-t' : 'max-h-0 border-t-0'}`}>
        <div className="flex flex-col px-6 py-6 space-y-6 text-base font-bold text-slate-500 tracking-tight">
          
          {/* BOTÓN CUPÓN MÓVIL */}
          <Link href={`/${lang}/apply-code`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-xl active:scale-95 transition-transform">
            <Ticket size={18} className="text-amber-400" />
            <span className="font-black uppercase tracking-widest text-sm">{lang === 'es' ? 'Pon tu Código de Descuento' : 'Add Discount Code'}</span>
          </Link>
          
          <div className="h-px w-full bg-slate-100"></div>

          <Link href={`/${lang}`} onClick={(e) => handleNavClick(e, 'home')} className="hover:text-slate-900">{t?.nav?.home || 'Home'}</Link>
          <Link href={`/${lang}#zonas`} onClick={(e) => handleNavClick(e, 'zonas')} className="hover:text-slate-900">{t?.nav?.rates || 'Rates & Zones'}</Link>
          <Link href={`/${lang}/fleet`} onClick={() => setIsMenuOpen(false)} className="hover:text-slate-900">{t?.nav?.fleet || 'Fleet'}</Link>
          <Link href={`/${lang}/tours`} onClick={() => setIsMenuOpen(false)} className="hover:text-slate-900">{t?.nav?.experiences || 'Experiences'}</Link>
          <div className="h-px w-full bg-slate-100 my-2"></div>

          {renderAuthButton(true)}
        </div>
      </div>
    </nav>
  );
}