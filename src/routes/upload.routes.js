// futbol-node/src/routes/upload.routes.js
const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
// Se mantiene tu importación original de middleware, como me indicaste
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); 

const router = express.Router();

// Configuración de Multer para almacenar el archivo temporalmente en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir un archivo Excel de equipos
router.post(
  '/upload/teams-excel',
  [verifyToken, isAdmin, upload.single('file')], 
  uploadController.uploadTeamsExcel
);

// Ruta para subir un archivo Excel de posiciones
router.post(
  '/upload/positions-excel',
  [verifyToken, isAdmin, upload.single('file')], 
  uploadController.uploadPositionsExcel
);

// NUEVA RUTA: Ruta para subir un archivo Excel de directores técnicos
router.post(
  '/upload/technical-directors-excel',
  [verifyToken, isAdmin, upload.single('file')],
  uploadController.uploadTechnicalDirectorsExcel
);

// NUEVA RUTA: Ruta para subir un archivo Excel de jugadores
router.post(
  '/upload/players-excel',
  [verifyToken, isAdmin, upload.single('file')],
  uploadController.uploadPlayersExcel
);

module.exports = router;