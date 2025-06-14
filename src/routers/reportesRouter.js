const express = require('express');
const multer = require('multer');
const path = require('path');
const reportesController = require('../controllers/reportesController');
const reportesRouter = express.Router();
const fs = require('fs');
const { report } = require('process');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'graphics-img/'); // Carpeta donde se guardan las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nombre único
    }
});

const upload = multer({ storage });

reportesRouter.get('/ventas-generales', reportesController.start);
reportesRouter.get('/ventas-generales/Api', reportesController.api);
reportesRouter.get('/ventas-generales/ApiClient', reportesController.api2);
reportesRouter.post('/ventas-generales/crear-reporte', reportesController.AI);
reportesRouter.post('/ventas-generales/get', upload.single('file'), reportesController.getGraphics);
reportesRouter.get('/ventas-generales/delete/:id', reportesController.delete);
reportesRouter.get('/ventas-generales/descargar/:id', reportesController.descargar)
module.exports = reportesRouter;
