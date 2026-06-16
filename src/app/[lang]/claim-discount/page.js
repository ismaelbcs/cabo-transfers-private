// src/app/[lang]/claim-discount/page.js
'use client';

import React, { useState, useRef, use } from 'react';
import { Upload, Image as ImageIcon, X, Gift, CheckCircle2, Copy, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RewardApp({ params }) {
  // Configuración de Idioma
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'en';
  const isEs = lang === 'es';

  // Diccionario de Traducciones
  const t = {
    headerTitle: isEs ? "Reclama tu Recompensa" : "Claim Your Reward",
    headerDesc: isEs ? "Muéstranos tu reseña y obtén un descuento exclusivo para tu próximo viaje." : "Show us your review and get an exclusive discount for your next ride.",
    fullName: isEs ? "Nombre Completo" : "Full Name",
    namePlaceholder: isEs ? "Ej. Juan Pérez" : "John Doe",
    email: isEs ? "Correo Electrónico" : "Email Address",
    emailPlaceholder: isEs ? "juan@ejemplo.com" : "john@example.com",
    screenshot: isEs ? "Captura de pantalla de la reseña" : "Review Screenshot",
    tapUpload: isEs ? "Toca para subir o arrastra la imagen" : "Tap to upload or drag",
    fileType: isEs ? "PNG o JPG hasta 5MB" : "PNG, JPG up to 5MB",
    getDiscountBtn: isEs ? "Obtener mi Descuento" : "Get My Discount",
    successTitle: isEs ? "¡Genial, muchas gracias!" : "Awesome, thank you!",
    successDesc: isEs ? "Hemos verificado tu reseña. Aquí tienes tu código de descuento exclusivo para tu próxima reserva." : "We've verified your review. Here is your exclusive discount code for your next booking.",
    yourCode: isEs ? "Tu Código" : "Your Code",
    copyCodeTitle: isEs ? "Copiar código" : "Copy code",
    copied: isEs ? "¡Copiado!" : "Copied!",
    returnWeb: isEs ? "Volver al inicio" : "Return to Website"
  };

  // Estados para manejar el formulario y la vista de éxito
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  
  const fileInputRef = useRef(null);

  // Manejo de la imagen (simulado)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Crear una URL temporal para mostrar la vista previa
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setFileName('');
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Simulación de envío
  // Simulación y registro real en Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true); // Activa el loader visual si lo tienes

    // 1. Generar un código único de 4 letras aleatorias
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    const codigoGenerado = `CABO-${randomString}`;

    try {
      // 2. Guardamos el cupón en una colección llamada "cupones" en Firestore
      await setDoc(doc(db, "cupones", codigoGenerado), {
        codigo: codigoGenerado,
        tipo: "resena",            // Identifica que es por reseña de cliente
        descuento: 10,             // 10% de descuento fijo
        utilizado: false,          // Estado inicial: activo
        clienteEmail: e.target.elements[1]?.value || '', // Guarda el correo por seguridad
        fechaCreacion: new Date().toISOString()
      });

      // 3. Pasamos el código al estado para mostrarlo en la pantalla de éxito
      setDiscountCode(codigoGenerado);
      setIsSubmitted(true);

    } catch (error) {
      console.error("Error al crear el cupón en Firebase:", error);
      alert(isEs ? "Error al generar tu código. Intenta de nuevo." : "Error generating your code. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Copiar al portapapeles
  const handleCopyCode = () => {
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center p-4 sm:p-6 relative font-sans overflow-x-hidden selection:bg-blue-200 pt-20">
      
      {/* Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="z-10 w-full max-w-md mt-6">
        
        {/* Header */}
        <div className="text-center w-full flex flex-col items-center mb-6 animate-fade-in">
          <div className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center mb-4 shadow-sm border border-gray-100 ring-1 ring-gray-900/5">
             <Gift className="w-6 h-6 text-slate-800" strokeWidth={1.5} />
          </div>
          <h1 className="text-[24px] leading-tight font-black text-slate-900 tracking-tight mb-2">
            {t.headerTitle}
          </h1>
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed max-w-[280px]">
            {t.headerDesc}
          </p>
        </div>

        {/* View 1: The Form */}
        {!isSubmitted ? (
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 transition-all duration-500 relative overflow-hidden animate-fade-in"
          >
            {/* Form Fields */}
            <div className="space-y-5">
              
              {/* Name Input */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-widest">{t.fullName}</label>
                <input 
                  type="text" 
                  required
                  placeholder={t.namePlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px] placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-widest">{t.email}</label>
                <input 
                  type="email" 
                  required
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-[15px] placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>

              {/* Image Upload Area */}
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5 ml-1 uppercase tracking-widest">{t.screenshot}</label>
                
                <div 
                  className={`relative w-full border-2 border-dashed rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : previewUrl 
                        ? 'border-transparent bg-slate-50' 
                        : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    required={!previewUrl}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {!previewUrl ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-3 text-slate-400">
                        <Upload className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-[14px] font-bold text-slate-700 mb-1">{t.tapUpload}</p>
                      <p className="text-[12px] font-medium text-slate-400">{t.fileType}</p>
                    </div>
                  ) : (
                    <div className="relative w-full p-2">
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          clearImage();
                        }}
                        className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 mt-3 px-2 pb-1">
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-[13px] text-slate-600 truncate font-medium">{fileName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="mt-8 group relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-7 py-4 rounded-xl font-bold text-[15px] shadow-[0_4px_14px_0_rgb(0,0,0,0.15)] hover:bg-slate-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-all duration-300"
            >
              <span>{t.getDiscountBtn}</span>
              <Sparkles className="w-4 h-4 opacity-80 group-hover:rotate-12 transition-transform" />
            </button>
          </form>

        ) : (
          
          /* View 2: Success & Discount Code */
          <div className="bg-white rounded-[28px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center text-center">
            
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            
            <h2 className="text-[22px] font-black text-slate-900 mb-2 tracking-tight">
              {t.successTitle}
            </h2>
            <p className="text-slate-500 font-medium text-[15px] mb-8 leading-relaxed">
              {t.successDesc}
            </p>

            {/* Discount Code Box */}
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 relative group">
              <span className="block text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1">{t.yourCode}</span>
              <div className="text-[28px] font-black text-slate-900 tracking-wider font-mono">
                {discountCode}
              </div>
              
              <button 
                onClick={handleCopyCode}
                className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition-all"
                title={t.copyCodeTitle}
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              </button>
              
              {/* Tooltip */}
              <div className={`absolute -top-10 right-0 bg-slate-900 text-white text-[12px] font-bold py-1.5 px-3 rounded-lg transition-opacity duration-200 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {t.copied}
              </div>
            </div>

            <Link 
              href={`/${lang}`}
              className="text-slate-500 hover:text-slate-900 text-[14px] font-bold flex items-center gap-1 transition-colors group"
            >
              {t.returnWeb} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 pb-8 animate-fade-in">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Ballard Tours Los Cabos
          </p>
        </div>

      </div>
    </div>
  );
}