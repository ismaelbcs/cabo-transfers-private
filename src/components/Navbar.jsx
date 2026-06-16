// src/components/Navbar.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Globe, Menu, X, Users, LogOut } from 'lucide-react';

export default function Navbar({ t, lang = 'en', cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const pathname = usePathname();
  const router = useRouter();
  const isEs = lang === 'es';

  // Efecto elegante de cristal al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // 🔥 NAVEGACIÓN INTELIGENTE Y NATIVA CORREGIDA 🔥
  const handleNavClick = (e, targetId) => {
    // Siempre cerramos el menú móvil si está abierto
    setIsMenuOpen(false);

    // Verificamos si estamos exactamente en la raíz (Home)
    const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;

    if (isHomePage) {
      // SI ESTAMOS EN HOME: Prevenimos la recarga y hacemos scroll suave
      if (targetId === 'home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId === 'zonas') {
        e.preventDefault();
        const element = document.getElementById('zonas');
        if (element) {
          const yOffset = -100; // Ajuste para que el Navbar no tape el título
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
    // SI NO ESTAMOS EN HOME: No hacemos e.preventDefault()
    // Dejamos que Next.js siga el href="/es#zonas" de forma natural y cambie de página.
  };

  const renderAuthButton = (isMobile = false) => {
    if (user) {
      return (
        <button
          onClick={handleLogout}
          className={`flex items-center gap-1.5 transition-all focus:outline-none group ${isMobile ? 'hover:text-red-500 text-left' : scrolled ? 'hover:text-red-500' : 'hover:text-red-300'}`}
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
        className={`flex items-center gap-1.5 transition-colors focus:outline-none ${isMobile ? 'hover:text-slate-900 text-left' : scrolled ? 'hover:text-slate-900' : 'hover:text-white'}`}
      >
        <Users size={isMobile ? 18 : 16} className={isMobile ? "text-slate-400" : ""} />
        {t?.nav?.login || (isEs ? 'Iniciar Sesión' : 'Login')}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* LOGO -> Apunta a Home */}
          <Link href={`/${lang}`} onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-3 group">
            <img src="/logo-cabo-airport-shuttle.png" alt="Cabo Airport Shuttle Logo" className="h-38 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
            {/* Reemplaza la sección del texto de tu logo con esto */}
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-[13px] sm:text-base md:text-xl font-black text-slate-900 leading-tight">
                Cabo <span className="font-bold text-slate-500">Private Transportation</span>
              </span>
              <span className="text-[8px] sm:text-[9px] md:text-xs font-bold tracking-widest text-slate-400 mt-0.5 uppercase">
                By Ballard Tours
              </span>
            </div>
          </Link>

          {/* MENÚ ESCRITORIO */}
          <div className={`hidden md:flex items-center space-x-8 text-sm font-bold tracking-tight transition-colors ${scrolled ? 'text-slate-500' : 'text-slate-200'}`}>
            <Link href={`/${lang}`} onClick={(e) => handleNavClick(e, 'home')} className={`hover:text-blue-500 transition-colors ${scrolled ? 'hover:text-slate-900' : 'hover:text-white'}`}>{t?.nav?.home || 'Home'}</Link>

            {/* ENLACE ZONAS CORREGIDO */}
            <Link href={`/${lang}#zonas`} onClick={(e) => handleNavClick(e, 'zonas')} className={`hover:text-blue-500 transition-colors ${scrolled ? 'hover:text-slate-900' : 'hover:text-white'}`}>{t?.nav?.rates || 'Rates & Zones'}</Link>

            <Link href={`/${lang}/fleet`} className={`hover:text-blue-500 transition-colors ${scrolled ? 'hover:text-slate-900' : 'hover:text-white'}`}>{t?.nav?.fleet || 'Fleet'}</Link>
            <Link href={`/${lang}/tours`} className={`hover:text-blue-500 transition-colors ${scrolled ? 'hover:text-slate-900' : 'hover:text-white'}`}>{t?.nav?.experiences || 'Experiences'}</Link>

            <div className={`h-5 w-px ${scrolled ? 'bg-slate-200' : 'bg-slate-600'}`}></div>

            {renderAuthButton(false)}

            <Link href={`/${lang}/cart`} className={`relative p-2 transition-colors group ${scrolled ? 'hover:text-slate-900' : 'hover:text-white'}`}>
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-slate-900 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={toggleLanguage} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest active:scale-95 transition-all ${scrolled ? 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'}`}>
              <Globe size={14} /> {lang === 'en' ? 'EN' : 'ES'}
            </button>
          </div>

          {/* ICONOS MÓVILES (DERECHA) */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleLanguage} className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${scrolled ? 'bg-slate-100 border border-slate-200 text-slate-600' : 'bg-white/10 border border-white/20 text-white'}`}>
              <Globe size={12} /> {lang}
            </button>
            <Link href={`/${lang}/cart`} className={`relative ${scrolled ? 'text-slate-700' : 'text-white'}`}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">{cartCount}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`focus:outline-none p-1 ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      <div className={`md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-96 border-t' : 'max-h-0 border-t-0'}`}>
        <div className="flex flex-col px-6 py-6 space-y-6 text-base font-bold text-slate-500 tracking-tight">
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