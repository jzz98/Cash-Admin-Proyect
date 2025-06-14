const express = require('express');
const bancosRouter = express.Router();
const bancosController = require('../controllers/bancosController');

bancosRouter.get('/iniciar-sesion', (req, res) =>{
    res.render('bancos_pin');
});

bancosRouter.post('/iniciar-sesion', bancosController.login);

module.exports = bancosRouter;