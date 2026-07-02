const fs = require('fs');

const files = [
  'src/app/[lang]/dinners/page.js',
  'src/app/[lang]/golf-courses/[slug]/page.js',
  'src/app/[lang]/golf/page.js',
  'src/app/[lang]/nightlife/page.js',
  'src/app/[lang]/restaurants/[slug]/page.js',
  'src/app/[lang]/transfers/page.js',
  'src/components/HeroBooking.jsx',
  'src/components/TransportBookingForm.jsx'
];

const normalizeStr = "h.nombre.normalize('NFD').replace(/[\\u0300-\\u036f]/g, \"\").toLowerCase().includes(w.normalize('NFD').replace(/[\\u0300-\\u036f]/g, \"\"))";

files.forEach(filepath => {
  if (fs.existsSync(filepath)) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // 1. Upgrade simple .includes() in HeroBooking and TransportBookingForm to split(' ').every()
    content = content.replace(
      /\.filter\(h => h\.nombre\.toLowerCase\(\)\.includes\(\(busquedaHhOrigen \|\| ''\)\.toLowerCase\(\)\)\)/g,
      ".filter(h => (busquedaHhOrigen || '').toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w)))"
    );
    content = content.replace(
      /\.filter\(h => h\.nombre\.toLowerCase\(\)\.includes\(\(busquedaGolfOrigen \|\| ''\)\.toLowerCase\(\)\)\)/g,
      ".filter(h => (busquedaGolfOrigen || '').toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w)))"
    );
    content = content.replace(
      /\.filter\(h => h\.nombre\.toLowerCase\(\)\.includes\(\(busquedaNightlifeOrigen \|\| ''\)\.toLowerCase\(\)\)\)/g,
      ".filter(h => (busquedaNightlifeOrigen || '').toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w)))"
    );
    content = content.replace(
      /\.filter\(h => h\.nombre && h\.nombre\.toLowerCase\(\)\.includes\(\(busquedaHotelPrincipal \|\| ''\)\.toLowerCase\(\)\)\)/g,
      ".filter(h => h.nombre && (busquedaHotelPrincipal || '').toLowerCase().split(' ').every(w => h.nombre.toLowerCase().includes(w)))"
    );

    // 2. Add accent normalization and `.slice(0, 30)` to ALL `.every(w => ...).map(`
    content = content.replace(
      /h\.nombre\.toLowerCase\(\)\.includes\(w\)/g,
      "h.nombre.normalize('NFD').replace(/[\\u0300-\\u036f]/g, \"\").toLowerCase().includes(w.normalize('NFD').replace(/[\\u0300-\\u036f]/g, \"\"))"
    );

    content = content.replace(
      /\.every\(w => h\.nombre\.normalize\('NFD'\)\.replace\(\/\[\\\\u0300-\\\\u036f\]\/g, ""\)\.toLowerCase\(\)\.includes\(w\.normalize\('NFD'\)\.replace\(\/\[\\\\u0300-\\\\u036f\]\/g, ""\)\)\)\)\.map\(/g,
      ".every(w => h.nombre.normalize('NFD').replace(/[\\u0300-\\u036f]/g, \"\").toLowerCase().includes(w.normalize('NFD').replace(/[\\u0300-\\u036f]/g, \"\")))).slice(0, 30).map("
    );
    
    // To handle cases where it was already replaced or didn't match perfectly, let's just use a simpler regex for slice.
    // Wait, let's just make sure `.slice(0, 30)` is added before `.map(` if it's following a `)`
    // Let's do it like this:
    content = content.replace(
      /\.every\(w => (.*?)\)\)\.map\(/g,
      ".every(w => $1)).slice(0, 30).map("
    );
    
    // If it already had .slice(0, 30), it will become .slice(0, 30).slice(0, 30). Let's fix that.
    content = content.replace(/\.slice\(0, 30\)\.slice\(0, 30\)/g, ".slice(0, 30)");

    fs.writeFileSync(filepath, content);
  }
});

console.log("Patch complete.");
