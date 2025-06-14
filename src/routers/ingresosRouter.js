const { data } = require('autoprefixer');
const express = require('express');
const multer = require('multer');
const path = require('path');
const ingresosRouter = express.Router();
const ingresosController = require('../controllers/ingresosController');

ingresosRouter.get('/', ingresosController.list);
ingresosRouter.post('/', ingresosController.save);
ingresosRouter.get('/delete/:id', ingresosController.delete);
ingresosRouter.get('/update/:id', ingresosController.edit);
ingresosRouter.post('/update/:id', ingresosController.update);
ingresosRouter.get('/v1/api/ver-usuario', ingresosController.account);
module.exports = ingresosRouter;