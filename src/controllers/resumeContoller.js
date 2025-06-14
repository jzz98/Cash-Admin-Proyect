const resumeController = {};
const connection = require('express-myconnection');
const path = require('path');
const fs = require('fs');
const {validate_token} = require('./auth/jwt');

resumeController.list = async(req, res) => {
    const token = await validate_token(req);

    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }    

    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return res.render('error')
            else resolve(conn);
        });
    });


    const id = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return res.render('error')
            else resolve(rows);
        });
    });

    req.getConnection((err, conn) => {
        conn.query('SELECT Fecha_ingreso, Monto FROM Ingresos WHERE ID_usuario = ?', [id[0].ID], (err, rows) => {
            if (err) {
                return res.render('error');
            }

            rows.forEach(row => {
                row.Fecha_ingreso = row.Fecha_ingreso.toISOString().split('T')[0];

            });
            
            rows.sort((a,b) => new Date(a.Fecha_ingreso) - new Date(b.Fecha_ingreso));
            console.log(rows)
            return res.json(rows);
        });
    });
};

module.exports = resumeController;
