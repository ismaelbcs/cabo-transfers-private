import { NextResponse } from 'next/server';

// Define los idiomas que soporta tu app
const locales = ['en', 'es'];
// El idioma por defecto si entran a la raíz
const defaultLocale = 'es';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Si alguien entra directamente a la raíz ("/"), mándalo a "/es"
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 2. Comprueba si la URL actual ya tiene un idioma (ej. /es/tours o /en/cart)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 3. Si no tiene idioma, redirígelo agregando el idioma por defecto
  if (!pathnameHasLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }
}

export const config = {
  // Evita que el middleware bloquee tus imágenes, iconos, y archivos de la carpeta public
  matcher: [
    '/((?!_next|api|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};