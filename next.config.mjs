/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esto obliga a Vercel a ignorar errores de ESLint (como las etiquetas <img>) y compilar de todos modos
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/es',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;