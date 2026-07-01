const fs = require('fs');
let c = fs.readFileSync('src/app/[lang]/golf-courses/[slug]/page.js', 'utf8');

// Reduce padding and text size
c = c.replace(/p-6 md:p-8 sticky/, 'p-5 md:p-6 sticky');
c = c.replace(/className="space-y-4"/, 'className="space-y-3"');
c = c.replace(/text-2xl font-black text-slate-900 mb-6/, 'text-xl font-black text-slate-900 mb-4');

// Make the input heights smaller if there are h-12 or py-3
c = c.replace(/py-3/g, 'py-2');
c = c.replace(/h-12/g, 'h-10');

fs.writeFileSync('src/app/[lang]/golf-courses/[slug]/page.js', c);
console.log('Modified golf course layout');
