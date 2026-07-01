const fs = require('fs');

const files = [
  'src/app/[lang]/dinners/page.js',
  'src/app/[lang]/nightlife/page.js',
  'src/app/[lang]/transfers/page.js',
  'src/app/[lang]/golf/page.js',
  'src/app/[lang]/restaurants/[slug]/page.js',
  'src/app/[lang]/golf-courses/[slug]/page.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  
  if (!c.includes('useCart')) {
    // Determine depth for relative import based on file path
    const depth = f.split('/').length - 3; // 'src/app/[lang]/dinners/page.js' -> 6 parts - 3 = 3
    // But let's just use exact replace based on the existing useBooking import
    c = c.replace(/import \{ useBooking \} from '([^']+)';/, (match, path) => {
       const cartPath = path.replace('BookingContext', 'CartContext');
       return `import { useCart } from '${cartPath}';\n${match}`;
    });
  }

  // Replace 'const { agregarAlCombo, ' with 'const { agregarAlCombo } = useCart();\n  const { '
  c = c.replace('const { agregarAlCombo, ', 'const { agregarAlCombo } = useCart();\n  const { ');
  
  // Replace 'const { agregarAlCombo } = useBooking();' with 'const { agregarAlCombo } = useCart();'
  c = c.replace('const { agregarAlCombo } = useBooking();', 'const { agregarAlCombo } = useCart();');

  fs.writeFileSync(f, c);
});

console.log('Fixed useCart imports');
