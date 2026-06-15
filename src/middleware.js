// src/middleware.js
import { NextResponse } from 'next/server';

const locales = ['en', 'es']; // Idiomas soportados
const defaultLocale = 'en'; // El idioma por defecto siempre será Inglés

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Revisamos si la URL ya tiene el idioma (ej: /es/tours o /en/about)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return; // Si ya tiene idioma, lo dejamos pasar

  // Si no tiene idioma (entró a la raíz "/"), lo redirigimos a Inglés por defecto
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

// Configuración para que el middleware ignore imágenes, CSS y archivos internos
export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\..*).*)',
  ],
};