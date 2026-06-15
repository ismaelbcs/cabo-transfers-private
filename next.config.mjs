/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/es', // Redirige el dominio principal a la versión en español
        permanent: true,
      },
    ];
  },
};

export default nextConfig;