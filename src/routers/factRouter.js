const express = require('express');
const multer = require('multer');
const path = require('path');
const factController = require('../controllers/factController');
const factRouter = express.Router();

// Configurar almacenamiento con multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Configurar multer
const upload = multer({ storage: storage });

factRouter.get('/', factController.list);

factRouter.get('/api', factController.prodcutos);

factRouter.post('/', upload.single('Logo'), factController.crearFactura);

module.exports = factRouter;
