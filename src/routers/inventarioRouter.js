const express = require('express');
const connection = require('express-myconnection');
const inventarioRouter = express.Router();
const inventarioController = require('../controllers/inventarioController');

inventarioRouter.get('/', inventarioController.list);
inventarioRouter.post('/agregar-producto', inventarioController.save);
inventarioRouter.get('/api', inventarioController.apiList);
inventarioRouter.get('/delete/:id', inventarioController.delete);
inventarioRouter.get('/update/:id', inventarioController.edit);
inventarioRouter.post('/update/:id', inventarioController.update);
inventarioRouter.get('/api/getproductos', inventarioController.getProducts);
module.exports = inventarioRouter;