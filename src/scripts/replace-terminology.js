const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /Jadikan rumah Anda Airbnb/g, to: 'Daftarkan Perahu' },
  { from: /Tuan rumah/g, to: 'Kapten' },
  { from: /Host/g, to: 'Kapten' },
  { from: /Vendor/g, to: 'Kapten' },
  { from: /Rumah/g, to: 'Perahu' },
  { from: /rumah/g, to: 'perahu' },
  { from: /Daftar Keinginan/g, to: 'Favorit' },
  { from: /Perjalanan/g, to: 'Trip Saya' },
];

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== 'generated') {
        walk(filepath, callback);
      }
    } else {
      callback(filepath);
    }
  });
}

console.log("Starting terminology replacement...");

walk('src', (filepath) => {
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf8');
    let newContent = content;
    
    replacements.forEach(r => {
      newContent = newContent.replace(r.from, r.to);
    });

    if (newContent !== content) {
      fs.writeFileSync(filepath, newContent);
      console.log(`Updated: ${filepath}`);
    }
  }
});

console.log("Replacement completed.");
