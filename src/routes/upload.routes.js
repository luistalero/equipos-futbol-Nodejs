const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/upload.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware'); 

const router = express.Router();

const excelStorage = multer.memoryStorage();
const uploadExcel = multer({ storage: excelStorage });

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
  }
});
const uploadImage = multer({ 
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen.'), false);
      }
    }
});

router.post(
  '/upload/teams-excel',
  [verifyToken, isAdmin, uploadExcel.single('file')],
  uploadController.uploadTeamsExcel
);

router.post(
  '/upload/positions-excel',
  [verifyToken, isAdmin, uploadExcel.single('file')],
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

router.post(
  '/upload/image',
  [verifyToken, isAdmin, uploadImage.single('image')],
  uploadController.uploadImage
);

module.exports = router;