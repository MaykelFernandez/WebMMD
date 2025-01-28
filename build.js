const fs = require('fs');
const path = require('path');

// Archivos a concatenar (en orden)
const files = [
  'src/header.js',
  'lib/gl-matrix.min.js',
  'lib/ammo.js',
  'lib/whammy.js',
  'src/Inherit.js',
  'src/WebGL.js',
  'src/Utility.js',
  'src/PMD.js',
  'src/VMD.js',
  'src/PMDView.js',
  'src/PMDModelView.js',
  'src/Physics.js',
  'src/FileParser.js',
  'src/PMDFileParser.js',
  'src/VMDFileParser.js',
  'src/Common.js',
  'src/MMD.js',
  'src/footer.js'
];

// Leer y concatenar los archivos
let output = '';
files.forEach((file) => {
  output += fs.readFileSync(path.resolve(__dirname, file), 'utf8') + '\n';
});

// Escribir el archivo de salida
fs.writeFileSync(path.resolve(__dirname, 'dist/webmmd.js'), output);

console.log('Archivos concatenados correctamente en dist/webmmd.js');
