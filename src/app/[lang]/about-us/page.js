// src/app/[lang]/about-us/page.js
'use client';

import React, { useEffect, use } from 'react';
import Link from 'next/link'; // 🔥 El enrutador nativo de Next.js
import {
  ShieldCheck,
  Clock,
  Briefcase,
  HeartHandshake,
  Star,
  Armchair,
  Users,
  Smile,
  Target,
  Compass,
  CheckCircle,
  MapPin
} from 'lucide-react';

export default function AboutUsPage({ params }) {
  // 🔥 Desempaquetamos los parámetros de Next.js 15
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || 'es';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const content = {
    es: {
      seoTitle: "Sobre Nosotros | Ballard Tour Services Los Cabos",
      seoDesc: "Transporte de aeropuerto confiable, traslados privados, tours y actividades en Los Cabos desde 2005.",
      title: "Sobre Ballard Tour Services",
      subtitle: "Conoce Nuestra Historia",
      motto1: "Tu viaje comienza con excelencia.",
      motto2: "Traslados Privados. Servicio Profesional. Experiencia Inolvidable.",
      motto3: "Del aeropuerto al paraíso.",
      historyTitle: "Nuestra Historia",
      historyIntro: "Transporte de Aeropuerto de Confianza, Traslados Privados, Tours y Actividades en Los Cabos Desde 2005.",
      historyText: [
        "Ballard Tour Services es una empresa profesional de transporte y turismo con sede en Los Cabos, Baja California Sur, México. Desde nuestra fundación en 2005, hemos brindado con orgullo servicios de transporte confiables, seguros y cómodos para miles de visitantes que viajan a Los Cabos cada año.",
        "Durante más de 20 años, nuestra misión ha sido simple: brindar un servicio al cliente excepcional, transporte puntual en el aeropuerto, conductores profesionales y experiencias de viaje inolvidables en Los Cabos.",
        "Nos especializamos en transporte privado desde el Aeropuerto Internacional de Los Cabos (SJD) a hoteles, resorts, alquileres vacacionales, villas, residencias, bodas, restaurantes, marinas, campos de golf y atracciones turísticas.",
        "Nuestros servicios incluyen traslados al aeropuerto, transporte a hoteles, servicios privados por horas, transporte para bodas, transporte corporativo, para grupos, traslados a cenas y soluciones personalizadas para familias, parejas y grupos grandes.",
        "Además del transporte, Ballard Tour Services ofrece una amplia variedad de tours y actividades, ayudando a los visitantes a descubrir las mejores experiencias que Baja California Sur tiene para ofrecer.",
        "Estamos totalmente comprometidos a operar de manera legal y profesional. Ballard Tour Services mantiene todos los permisos, licencias, registros, pólizas de seguro y requisitos operativos exigidos por las autoridades mexicanas (SCT).",
        "Nuestros experimentados choferes conocen a fondo la región, son bilingües, orientados al cliente y dedicados a brindar una experiencia fluida y sin estrés desde el momento en que llegas al aeropuerto hasta tu destino final."
      ],
      mission: {
        title: "Nuestra Misión",
        text: "En Ballard Tours, nuestra misión es brindar servicios de transporte turístico privado seguros, puntuales y de alta calidad en Los Cabos, ofreciendo una experiencia cómoda y libre de estrés desde el momento en que nuestros clientes llegan al aeropuerto hasta su destino final. Nos comprometemos a superar expectativas mediante un servicio personalizado, vehículos impecables y atención excepcional."
      },
      vision: {
        title: "Nuestra Visión",
        text: "Ser la empresa líder de transporte turístico privado en Los Cabos, reconocida por la excelencia en el servicio, la confianza de nuestros clientes y la innovación constante. Aspiramos a convertirnos en la primera opción para viajeros nacionales e internacionales que buscan comodidad, seguridad y una experiencia premium."
      },
      purpose: {
        title: "Nuestro Propósito",
        text: "Conectar a los visitantes con lo mejor de Los Cabos a través de un transporte confiable, cómodo y seguro, convirtiendo cada traslado en el inicio de una experiencia inolvidable."
      },
      valuesTitle: "Nuestros Valores",
      values: [
        { title: "Seguridad", text: "La seguridad de nuestros pasajeros es nuestra máxima prioridad. Mantenemos altos estándares en nuestros vehículos y operaciones.", icon: <ShieldCheck size={24} /> },
        { title: "Puntualidad", text: "Entendemos el valor del tiempo de nuestros clientes. Nos esforzamos por ofrecer traslados puntuales y eficientes.", icon: <Clock size={24} /> },
        { title: "Profesionalismo", text: "Nuestro equipo está comprometido con brindar una atención amable, respetuosa y profesional en todo momento.", icon: <Briefcase size={24} /> },
        { title: "Honestidad", text: "Actuamos con transparencia en nuestros precios, procesos y comunicación con nuestros clientes.", icon: <HeartHandshake size={24} /> },
        { title: "Excelencia", text: "Buscamos superar las expectativas en cada traslado, cuidando cada detalle para ofrecer una experiencia memorable.", icon: <Star size={24} /> },
        { title: "Comodidad", text: "Nuestros vehículos están equipados para proporcionar viajes cómodos, agradables y relajantes.", icon: <Armchair size={24} /> },
        { title: "Compromiso", text: "Escuchamos las necesidades de cada pasajero para ofrecer soluciones personalizadas y un servicio excepcional.", icon: <Users size={24} /> },
        { title: "Hospitalidad", text: "Representamos la calidez y hospitalidad que caracteriza a Los Cabos, haciendo que cada visitante se sienta bienvenido.", icon: <Smile size={24} /> }
      ],
      routesTitle: "Rutas Populares de Aeropuerto",
      whyChooseUsTitle: "¿Por qué elegirnos?",
      whyChooseUsList: [
        "Operando con excelencia desde 2005.",
        "Empresa de transporte con licencia (SCT) y asegurada.",
        "Transporte privado disponible 24/7.",
        "Choferes profesionales y bilingües.",
        "Rastreo de vuelos en vivo para llegadas al aeropuerto.",
        "Transporte para individuos, familias y grupos corporativos.",
        "Tours y actividades disponibles en todo Los Cabos.",
        "Servicio confiable, seguro y siempre puntual.",
        "Miles de visitantes satisfechos cada año."
      ]
    },
    en: {
      seoTitle: "About Us | Ballard Tour Services Los Cabos",
      seoDesc: "Trusted Airport Transportation, Private Transfers, Tours & Activities in Los Cabos Since 2005.",
      title: "About Ballard Tour Services",
      subtitle: "Discover Our History",
      motto1: "Your Journey Begins with Excellence.",
      motto2: "Private Transfers. Professional Service. Unforgettable Experience.",
      motto3: "From Airport to Paradise.",
      historyTitle: "Our History",
      historyIntro: "Trusted Airport Transportation, Private Transfers, Tours & Activities in Los Cabos Since 2005.",
      historyText: [
        "Ballard Tour Services is a professional transportation and tourism company based in Los Cabos, Baja California Sur, Mexico. Since our foundation in 2005, we have proudly provided reliable, safe, and comfortable transportation services for thousands of visitors traveling to Los Cabos every year.",
        "For more than 20 years, our mission has been simple: deliver exceptional customer service, punctual airport transportation, professional drivers, and unforgettable travel experiences throughout Los Cabos.",
        "We specialize in private airport transportation from Los Cabos International Airport (SJD) to hotels, resorts, vacation rentals, villas, residences, weddings, restaurants, marinas, golf courses, and tourist attractions.",
        "Our transportation services include airport transfers, hotel transportation, private charters, wedding transportation, corporate transportation, group transportation, hourly transportation services, dinner transportation, and customized transportation solutions for families, couples, and large groups.",
        "In addition to transportation, Ballard Tour Services offers a wide variety of tours and activities in Los Cabos, helping visitors discover the best experiences Baja California Sur has to offer.",
        "We are fully committed to operating legally and professionally. Ballard Tour Services maintains all permits, licenses, registrations, insurance policies, and operational requirements required by Mexican authorities.",
        "Our experienced drivers are knowledgeable about the region, bilingual, customer-focused, and dedicated to providing a smooth and stress-free experience from the moment you arrive at Los Cabos Airport until you reach your destination."
      ],
      mission: {
        title: "Our Mission",
        text: "At Ballard Tours, our mission is to provide safe, punctual, and high-quality private tourist transportation services in Los Cabos, offering a comfortable and stress-free experience from the moment our clients arrive at the airport to their final destination. We are committed to exceeding expectations through personalized service, impeccable vehicles, and exceptional attention."
      },
      vision: {
        title: "Our Vision",
        text: "To be the leading private tourist transportation company in Los Cabos, recognized for excellence in service, the trust of our clients, and constant innovation. We aspire to become the first choice for domestic and international travelers seeking comfort, safety, and a premium experience."
      },
      purpose: {
        title: "Our Purpose",
        text: "To connect visitors with the best of Los Cabos through reliable, comfortable, and safe transportation, turning every transfer into the beginning of an unforgettable experience."
      },
      valuesTitle: "Our Core Values",
      values: [
        { title: "Safety", text: "The safety of our passengers is our top priority. We maintain high standards in our vehicles and operations.", icon: <ShieldCheck size={24} /> },
        { title: "Punctuality", text: "We understand the value of our clients' time. We strive to provide punctual and efficient transfers.", icon: <Clock size={24} /> },
        { title: "Professionalism", text: "Our team is committed to providing friendly, respectful, and professional attention at all times.", icon: <Briefcase size={24} /> },
        { title: "Honesty", text: "We act with transparency in our pricing, processes, and communication with our clients.", icon: <HeartHandshake size={24} /> },
        { title: "Excellence", text: "We aim to exceed expectations in every transfer, taking care of every detail to offer a memorable experience.", icon: <Star size={24} /> },
        { title: "Comfort", text: "Our vehicles are equipped to provide comfortable, pleasant, and relaxing trips.", icon: <Armchair size={24} /> },
        { title: "Commitment", text: "We listen to the needs of each passenger to offer personalized solutions and exceptional service.", icon: <Users size={24} /> },
        { title: "Hospitality", text: "We represent the warmth and hospitality that characterizes Los Cabos, making every visitor feel welcome.", icon: <Smile size={24} /> }
      ],
      routesTitle: "Popular Airport Transportation Routes",
      whyChooseUsTitle: "Why Choose Us?",
      whyChooseUsList: [
        "Operating with excellence since 2005.",
        "Fully licensed and insured transportation company.",
        "Private transportation available 24/7.",
        "Professional bilingual drivers.",
        "Live flight tracking for airport arrivals.",
        "Transportation for individuals, families, and corporate groups.",
        "Tours and activities available throughout Los Cabos.",
        "Reliable, safe, and always punctual service.",
        "Thousands of satisfied visitors every year."
      ]
    }
  };

  const t = content[lang] || content.en;

  const popularRoutes = [
    { name: "Airport SJD to Nobu Hotel Los Cabos", path: `/${lang}/destinations/sjd-to-nobu-hotel` },
    { name: "Airport SJD to Hard Rock Hotel Los Cabos", path: `/${lang}/destinations/sjd-to-hard-rock` },
    { name: "Airport SJD to Riu Palace Baja California", path: `/${lang}/destinations/sjd-to-riu-palace` },
    { name: "Airport SJD to Riu Santa Fe", path: `/${lang}/destinations/sjd-to-riu-santa-fe` },
    { name: "Airport SJD to Grand Velas Los Cabos", path: `/${lang}/destinations/sjd-to-grand-velas` },
    { name: "Airport SJD to Waldorf Astoria", path: `/${lang}/destinations/sjd-to-waldorf-astoria` },
    { name: "Airport SJD to Marquis Los Cabos", path: `/${lang}/destinations/sjd-to-marquis` },
    { name: "Airport SJD to Secrets Puerto Los Cabos", path: `/${lang}/destinations/sjd-to-secrets-puerto-los-cabos` },
    { name: "Airport SJD to Hilton Los Cabos", path: `/${lang}/destinations/sjd-to-hilton-los-cabos` },
    { name: "Airport SJD to Hyatt Ziva Los Cabos", path: `/${lang}/destinations/sjd-to-hyatt-ziva` },
    { name: "Airport SJD to Dreams Los Cabos", path: `/${lang}/destinations/sjd-to-dreams-los-cabos` },
    { name: "Airport SJD to Breathless Cabo San Lucas", path: `/${lang}/destinations/sjd-to-breathless` },
    { name: "Airport SJD to Pueblo Bonito Sunset", path: `/${lang}/destinations/sjd-to-pueblo-bonito-sunset` },
    { name: "Airport SJD to Pueblo Bonito Pacifica", path: `/${lang}/destinations/sjd-to-pueblo-bonito-pacifica` },
    { name: "Airport SJD to Garza Blanca", path: `/${lang}/destinations/sjd-to-garza-blanca` }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans selection:bg-slate-900 selection:text-white">
      <title>{t.seoTitle}</title>
      <meta name="description" content={t.seoDesc} />

      {/* HERO SECTION */}
      <div className="bg-slate-950 text-white pt-32 pb-24 px-4 text-center rounded-b-[2.5rem] shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block bg-slate-800 text-slate-300 border border-slate-700/60 text-[10px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest shadow-sm">
            {t.subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white">
            {t.title}
          </h1>
          <p className="text-base md:text-xl text-slate-300 font-medium max-w-2xl mx-auto italic leading-relaxed">
            "{t.motto1}"
          </p>
          <p className="text-[11px] md:text-xs text-slate-500 mt-4 font-semibold uppercase tracking-widest">
            {t.motto2} • {t.motto3}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">

        {/* NUESTRA HISTORIA ORIGINAL */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-200 p-8 md:p-12 mb-12">
          <div className="mb-10 text-left border-b border-slate-100 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">{t.historyTitle}</h2>
            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-3xl">
              {t.historyIntro}
            </p>
          </div>

          <div className="space-y-6 text-slate-600 text-sm md:text-base leading-relaxed md:columns-2 gap-12">
            {t.historyText.map((paragraph, index) => (
              <p key={index} className="break-inside-avoid-column mb-6 font-medium text-justify">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-200 p-8 md:p-10 transition-all duration-300 hover:border-slate-400">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{t.mission.title}</h2>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              {t.mission.text}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-200 p-8 md:p-10 transition-all duration-300 hover:border-slate-400">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-center mb-6">
              <Compass size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">{t.vision.title}</h2>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              {t.vision.text}
            </p>
          </div>
        </div>

        {/* PURPOSE BANNER */}
        <div className="bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 mb-16 text-center text-white relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-400 mb-3">{t.purpose.title}</h2>
          <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed italic">
            "{t.purpose.text}"
          </p>
        </div>

        {/* CORE VALUES */}
        <div className="mb-10 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.valuesTitle}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {t.values.map((val, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-900 transition-all duration-300 group">
              <div className="w-10 h-10 bg-slate-50 group-hover:bg-slate-900 text-slate-700 group-hover:text-white rounded-lg flex items-center justify-center mb-4 transition-all duration-300 border border-slate-100">
                {val.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{val.title}</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                {val.text}
              </p>
            </div>
          ))}
        </div>

        {/* ROUTES AND WHY CHOOSE US */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2.5 tracking-tight">
              <MapPin size={22} className="text-slate-400" />
              {t.routesTitle}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-xs font-medium text-slate-600">
              {popularRoutes.map((route, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  {/* 🔥 AHORA USA EL ROUTER DE NEXT.JS */}
                  <Link href={route.path} className="text-slate-600 hover:text-slate-900 transition-colors">
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-5">
                {t.whyChooseUsTitle}
              </h2>
              <ul className="space-y-4 text-xs font-semibold text-slate-600">
                {t.whyChooseUsList.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT FOOTER */}
            <div className="bg-slate-950 text-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-800">
              <h3 className="text-lg font-bold tracking-tight mb-1">
                Ballard Tour Services
              </h3>
              <p className="text-[10px] font-bold text-slate-500 mb-6 uppercase tracking-wider border-b border-slate-800 pb-3">
                Transportation • Tours & Activities
              </p>
              <div className="text-xs text-slate-400 space-y-2.5 font-medium">
                <p>Los Cabos, Baja California Sur, Mexico</p>
                <p className="font-bold text-white text-base pt-1">Phone: +52 624 139 3497</p>
                <p>Email: <a href="mailto:reservationballard@gmail.com" className="text-slate-300 hover:text-white transition-colors">reservationballard@gmail.com</a></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}