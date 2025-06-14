const bancosController = {};
const connection = require('express-myconnection');
const path = require('path');
const fs = require('fs');
const {validate_token} = require('./auth/jwt');

bancosController.login = async (req, res) => {
    const token = await validate_token(req);
    
    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }    
    const data = req.body;
    console.log(data);

    const conn = await new Promise((resolve, reject) =>{
        req.getConnection((err, conn) =>{
            if(err){
                return reject(res.render('error'));
            }

            resolve(conn);
        });
    });

    const ID = await new Promise((resolve, reject) =>{
        conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) =>{
            if(err) return reject(res.render('error'));

            resolve(rows);
        });
    });

    const login = await new Promise((resolve, reject) =>{
        conn.query('INSERT INTO Cuenta SET ?', [{PIN: data.PIN, Contrasenya: data.Contrasenya, ID_usuario: ID[0].ID}], (err, rows) =>{
            if(err) return reject(res.render('error'));

            resolve(res.redirect('/facturacion/bancos/'));
        });
    });
    return login;
}

module.exports = bancosController;