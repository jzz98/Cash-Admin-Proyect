const express = require('express');
const path = require('path');
const inventarioController = {};
const connection = require('express-myconnection');
const {validate_token} = require('./auth/jwt');

inventarioController.list = async(req, res) =>{
    const token = await validate_token(req);

    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }   
     
    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return reject(res.render('error'));
            else resolve(conn);
        });
    });
    
    const user = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return reject(res.render('error'));
            else resolve(rows);
        });
    });

    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM Inventario WHERE ID_usuario = ?',[user[0].ID], (err, rows) =>{
            if(err){
                return res.render('error');
            }
            return res.render('inventario', {
                data: rows
            });
        });
    });
}

inventarioController.getProducts = async(req, res) => {
    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return reject(res.render('error'));
            else resolve(conn);
        });
    });
    
    const user = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return reject(res.render('error'));
            else resolve(rows);
        });
    });

    req.getConnection((err, conn) => {
        if (err) {
            return res.render('error')
        }

        conn.query('SELECT Producto, Monto FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, rows) => {
            if (err) {
                return res.render('error')
            }

            let productos = rows.map(row => row); // Extrae solo los nombres de los productos
            console.log(productos);
            res.json(productos); // Envía los datos como respuesta JSON
        });
    });
};

inventarioController.apiList = async(req, res) => {
    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return reject(res.render('error'));
            else resolve(conn);
        });
    });
    
    const user = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return reject(res.render('error'));
            else resolve(rows);
        });
    });

    req.getConnection((err, conn) => {
        if (err) {
            return res.render('error')
        }

        conn.query('SELECT * FROM Inventario WHERE ID_usuario = ?',[user[0].ID], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database query error' });
            }

            // Enviar los datos en formato JSON
            res.json(rows);
        });
    });
};

inventarioController.save = async(req, res) =>{
    const data = req.body;
    console.log(data)
        
    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return reject(res.render('error'));
            else resolve(conn);
        });
    });
    
    const user = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return reject(res.render('error'));
            else resolve(rows);
        });
    });

    data.ID_usuario = user[0].ID;
    
    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('INSERT INTO Inventario SET ?', [data], (err, rows) =>{
            if(err){
                return res.render('error');
            }

            return res.redirect('/facturacion/inventario');
        })
    });
}


inventarioController.delete = (req, res) =>{
    const {id} = req.params;
    console.log(id);
    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('DELETE FROM Inventario WHERE ID=?', [id], (err, rows) =>{
            if(err){
                return res.json(err);
            }
            res.redirect('/facturacion/inventario');
        });
    });
}

inventarioController.edit = (req, res) =>{
    const {id} = req.params;
    
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM Inventario WHERE ID=?', [id], (err, rows) =>{
            if(err){
                return res.render('error')
            }
            
            return res.render('inventario_edit', {
                data: rows
            });
        });
    });
}

inventarioController.update = (req, res) => {
    const {id} = req.params;
    const data = req.body;

    req.getConnection((err, conn) =>{
        conn.query('UPDATE Inventario set ? WHERE ID = ?', [data, id], (err, rows) =>{
            if(err){
                return res.redirect('/facturacion/ingresos/registrar-ingresos?error');
            }

            res.redirect('/facturacion/inventario');
        }); 
    });
}

module.exports = inventarioController;