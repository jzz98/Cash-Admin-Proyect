const express = require('express');
const LocalRouter = express.Router();
const registerController = require('../controllers/registerController');
const username = [];

LocalRouter.get('/', (req, res) => {
    res.render('homePage');
});

LocalRouter.get('/soy-contador', (req, res) =>{
    const error = req.query.error
    
    if (req.session.usuario) {
        return res.redirect('/facturacion/facturacion-personal');
    }
    res.render('contabForm', {error});
});

LocalRouter.post('/soy-contador', registerController.saveContador);

LocalRouter.get('/Ingresa', (req, res) =>{
    const error = req.query.error;  

    if (req.session.usuario) {
        return res.redirect('/facturacion/facturacion-personal');
    }
    res.render('signIn', {error});
});

LocalRouter.get('/ver-usuario', (req, res) => {
    if (req.session.usuario) {
        return res.render('error');
    } else {
        res.status(401).json({ mensaje: "Sesión no encontrada o expirada" });
    }
});

LocalRouter.post('/Ingresa', registerController.saveSignIn);

LocalRouter.get('/login', (req, res) =>{
    const error = req.query.error;
    req.session.Nombre_usuario = req.body.Nombre_usuario;
    console.log(req.session.Nombre_usuario)
    if (req.session.usuario) {
        return res.redirect('/facturacion/facturacion-personal');
    }

    res.render('login', {error});
});

LocalRouter.post('/login/user', registerController.getUsuario);

module.exports = LocalRouter;