// src/components/AuthModal.jsx
'use client';

import React from 'react';
import { Drawer } from 'vaul';
import { User, X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function AuthModal({ lang = 'en' }) {
  const { 
    showAuthModal, setShowAuthModal, authMode, setAuthMode, 
    authForm, setAuthForm, authError, handleAuthSubmit 
  } = useBooking();

  return (
    <Drawer.Root open={showAuthModal} onOpenChange={setShowAuthModal}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[2rem] fixed bottom-0 left-0 right-0 z-[111] max-w-md mx-auto shadow-2xl outline-none max-h-[90vh]">
          
          <div className="p-4 flex justify-center shrink-0">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
          </div>

          <div className="p-8 pt-0 overflow-y-auto custom-scrollbar relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-0 right-6 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-900 text-white flex items-center justify-center rounded-2xl mx-auto mb-4 shadow-md">
                <User size={26} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {authMode === 'login' 
                  ? (lang === 'es' ? 'Iniciar Sesión' : 'Sign In') 
                  : (lang === 'es' ? 'Crear Cuenta' : 'Create Account')
                }
              </h3>
            </div>

            <form onSubmit={(e) => handleAuthSubmit(e, lang)} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {lang === 'es' ? 'Nombre Completo' : 'Full Name'}
                  </label>
                  <input type="text" required value={authForm.nombre} onChange={(e) => setAuthForm({ ...authForm, nombre: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none font-medium text-slate-800 focus:ring-2 focus:ring-blue-950" />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {lang === 'es' ? 'Correo Electrónico' : 'Email Address'}
                </label>
                <input type="email" required value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none font-medium text-slate-800 focus:ring-2 focus:ring-blue-950" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {lang === 'es' ? 'Contraseña' : 'Password'}
                </label>
                <input type="password" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none font-medium text-slate-800 focus:ring-2 focus:ring-blue-950" />
              </div>

              {authError && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2.5 rounded-lg border border-red-200">{authError}</p>}

              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-4 rounded-xl mt-6 uppercase text-sm tracking-wider shadow-lg active:scale-95 transition-transform">
                {authMode === 'login' ? (lang === 'es' ? 'Entrar' : 'Login') : (lang === 'es' ? 'Registrarme' : 'Sign Up')}
              </button>
            </form>

            <div className="text-center mt-6 border-t border-slate-100 pt-6">
              <p className="text-sm text-slate-500 font-medium">
                {authMode === 'login' 
                  ? (lang === 'es' ? '¿No tienes cuenta?' : "Don't have an account?") 
                  : (lang === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?')
                }
                <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); }} className="text-blue-600 font-black hover:underline ml-1">
                  {authMode === 'login' ? (lang === 'es' ? 'Regístrate aquí' : 'Register here') : (lang === 'es' ? 'Inicia Sesión' : 'Sign In')}
                </button>
              </p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}