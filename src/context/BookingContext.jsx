// src/context/BookingContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from 'sonner';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  // --- ESTADOS ORIGINALES ---
  const [paso, setPaso] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [subCategoria, setSubCategoria] = useState('');
  const [vistaEspecial, setVistaEspecial] = useState(null);
  const [imagenTourDestacada, setImagenTourDestacada] = useState('');

  // 🏨 NUEVO: Estado para guardar el nombre del hotel precargado en el buscador del Home
  const [busquedaHotelPrincipal, setBusquedaHotelPrincipal] = useState('');

  // 📸 FIX: Se agregaron los estados faltantes para el Lightbox
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const [lightboxIndice, setLightboxIndice] = useState(0);

  // 🛠 MODIFICADO: Se agregaron hotelId y zonaId para que la reserva sepa a dónde va
  const [reserva, setReserva] = useState({
    tourId: '', hotelId: '', zonaId: null, pasajeros: 1, fechaLlegada: '', fechaSalida: '',
    carSeat: 0, babySeat: 0, boosterSeat: 0, shoppingStop: false,
    participantes: [{ nombre: '', edad: '' }], comentarios: ''
  });

  // --- 👥 NUEVOS ESTADOS DE AUTENTICACIÓN (BILINGÜE) ---
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const sesionGuardada = localStorage.getItem('sesionActual');
      return sesionGuardada ? JSON.parse(sesionGuardada) : null;
    }
    return null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'
  const [authForm, setAuthForm] = useState({ nombre: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');

  // --- 🎁 NUEVOS ESTADOS DE CÓDIGOS DE DESCUENTO ---
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [pendingPromoCode, setPendingPromoCode] = useState('');

  // Sincronizar sesión en LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sesionActual', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sesionActual');
    }
  }, [currentUser]);

  // LECTOR MÁGICO DE CÓDIGOS QR / URL (?promo=CODE)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codigoPromoUrl = params.get('promo');
      if (codigoPromoUrl) {
        setPromoInput(codigoPromoUrl.toUpperCase());
        setShowPromoModal(true);
      }
    }
  }, []);

  // DETECTOR DE SCROLL Y TIEMPO (POP-UP AUTOMÁTICO DE REGALO)
  useEffect(() => {
    const detonarPopup = () => {
      // Solo lo muestra si no tiene un cupón ya aplicado
      if (!appliedPromo && !localStorage.getItem('promoPopupVisto')) {
        setShowPromoModal(true);
        localStorage.setItem('promoPopupVisto', 'true');
      }
      window.removeEventListener('scroll', vigilarScroll);
      clearTimeout(temporizador);
    };

    const vigilarScroll = () => {
      if (window.scrollY > 400) detonarPopup();
    };

    window.addEventListener('scroll', vigilarScroll);
    const temporizador = setTimeout(() => {
      detonarPopup();
    }, 8000); // 8 segundos de espera inicial

    return () => {
      window.removeEventListener('scroll', vigilarScroll);
      clearTimeout(temporizador);
    };
  }, [appliedPromo]);

  // EFECTO MÁGICO: Ajusta inputs de pasajeros en tours dinámicamente
  useEffect(() => {
    const actuales = [...reserva.participantes];
    const diferencia = reserva.pasajeros - actuales.length;
    if (diferencia > 0) {
      for (let i = 0; i < diferencia; i++) actuales.push({ nombre: '', edad: '' });
    } else if (diferencia < 0) {
      actuales.splice(diferencia);
    }
    if (diferencia !== 0) setReserva(prev => ({ ...prev, participantes: actuales }));
  }, [reserva.pasajeros]);

  const handleParticipanteChange = (index, campo, valor) => {
    const nuevos = [...reserva.participantes];
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setReserva(prev => ({ ...prev, participantes: nuevos }));
  };

  const puedeAvanzarPaso2 = () => {
    return reserva.fechaLlegada && reserva.participantes.every(p => p.nombre && p.edad);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAppliedPromo(null);
  };

  // --- LÓGICA DE USUARIOS CON FIREBASE (BILINGÜE) ---
  const handleAuthSubmit = async (e, currentLang = 'en') => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      try {
        const usuariosRef = collection(db, "Usuarios");
        const q = query(usuariosRef, where("correo", "==", authForm.email), where("contrasena", "==", authForm.password));
        const querySnapshot = await getDocs(q);

        let user = null;
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => { user = doc.data(); });
        } else {
          setAuthError(currentLang === 'es' ? 'Usuario no encontrado o contraseña incorrecta.' : 'User not found or incorrect password.');
          return;
        }

        if (user) {
          // Convertimos a número por seguridad. Si no existe, será 0.
          const descuentoNumero = Number(user.descuento_agencia) || 0;

          const userData = {
            email: user.correo,
            nombre: user.nombre,
            // Si el descuento es mayor a 0, le damos rol de agencia
            role: descuentoNumero > 0 ? 'agency' : 'client',
            descuento: descuentoNumero
          };

          setCurrentUser(userData);
          setShowAuthModal(false);
          setAuthForm({ nombre: '', email: '', password: '' });

          // FIX: Ya no inyectamos "AGENCY_DISCOUNT" a appliedPromo para evitar doble descuento en el carrito.
          // Solo procesamos un código pendiente si es un cliente normal que se logueó después de meter un cupón.
          if (!user.descuento_agencia && pendingPromoCode) {
            procesarCodigo(pendingPromoCode, userData, currentLang);
            setPendingPromoCode('');
          }
        }
      } catch (err) {
        setAuthError(currentLang === 'es' ? 'Error al conectar con la base de datos.' : 'Database connection error.');
      }
    } else {
      // REGISTRO DE NUEVA CUENTA
      try {
        const usuariosRef = collection(db, "Usuarios");
        const q = query(usuariosRef, where("correo", "==", authForm.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setAuthError(currentLang === 'es' ? 'Este correo ya está registrado.' : 'This email is already registered.');
          return;
        }

        const docIdUsuario = `${authForm.nombre.replace(/\s+/g, '').toLowerCase()}${Date.now()}`;

        await setDoc(doc(db, "Usuarios", docIdUsuario), {
          nombre: authForm.nombre,
          correo: authForm.email,
          contrasena: authForm.password
        });

        const newUser = { email: authForm.email, nombre: authForm.nombre, role: 'client' };
        setCurrentUser(newUser);
        setShowAuthModal(false);
        setAuthForm({ nombre: '', email: '', password: '' });

        if (pendingPromoCode) {
          procesarCodigo(pendingPromoCode, newUser, currentLang);
          setPendingPromoCode('');
        }
      } catch (err) {
        setAuthError(currentLang === 'es' ? 'Error al crear la cuenta.' : 'Registration error.');
      }
    }
  };

  // --- LÓGICA DE CUPONES CON FIREBASE (BILINGÜE) ---
  const procesarCodigo = async (codigo, userLogueado = currentUser, currentLang = 'en') => {
    if (!codigo) {
      setPromoError(currentLang === 'es' ? 'Ingresa un código por favor.' : 'Please enter a code.');
      return;
    }

    if (!userLogueado) {
      setPendingPromoCode(codigo);
      setShowPromoModal(false);
      setShowAuthModal(true);
      return;
    }

    setPromoError('');

    try {
      const emailUsuario = String(userLogueado.email || userLogueado.correo || "").trim().toLowerCase();
      const codigoLimpio = String(codigo).trim().toUpperCase();

      const qHistorial = query(collection(db, "cupones_usados"), where("correo", "==", emailUsuario), where("codigo", "==", codigoLimpio));
      const historialSnap = await getDocs(qHistorial);

      if (!historialSnap.empty) {
        setPromoError(currentLang === 'es' ? 'Ya has usado este código anteriormente.' : 'You have already used this coupon code.');
        return;
      }

      const q = query(collection(db, "codigos_descuento"), where("codigo", "==", codigoLimpio));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setPromoError(currentLang === 'es' ? 'Código inválido o expirado.' : 'Invalid or expired code.');
        return;
      }

      let dataResult = null;
      querySnapshot.forEach((doc) => { dataResult = doc.data(); });

      setAppliedPromo(dataResult);
      setShowPromoModal(false);

      toast.success(currentLang === 'es' ? `¡Código ${codigoLimpio} Activado!` : `Code ${codigoLimpio} Activated!`, {
        description: currentLang === 'es' ? 'El descuento se verá reflejado en tu checkout.' : 'The discount will reflect automatically on checkout.',
        duration: 4000,
      });

    } catch (err) {
      setPromoError(currentLang === 'es' ? 'Error al validar cupón.' : 'Error validating coupon.');
    }
  };

  return (
    <BookingContext.Provider value={{
      paso, setPaso, servicioSeleccionado, setServicioSeleccionado,
      subCategoria, setSubCategoria, vistaEspecial, setVistaEspecial,
      imagenTourDestacada, setImagenTourDestacada, reserva, setReserva,
      busquedaHotelPrincipal, setBusquedaHotelPrincipal,
      lightboxAbierto, setLightboxAbierto, // <-- FIX: Agregados al value
      lightboxIndice, setLightboxIndice,   // <-- FIX: Agregados al value
      handleParticipanteChange, puedeAvanzarPaso2,
      currentUser, setCurrentUser, showAuthModal, setShowAuthModal,
      authMode, setAuthMode, authForm, setAuthForm, authError, setAuthError,
      handleAuthSubmit, handleLogout,
      showPromoModal, setShowPromoModal, promoInput, setPromoInput,
      promoError, setPromoError, appliedPromo, setAppliedPromo, procesarCodigo
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);