const express = require('express');
const multer = require('multer');  // Importamos Multer
const path = require('path');
const personalRouter = express.Router();
const personalCotroller = require('../controllers/personalController');

// Rutas
personalRouter.get('/', personalCotroller.list);
personalRouter.post('/update', personalCotroller.update);
personalRouter.get('/logout', personalCotroller.logout);
personalRouter.get('/delete', personalCotroller.delete);
personalRouter.post('/update/api/v1', personalCotroller.updatev1);

module.exports = personalRouter;