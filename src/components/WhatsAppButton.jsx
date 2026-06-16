// 💬 WIDGET: WhatsApp Inteligente CRO
const WhatsAppButton = ({ lang = 'en' }) => {
  // Reemplaza este número con el tuyo. IMPORTANTE: Debe llevar el código de país, ej. 52 para México, sin el símbolo +
  const numeroWhatsApp = "526121943286";

  // 1. Diccionario de textos según el idioma
  const contenido = {
    en: {
      mensaje: "Hi Ballard Tours! I'm interested in booking private transportation/tours in Los Cabos. Can you help me?",
      tooltip: "Need help? Chat with us!",
      ariaLabel: "Contact us on WhatsApp"
    },
    es: {
      mensaje: "¡Hola Ballard Tours! Estoy interesado en reservar transporte privado/tours en Los Cabos. ¿Me pueden ayudar?",
      tooltip: "¿Necesitas ayuda? ¡Chatea con nosotros!",
      ariaLabel: "Contáctanos por WhatsApp"
    }
  };

  // 2. Seleccionamos el idioma actual (si no existe, usamos inglés por defecto)
  const t = contenido[lang] || contenido['en'];
  
  // 3. Generamos el link con el texto dinámico ya codificado
  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(t.mensaje)}`;

  return (
    <a
      href={linkWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[100] bg-green-500 hover:bg-green-400 text-white p-4 rounded-full shadow-[0_10px_25px_-5px_rgba(34,197,94,0.5)] transition-all hover:scale-110 hover:-translate-y-1 group flex items-center justify-center animate-fade-in"
      aria-label={t.ariaLabel}
    >
      {/* Ícono de WhatsApp en SVG */}
      <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>

      {/* Tooltip invisible que aparece al pasar el mouse (Ajustado dinámicamente) */}
      <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
        {t.tooltip}
      </span>
    </a>
  );
};

export default WhatsAppButton;