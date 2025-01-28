const path = require('path');

module.exports = {
  // Punto de entrada: Especifica los archivos en el orden correcto
  entry: [
    './src/header.js',
	'./src/gl-matrix.min.js',
	'./src/FileParser.js',
	'./src/Inherit.js',
	'./src/Physics.js',
	'./src/Pmd.js',
	'./src/PMDFileParser.js',
	'./src/PMDModelView.js',
	'./src/PmdView.js',
	'./src/Vmd.js',
	'./src/VmdFileParser.js',
	'./src/WebGL.js',
	'./src/Utility.js',
	'./src/Common.js',
	'./src/MMD.js',
	'./src/footer.js',
  ],

  // Configuración de salida
  output: {
    filename: 'webmmd.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // Carpeta de salida
  },

  // Modo de desarrollo o producción
  mode: 'development', // Puedes cambiarlo a 'production' para optimizaciones
};