// futbol-node/src/routes/upload.routes.js
const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
// Se mantiene tu importación original de middleware
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); 

const router = express.Router();

// --- CONFIGURACIÓN DE MULTER PARA EXCEL (ALMACENAMIENTO EN MEMORIA) ---
// Usado para procesar archivos Excel en el controlador
const excelStorage = multer.memoryStorage();
const uploadExcel = multer({ storage: excelStorage });

// --- CONFIGURACIÓN DE MULTER PARA IMÁGENES (ALMACENAMIENTO EN DISCO) ---
// Define dónde se guardarán las imágenes y cómo se nombrarán
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La carpeta 'public/uploads' debe existir en la raíz de tu proyecto
    // (es decir, al mismo nivel que 'src', 'node_modules', etc.)
    // La ruta es relativa a donde se ejecuta el proceso Node.js (generalmente la raíz del proyecto)
    cb(null, 'public/uploads/'); 
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único para evitar colisiones
    // NombreOriginal-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
  }
});
const uploadImage = multer({ 
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por imagen
    fileFilter: (req, file, cb) => {
      // Permitir solo tipos de imagen comunes
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen.'), false);
      }
    }
});


// --- RUTAS DE CARGA DE ARCHIVOS EXCEL ---
router.post(
  '/upload/teams-excel',
  [verifyToken, isAdmin, uploadExcel.single('file')], // Usa uploadExcel
  uploadController.uploadTeamsExcel
);

router.post(
  '/upload/positions-excel',
  [verifyToken, isAdmin, uploadExcel.single('file')], // Usa uploadExcel
  uploadController.uploadPositionsExcel
);

router.post(
  '/upload/technical-directors-excel',
  [verifyToken, isAdmin, uploadExcel.single('file')],
  uploadController.uploadTechnicalDirectorsExcel
);

router.post(
  '/upload/players-excel',
  [verifyToken, isAdmin, uploadExcel.single('file')],
  uploadController.uploadPlayersExcel
);

// --- NUEVA RUTA: RUTA GENÉRICA PARA SUBIR ARCHIVOS DE IMAGEN ---
// Esta ruta es para subir una imagen de forma individual.
// La URL devuelta puede ser usada para actualizar el campo logo_url/photo_url de una entidad existente.
router.post(
  '/upload/image',
  [verifyToken, isAdmin, uploadImage.single('image')], // 'image' es el nombre del campo esperado en el formulario multipart
  uploadController.uploadImage
);

module.exports = router;