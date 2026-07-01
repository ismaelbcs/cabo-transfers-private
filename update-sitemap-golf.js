const fs = require('fs');
let c = fs.readFileSync('src/app/sitemap.js', 'utf8');

if(!c.includes('golfSEOData')) {
  c = "import { golfSEOData } from '../data/golfSEOData';\n" + c;
  c = c.replace(
    'const allPaths = [...mainRoutes, ...serviceRoutes, ...destinationRoutes, ...tourRoutes, ...restaurantRoutes];',
    'const golfRoutes = golfSEOData.map(r => `/golf-courses/${r.slug}`);\n  const allPaths = [...mainRoutes, ...serviceRoutes, ...destinationRoutes, ...tourRoutes, ...restaurantRoutes, ...golfRoutes];'
  );

  fs.writeFileSync('src/app/sitemap.js', c);
  console.log('Sitemap updated for golf!');
} else {
  console.log('Sitemap already has golf data.');
}
