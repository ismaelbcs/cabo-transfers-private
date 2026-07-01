'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogOut, Percent, ShieldCheck } from 'lucide-react';
import HeroBooking from '../../../components/HeroBooking';
import { useBooking } from '../../../context/BookingContext';

export default function AdminPage({ params }) {
  const router = useRouter();
  
  // React.use() wrapper to access params cleanly (Next 15+)
  const resolvedParams = React.use(params);
  const lang = resolvedParams?.lang || 'en';

  const { currentUser, setCurrentUser, setServicioSeleccionado, setPaso } = useBooking();
  
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [adminDiscount, setAdminDiscount] = useState(0);

  // Check if they are already logged in as admin
  useEffect(() => {
    if (currentUser?.email === 'admin') {
      setIsLogged(true);
      setAdminDiscount(Number(currentUser.descuento) || 0);
    }
  }, [currentUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'titan748') {
      setIsLogged(true);
      setError('');
    } else {
      setError(lang === 'es' ? 'Credenciales incorrectas' : 'Invalid credentials');
    }
  };

  const handleActivateDiscount = () => {
    // Save to global context as an agency, so the Cart will apply this discount to EVERYTHING
    setCurrentUser({
      role: 'agency',
      descuento: adminDiscount,
      nombre: 'Administrador',
      email: 'admin'
    });
    
    // Reset any previous selection
    setServicioSeleccionado('');
    setPaso(1);
    
    alert(lang === 'es' 
      ? `Descuento del ${adminDiscount}% activado. Ahora puedes elegir cualquier servicio abajo.` 
      : `${adminDiscount}% discount activated. You can now choose any service below.`);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUsername('');
    setPassword('');
    setAdminDiscount(0);
    setCurrentUser(null);
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 mb-8 tracking-tight">
            Admin Login
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Usuario
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 transition-all"
                placeholder="••••••"
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm font-bold text-center">{error}</p>
            )}
            
            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isDiscountActive = currentUser?.email === 'admin' && currentUser?.descuento === adminDiscount;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-32 flex flex-col md:flex-row items-center justify-between gap-6 relative z-40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Panel de Administrador</h1>
              <p className="text-sm text-slate-500 font-medium">Fija tu descuento y selecciona el servicio a reservar</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Percent size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={adminDiscount}
                  onChange={(e) => {
                    setAdminDiscount(Number(e.target.value));
                  }}
                  className="w-32 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-900 font-bold focus:ring-2 focus:ring-slate-900 transition-all text-lg"
                />
              </div>
              <button 
                onClick={handleActivateDiscount}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${isDiscountActive ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {isDiscountActive ? 'Descuento Activo ✓' : 'Aplicar Descuento'}
              </button>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors shrink-0 mt-4 md:mt-0"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Buscador Integrado */}
        {isDiscountActive && (
          <div className="relative z-30">
            <HeroBooking lang={lang} />
          </div>
        )}

      </div>
    </div>
  );
}
