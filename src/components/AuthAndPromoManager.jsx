// src/components/AuthAndPromoManager.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { Gift, User, Mail, Lock, CheckCircle, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AuthAndPromoManager({ lang = 'es', currentUser, setCurrentUser, setAppliedPromo, setDatosCliente }) {
  const isEs = lang === 'es';

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [pendingPromoCode, setPendingPromoCode] = useState('');
  
  const [isMounted, setIsMounted] = useState(false);
  const [localUser, setLocalUser] = useState(null); // Estado interno para la sesión

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('cabo_user');
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleOpenLogin = () => {
      setAuthMode('login');
      setShowAuthModal(true);
    };
    window.addEventListener('openLoginModal', handleOpenLogin);
    return () => window.removeEventListener('openLoginModal', handleOpenLogin);
  }, []);

  const t = {
    auth: {
      login_title: isEs ? "Iniciar Sesión" : "Sign In",
      register_title: isEs ? "Crear Cuenta" : "Create Account",
      name: isEs ? "Nombre Completo" : "Full Name",
      email: isEs ? "Correo Electrónico" : "Email Address",
      pass: isEs ? "Contraseña" : "Password",
      login_btn: isEs ? "Entrar" : "Sign In",
      register_btn: isEs ? "Registrarse" : "Register",
      no_account: isEs ? "¿No tienes cuenta?" : "Don't have an account?",
      has_account: isEs ? "¿Ya tienes cuenta?" : "Already have an account?",
      err_not_found: isEs ? "Usuario no encontrado o contraseña incorrecta" : "User not found or incorrect password",
      err_exists: isEs ? "Este correo ya está registrado" : "This email is already registered",
      err_generic: isEs ? "Ocurrió un error. Intenta de nuevo." : "An error occurred. Please try again."
    },
    promo: {
      title: isEs ? "¿Tienes un Código?" : "Have a Promo Code?",
      desc: isEs ? "Ingresa el código proporcionado por tu chofer para obtener un beneficio exclusivo." : "Enter the code provided by your driver to get an exclusive benefit.",
      placeholder: isEs ? "Ej. CHOFER10" : "E.g. DRIVER10",
      btn: isEs ? "Aplicar Código" : "Apply Code",
      err_empty: isEs ? "Por favor ingresa un código." : "Please enter a code.",
      err_used: isEs ? "Ya has utilizado este código anteriormente." : "You have already used this code before.",
      err_invalid: isEs ? "Código inválido o no existe." : "Invalid or non-existent code.",
      err_firebase: isEs ? "Error de conexión. Intenta de nuevo." : "Connection error. Please try again.",
      toast_title: isEs ? "¡Código Activado!" : "Code Activated!",
      toast_desc: isEs ? "El descuento se ha aplicado automáticamente a tu combo." : "The discount has been automatically applied to your combo."
    }
  };

  const handleChange = (e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value });

  const procesarCodigo = async (codigo, userLogueado = localUser) => {
    const codigoLimpio = String(codigo).trim().toUpperCase();
    if (!codigoLimpio) return setPromoError(t.promo.err_empty);

    if (!userLogueado) {
      setPendingPromoCode(codigoLimpio);
      setShowPromoModal(false);
      setShowAuthModal(true);
      return;
    }

    setPromoError('');
    try {
      const emailUsuario = String(userLogueado.email || userLogueado.correo || "").trim().toLowerCase();
      const historialRef = collection(db, "cupones_usados");
      const qHistorial = query(historialRef, where("correo", "==", emailUsuario), where("codigo", "==", codigoLimpio));
      const historialSnap = await getDocs(qHistorial);

      if (!historialSnap.empty) {
        setPromoError(t.promo.err_used);
        setShowPromoModal(true);
        return;
      }

      const codigosRef = collection(db, "codigos_descuento");
      const qCodigos = query(codigosRef, where("codigo", "==", codigoLimpio));
      const querySnapshot = await getDocs(qCodigos);

      if (querySnapshot.empty) {
        setPromoError(t.promo.err_invalid);
        setShowPromoModal(true);
        return;
      }

      let dataResult = null;
      querySnapshot.forEach((doc) => { dataResult = doc.data(); });

      if (setAppliedPromo) setAppliedPromo(dataResult);
      setShowPromoModal(false);
      setPromoInput('');

      toast.success(t.promo.toast_title, { description: `${codigoLimpio}: ${t.promo.toast_desc}`, duration: 4000 });

    } catch (err) {
      console.error("Firebase Error:", err);
      setPromoError(t.promo.err_firebase);
      setShowPromoModal(true);
    }
  };

  // Función auxiliar para registrar la sesión en el navegador
  const iniciarSesionGlobal = (userData) => {
    setLocalUser(userData);
    localStorage.setItem('cabo_user', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('authUserChanged', { detail: userData }));
    
    if (setCurrentUser) setCurrentUser(userData);
    if (setDatosCliente) setDatosCliente(prev => ({ ...prev, nombre: userData.nombre.split(' ')[0], email: userData.email }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const usuariosRef = collection(db, "Usuarios");

      if (authMode === 'login') {
        const q = query(usuariosRef, 
          where("correo", "==", authForm.email.trim().toLowerCase()), 
          where("contrasena", "==", authForm.password)
        );
        const querySnapshot = await getDocs(q);

        let user = null;
        if (!querySnapshot.empty) querySnapshot.forEach((doc) => { user = doc.data(); });
        else return setAuthError(t.auth.err_not_found);

        if (user) {
          const userData = { email: user.correo, nombre: user.nombre, role: user.descuento_agencia ? 'agency' : 'client', descuento: user.descuento_agencia || 0 };
          iniciarSesionGlobal(userData);
          setShowAuthModal(false);
          setAuthForm({ nombre: '', email: '', password: '' });

          if (user.descuento_agencia) {
            if (setAppliedPromo) setAppliedPromo({ codigo: "DESCUENTO_AGENCIA", porcentaje_descuento: user.descuento_agencia });
          } else if (pendingPromoCode) {
            procesarCodigo(pendingPromoCode, userData);
            setPendingPromoCode('');
          }
        }
      } else {
        const q = query(usuariosRef, where("correo", "==", authForm.email.trim().toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) return setAuthError(t.auth.err_exists);

        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const anio = fechaActual.getFullYear();
        const nombreLimpio = authForm.nombre.replace(/\s+/g, '').toLowerCase();
        const docIdUsuario = `${nombreLimpio}${dia}${mes}${anio}`;

        const nuevoUsuarioDb = { nombre: authForm.nombre.trim(), correo: authForm.email.trim().toLowerCase(), contrasena: authForm.password };
        await setDoc(doc(db, "Usuarios", docIdUsuario), nuevoUsuarioDb);

        const newUserState = { email: nuevoUsuarioDb.correo, nombre: nuevoUsuarioDb.nombre, role: 'client' };
        iniciarSesionGlobal(newUserState);
        setShowAuthModal(false);
        setAuthForm({ nombre: '', email: '', password: '' });

        if (pendingPromoCode) {
          procesarCodigo(pendingPromoCode, newUserState);
          setPendingPromoCode('');
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      setAuthError(t.auth.err_generic);
    }
  };

  useEffect(() => {
    if (localUser) return;
    const detonarPopup = () => { setShowPromoModal(true); window.removeEventListener('scroll', vigilarScroll); clearTimeout(temporizador); };
    const vigilarScroll = () => { if (window.scrollY > 400) detonarPopup(); };

    window.addEventListener('scroll', vigilarScroll);
    const temporizador = setTimeout(() => { detonarPopup(); }, 6000);

    return () => { window.removeEventListener('scroll', vigilarScroll); clearTimeout(temporizador); };
  }, [localUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codigoPromoUrl = params.get('promo');
    if (codigoPromoUrl) { setPromoInput(codigoPromoUrl.toUpperCase()); setShowPromoModal(true); }
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* MODAL CÓDIGO PROMO */}
      <Drawer.Root open={showPromoModal} onOpenChange={setShowPromoModal}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[2rem] fixed bottom-0 left-0 right-0 z-[101] max-w-md mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t border-slate-100 outline-none">
            {/* Etiquetas ocultas para lectores de pantalla (Evita errores de consola) */}
            <Drawer.Title className="sr-only">{t.promo.title}</Drawer.Title>
            <Drawer.Description className="sr-only">{t.promo.desc}</Drawer.Description>
            
            <div className="p-4 flex justify-center shrink-0">
              <div className="w-12 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="p-8 pt-2 text-center overflow-y-auto">
              <div className="w-14 h-14 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Gift size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-tighter">{t.promo.title}</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 px-2">{t.promo.desc}</p>

              <div className="relative">
                <input
                  type="text" value={promoInput} onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }} placeholder={t.promo.placeholder}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3.5 font-black text-slate-900 focus:bg-white focus:border-slate-900 outline-none text-center tracking-widest text-lg transition-all uppercase"
                />
              </div>
              
              {promoError && (
                <div className="mt-3 flex items-center gap-2 text-red-600 font-bold text-xs text-left bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
                  <AlertCircle size={14} className="shrink-0" /><span>{promoError}</span>
                </div>
              )}

              <button onClick={() => procesarCodigo(promoInput)} className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl text-sm tracking-wide transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-[0.98]">
                {t.promo.btn}
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* MODAL AUTENTICACIÓN */}
      <Drawer.Root open={showAuthModal} onOpenChange={setShowAuthModal}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100]" />
          <Drawer.Content className="bg-white flex flex-col rounded-t-[2rem] fixed bottom-0 left-0 right-0 z-[101] max-w-md mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-t border-slate-100 outline-none max-h-[90vh]">
            {/* Etiquetas ocultas para lectores de pantalla (Evita errores de consola) */}
            <Drawer.Title className="sr-only">{authMode === 'login' ? t.auth.login_title : t.auth.register_title}</Drawer.Title>
            <Drawer.Description className="sr-only">Formulario de acceso seguro</Drawer.Description>

            <div className="p-4 flex justify-center shrink-0">
              <div className="w-12 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="p-8 pt-2 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-xl mx-auto mb-4 shadow-sm"><User size={20} /></div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tighter">
                  {authMode === 'login' ? t.auth.login_title : t.auth.register_title}
                </h3>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.auth.name}</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input type="text" name="nombre" placeholder="Ej. John Doe" required value={authForm.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.auth.email}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="email" name="email" placeholder="correo@ejemplo.com" required value={authForm.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.auth.pass}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="password" name="password" placeholder="••••••••" required value={authForm.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all" />
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 text-red-600 font-bold text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
                    <AlertCircle size={14} className="shrink-0" /><span>{authError}</span>
                  </div>
                )}

                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl mt-4 text-sm tracking-wide shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-[0.98] transition-all">
                  {authMode === 'login' ? t.auth.login_btn : t.auth.register_btn}
                </button>
              </form>

              <div className="text-center mt-6 border-t border-slate-100 pt-6">
                <p className="text-xs font-medium text-slate-500">
                  {authMode === 'login' ? t.auth.no_account : t.auth.has_account}{' '}
                  <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-blue-600 font-bold hover:text-blue-800 transition-colors ml-1 focus:outline-none">
                    {authMode === 'login' ? t.auth.register_title : t.auth.login_title}
                  </button>
                </p>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}