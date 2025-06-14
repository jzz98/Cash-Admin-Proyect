const controllerRegister = {};
const express = require('express');
const path = require('path');
const connection = require('express-myconnection');
const {hashPasword, verifyPassword} = require('../controllers/auth/key');
const {create_token, validate_token} = require('../controllers/auth/jwt');
const { create } = require('domain');

controllerRegister.saveSignIn = (req, res) =>{
    const data = req.body;

    req.getConnection((err, conn) =>{
        if(err){
            res.send(JSON.stringify(err));
        }
        conn.query('SELECT * FROM Usuarios WHERE Nombre_usuario = ? OR Email = ?', [data.Nombre_usuario, data.Email], async(err, rows) =>{
            if(err){
                return res.render('error');
            }

            if(rows.length > 0){
                console.log(rows);
                return res.redirect('/Ingresa?error=Cuenta existente');
            }

            const password = await new Promise((resolve, reject) =>{
                const dt = hashPasword(data.Passwrd);

                if(dt.length < 1){
                    return res.render('error');
                }

                resolve(dt)
            })
            data.Passwrd = password;

            conn.query('INSERT INTO Usuarios SET ?',[data], (err, rows) =>{
                if(err){
                    return res.render('error');
                }

                create_token(data.Nombre_usuario)
                req.session.usuario = { Nombre_usuario: data.Nombre_usuario };
                res.redirect('/facturacion/facturacion-personal');
            });
        });
    });
}

controllerRegister.saveContador = (req, res) =>{
    const data = req.body;

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('SELECT * FROM UsuariosContador WHERE Email= ?', [data.Email], (err, rows) =>{

            if(rows.length > 0){
                return res.redirect('/soy-contador?error=Correo en uso');
            }

            conn.query('INSERT INTO UsuariosContador SET ?', [data], (err, rows) =>{
                if(err){
                    return res.render('error');
                }
                
                create_token(data.Nombre_usuario)

                req.session.usuario = { Nombre_usuario: data.Nombre_usuario };
                res.redirect('/facturacion/facturacion-personal');
            });
        });
    })
}

controllerRegister.getUsuario = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) => {
        if (err) {
            return res.render('error');
        }

        conn.query('SELECT Passwrd FROM Usuarios WHERE Nombre_usuario=?', [data.Nombre_usuario], async(err, rows) => {
            if (err) {
                return res.render('error');
            }
            
            if (rows.length > 0) {
                const storedPassword = rows[0].Passwrd; 
                const enteredPassword = data.Passwrd; 

                const password = await new Promise((resolve, reject) => {
                    if(enteredPassword.length == ""){
                        return res.render('error');
                    }

                    const dt = verifyPassword(enteredPassword, storedPassword);
                    return resolve(dt);
                }) 

                if (password) {
                    const token = create_token(data.Nombre_usuario)
                    
                    res.cookie('token', token, {
                        httpOnly:true,
                        secure: false,
                        maxAge: 1000 * 1000
                    });
                    
                    req.session.usuario = { Nombre_usuario: data.Nombre_usuario };
                    return res.redirect('/facturacion/facturacion-personal');
                } else {
                    return res.redirect('/login?error=Contraseña incorrecta');
                }
            } else {
                return res.redirect('/login?error=Usuario no encontrado');
            }
        });
    });
};

module.exports = controllerRegister;