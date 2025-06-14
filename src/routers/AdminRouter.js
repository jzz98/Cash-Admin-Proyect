const express = require('express');
const AdminRoutes = express.Router();
const AdminController = require('../controllers/AdminController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'Noticias-images');

        // Verificar si la carpeta existe, si no, crearla
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Establecer la carpeta de destino para el archivo
        cb(null, uploadDir);
    },  
    filename: (req, file, cb) => {
        // Establecer el nombre del archivo para evitar conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

AdminRoutes.get('/', AdminController.list);
AdminRoutes.post('/Agregar-noticias', upload.single('imagen'), AdminController.agregarNoticia);
AdminRoutes.get('/notification-api', AdminController.obtenerNoticias);

module.exports = AdminRoutes;