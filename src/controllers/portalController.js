const express = require('express');
const path = require('path');
const portalController = {};
const connection = require('express-myconnection');
const { use } = require('../routers/portalRouter');
const { sendEmail } = require('./apis/brevo');
const {validate_token} = require('./auth/jwt');

portalController.list = async(req, res) => {
    const token = await validate_token(req);

    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }    
    const connection = await new Promise((resolve, reject) =>{
        req.getConnection((err, conn) => {
            if(err) return res.render('error');
            resolve(conn)
        })
    })

    const user = await new Promise((resolve, reject) =>{
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario = ?', [req.session.usuario.Nombre_usuario], (err, rows) =>{
            if(err) return res.render('error');
            resolve(rows)
        });
    })
    const avatar = await new Promise((resolve, reject) => {
        connection.query('SELECT Nombre FROM Avatar WHERE Id_usuario=?', [user[0].ID], (err, rows) => {
            if(err) return res.render('error');
            else resolve(rows);
        });
    });

    const data = await new Promise((resolve, reject) => {
        connection.query('SELECT Nombre_usuario, Passwrd, Email FROM Usuarios WHERE ID=?', [user[0].ID], (err, rows) => {
            if(err) return res.render('error');
            else resolve(rows);
        });
    });

    const ingresos =  await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, ingresos) => {
            if (err){
                return res.render('error');
            } 
            else {
                resolve(ingresos);
            }
        });
    })

    const perfil = avatar.length > 0 ? `/user-configs/user-avatar/${avatar[0].Nombre}` : null;

    const clientes = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM Clientes WHERE ID_usuario = ?', [user[0].ID], (err, clientes) => {
            if (err){ 
                return res.render('error');
            }else {
                resolve(clientes);
            }
        });
    })

    res.render('portaldeclientes', {
        avatar: perfil,
        recovery: ingresos,
        infouser: data,
        data: clientes

    })
};



portalController.save = async(req, res) =>{
    const data = req.body;

    const connection = await new Promise((resolve, reject) =>{
        req.getConnection((err, conn) => {
            if(err) return res.render('error');
            resolve(conn)
        })
    })

    const user = await new Promise((resolve, reject) =>{
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario = ?', [req.session.usuario.Nombre_usuario], (err, rows) =>{
            if(err) return res.render('error');
            resolve(rows)
        });
    })
    data.ID_usuario = user[0].ID
    
    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('INSERT INTO Clientes SET ?', [data], (err, rows) =>{
            if(err){
                return res.render('error');
            }
            return res.redirect('/facturacion/portal-de-clientes');

        })
    })
}

portalController.delete = (req, res) =>{
    const {id} = req.params;

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('DELETE FROM Clientes WHERE ID=?', [id], (err, rows) =>{
            if(err){
                return res.render('error');
            }
            res.redirect('/facturacion/portal-de-clientes');
        });
    });
}

portalController.edit = (req, res) =>{
    const {id} = req.params;
    
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM Clientes WHERE ID=?', [id], (err, rows) =>{
            if(err){
                return res.render('error');
            }
            
            if(rows.length >=  0){
                console.log(rows);
            }

            return res.render('portal_edit', {
                data: rows
            });
        });
    });
}


portalController.update = (req, res) => {
    const {id} = req.params;
    const body = req.body;

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }
        conn.query('UPDATE Clientes set ? WHERE ID = ?', [body, id], (err, rows) =>{
            if(err){
                return res.redirect('/facturacion/ingresos/registrar-ingresos?error');
            }

            return res.redirect('/facturacion/portal-de-clientes');
        }); 
    });
}

portalController.recovery = (req, res) =>{
    const user = req.body;
    console.log(user)
    res.render('portal_newForm', {data: user});
}

portalController.sendEmail = async(req, res) =>{
    await sendEmail(req.body.Mensaje);
    res.redirect('/facturacion/portal-de-clientes');
}

module.exports = portalController;