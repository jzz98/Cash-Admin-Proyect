const express = require('express');
const AdminController = {};
const connection = require('express-myconnection');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {validate_token} = require('./auth/jwt');

AdminController.list = async(req, res) =>{
    const token = await validate_token(req);
  
    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }    
    const conn = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) reject(err);
            else resolve(conn);
        });
    });

    const data = await new Promise((resolve, reject) => {
        conn.query('SELECT Monto,Contacto, Fecha_ingreso FROM Ingresos', (err, rows) => {
            if (err) {
                reject(err);
            }   
            resolve(rows);
        });
    });

    res.render('AdminView', {
        data: data
    });
}

AdminController.agregarNoticia = (req, res) => {
    const data = req.body;
    console.log("Esta es la data:",data);
    console.log("Este es el cuerpo",req.body);
    if(!data){
        res.json("Hubo un error en la solicitud")
    }

    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).json({ error: 'Error al conectar con la base de datos.' });
        }

        const nuevaNoticia = {
            Titulo: data.titulo,
            Contenido: data.contenido,
            Link: data.link,
            Nombre_imagen: req.file.filename,
            Imagen_directorio: req.file.path
        };

        conn.query('INSERT INTO Noticias SET ?', nuevaNoticia, (err, result) => {
            if (err) {
                console.error('Error al insertar la noticia:', err);
                return res.status(500).json({ error: 'Error al guardar la noticia.' });
            }

            res.redirect('/App/aas/Admin/api/v1');
        });        
    });
};

// Obtener todas las noticias
AdminController.obtenerNoticias = (req, res) => {
    
    req.getConnection((err, conn) => {
        if (err) {
            console.error('Error al obtener la conexión:', err);
            return res.status(500).json({ error: 'Error al conectar con la base de datos.' });
        }

        conn.query('SELECT * FROM Noticias', (err, rows) => {
            if (err) {
                console.error('Error al obtener las noticias:', err);
                return res.status(500).json({ error: 'Error al obtener las noticias.' });
            }

            res.status(200).json(rows);
        });
    });
};


module.exports = AdminController;