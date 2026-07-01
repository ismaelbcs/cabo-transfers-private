const fs = require('fs');
let c = fs.readFileSync('src/app/sitemap.js', 'utf8');

c = "import { restaurantSEOData } from '../data/restaurantSEOData';\n" + c;
c = c.replace(
  'const allPaths = [...mainRoutes, ...serviceRoutes, ...destinationRoutes, ...tourRoutes];',
  'const restaurantRoutes = restaurantSEOData.map(r => `/restaurants/${r.slug}`);\n  const allPaths = [...mainRoutes, ...serviceRoutes, ...destinationRoutes, ...tourRoutes, ...restaurantRoutes];'
);

fs.writeFileSync('src/app/sitemap.js', c);
console.log('Sitemap updated!');
