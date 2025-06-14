const express = require('express');
const connection = require('express-myconnection');
const facturasEmit = express.Router();

facturasEmit.get('/', async(req, res) =>{
    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return res.render('error')
            else resolve(conn);
        });
    });
        
    const user = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return res.render('error')
            else resolve(rows);
        });
    });
    req.getConnection((err, conn) => {
        if(err){
            return res.render('error')
        }

        conn.query('SELECT ID_factura, Almacen, Vendedor, Numero_factura, Fecha_Vencimiento FROM Facturas WHERE ID_usuario = ?', [user[0].ID], (err, rows) =>{
            if(err){
                return res.render('error')
            }

            return res.render('facturasemitidas', {
                data: rows
            });
        });
    });
});

facturasEmit.get('/descargar/:id', (req, res) => {
    const {id} = req.params;

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('SELECT * FROM Facturas WHERE ID_factura=?', [id], async(err, rows) =>{
            if(err){
                return res.render('error');
            }
            console.log(rows)
            res.download(rows[0].Factura_path, 'factura.pdf', (err) =>{
                if(err){
                    return res.render('error');
                }
            })

        });
    });
})


module.exports = facturasEmit;