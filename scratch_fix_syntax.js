const fs = require('fs');
let content = fs.readFileSync('src/components/CustomerPhotosWidget.jsx', 'utf8');
content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('src/components/CustomerPhotosWidget.jsx', content, 'utf8');
console.log('Fixed syntax error in CustomerPhotosWidget');
