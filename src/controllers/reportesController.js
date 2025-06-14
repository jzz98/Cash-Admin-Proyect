const express = require('express');
const path = require('path');
const reportesController = {};
const connection = require('express-myconnection');
require('dotenv').config();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const buildPDF = require('../libs/reports');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
const { file } = require('pdfkit');
const { json } = require('stream/consumers');
const { connect } = require('http2');
const {validate_token} = require('./auth/jwt');

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
    apiKey: '##'
});

reportesController.start = async(req, res) =>{
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
        if(err) return res.render('error');

        conn.query('SELECT * FROM Reportes WHERE ID_usuario = ?', [user[0].ID], (err, rows) =>{

            return res.render('ventasgenerales', {
                data: rows
            });
        });
    });

}

reportesController.api = async(req, res) => {
    
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
            return res.render('error');
        }

        conn.query('SELECT Producto, Monto FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, rows) => {
            if (err) {
                return res.render('error');
            }

            return res.json(rows);
        });
    });
}


reportesController.api2 = async(req, res) => {

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
            return res.render('error');
        }

        conn.query('SELECT Contacto FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, rows) => {
            if (err) {
                return res.render('error');
            }
            return res.json(rows);
        });
    });
}

let file1 = [];
let pathFile = [];

reportesController.AI = async (req, res) => {
    const data = req.body.perido;

    let lista1 = [];
    let lista2 = [];
    let lista3 = [];
    let lista4 = [];
    let objList1 = [];
    let objList2 = [];

    try {
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, connection) => {
                if (err) return reject(res.render('error'));
                else resolve(connection);
            });
        });
        

        const user = await new Promise((resolve, reject) => {
            conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
                if (err) return reject(res.render('error'));
                else resolve(rows);
            });
        });


        const rows = await new Promise((resolve, reject) => {
            conn.query('SELECT Contacto FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, results) => {
                if (err) return reject(res.render('error'));
                else resolve(results);
            });
        });

        const rows2 = await new Promise((resolve, reject) =>{
            conn.query('SELECT Producto, Monto From Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, rows) =>{
                if (err) return reject(res.render('error'));
                else resolve(rows);
            })
        });
        
        const fechas = await new Promise((resolve, reject) =>{
            conn.query('SELECT Fecha_ingreso FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, rows) =>{
                if (err) return reject(res.render('error'));
                else resolve(rows);
            });
        });
        objList1 = rows.map(element => {return element});
        objList2 = rows2.map(element => {return element});

        for(let i = 0;  i < objList1.length; i++){
            lista1.push(objList1[i].Contacto);
        }

        for(let i = 0;  i < objList2.length; i++){
            lista2.push(objList2[i].Producto);
        }
                
        for(let i = 0;  i < objList2.length; i++){
            lista3.push(objList2[i].Monto);
        }

        for(let i = 0;  i < lista4.length; i++){
            lista3.push(fechas[i].Fecha_ingreso);
        }
        const today = new Date();
        const dayOfWeek = today.getDay();

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1); 

        const prompt = `Genera un reporte personalizado considerando los siguientes requerimientos:

        - Los contactos representan a los CLIENTES que han comprado y pueden repetirse varias veces.
        - En el segundo valor se indican los productos y sus respectivos precios.
        - El reporte debe incluir ideas de negocio y estrategias de marketing bien desarrolladas.
        - La presentación de los datos debe ser clara y agradable para el usuario.
        - Los montos siempre deben mostrarse con el signo "$" y en un formato adecuado.
        - Usa un lenguaje formal pero comprensible para un usuario común.
        - No uses asteriscos en el documento para mantener un formato limpio.
        - Al finalizar el reporte, presenta las conclusiones sin solicitar información adicional al usuario.

        **Filtros por periodo:**  
        Si el usuario especifica un periodo, filtra y organiza los datos según la selección.  
        - Ejemplo: Si el usuario solicita un informe mensual, organiza los reportes por meses del año.  
        - Si se pide un reporte total o no se define un periodo, genera el informe de manera estándar.
        - Las fechas estan ordenas de manera que por ejemplo el monto uno corresponde a la fecha uno, asi sucesivamente.

        **Datos proporcionados:**  
        Clientes: ${lista1}  
        Productos: ${lista2}  
        Montos: ${lista3}
        Fechas de compra: ${lista4}
        Periodo: ${data}`;



        const response = await generateResponse(prompt);
        
        const charts = await new Promise((resolve, reject) =>{
            conn.query('SELECT * FROM Graficos ORDER BY ID DESC LIMIT 2', (err, rows) =>{
                if (err) return reject(res.render('error'));
                else resolve(rows);
            })
        });
        let listChar = []
        charts.forEach(element => {
            listChar.push(element.Path_img);
        });
        let obj = {
            row1: objList1,
            row2: objList2,
            response: response,
            char1: listChar[0],
            char2: listChar[1]
        };
        console.log("el objeto -----------------", obj)
        obj.response = obj.response.replace(/\*/g, '');
        guardarReporte(req, res);
        crearReporte(obj);

        return res.redirect('/facturacion/reportes/ventas-generales');
    } catch (error) {
        return res.render('error');
    }
};


reportesController.getGraphics = async (req, res) =>{
    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, connection) => {
            if (err) return reject(res.render('error'));
            else resolve(connection);
        });
    });
    
    const user = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return reject(res.render('error'));
            else resolve(rows);
        });
    });

    if(!req.file) {
        return res.render('error');
    }


    req.getConnection((err, conn) =>{
        if(err) return res.render('error');


        conn.query('INSERT INTO Graficos SET ?', [{Path_img: req.file.path, ID_usuario: user[0].ID}], (err, rows) =>{
            if(err) return res.render('error');

        });
    });
    // console.log('Archivo guardado en: ', filePath)
}

reportesController.delete = (req, res) =>{
    const {id} = req.params;

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('DELETE FROM Reportes WHERE ID=?', [id], (err, rows) =>{
            if(err){
                return res.render('error');
            }

            return res.redirect('/facturacion/reportes/ventas-generales');
        });
    });
}

reportesController.descargar = (req, res) =>{
    const {id} = req.params;

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('SELECT * FROM Reportes WHERE ID=?', [id], (err, rows) =>{
            if(err){
                return res.render('error');
            }
            return res.download(rows[0].Path_reporte, rows[0].Nombre, (err) =>{
                if(err){
                    return res.render('error');
                }
            })
        });
    });
}


async function generateResponse(prompt) {
    try {
        const response = await model.invoke(prompt)
        return response.content;
    } catch (error) {
        console.error(error);
        return res.render('error');
    }
}

function crearReporte(obj) {
    try {
        const reportsDir = path.join(__dirname, '..', 'reports'); // Directorio de reportes
        const unique = uuidv4();
        const reportsPath = path.join(reportsDir, `reporte_${unique}.pdf`);

        // Verificar si la ruta de 'reports' es válida
        if (!reportsDir || typeof reportsDir !== 'string') {
            throw new Error('La ruta del directorio de reportes no es válida');
        }

        // Verificar si 'reportsPath' es válida
        if (!reportsPath || typeof reportsPath !== 'string') {
            throw new Error('La ruta del reporte no es válida');
        }

        // Crear el directorio si no existe
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Verifica la existencia de reportsPath antes de llamar a buildPDF
        console.log('Ruta del reporte:', reportsPath);  // Imprimir ruta para depuración

        buildPDF(obj, reportsPath, () => {
            console.log('err')
        });
    } catch (error) {
        return res.render('error');
    }
}



async function guardarReporte(req, res){
    const dir = path.join(__dirname, '..' , 'reports');
    const files = await fs.promises.readdir(dir);

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

    let filesWithStats = await Promise.all(
        files.map(async (file) => {
            const filePath = path.join(dir, file);
            const stats = await fs.promises.stat(filePath);
            return { file, time: stats.mtime, path: filePath };
        })
    );
    filesWithStats.sort((a, b) => b.time - a.time);
    const latestFiles = filesWithStats.slice(0, 1);

    const nuevoReporte = {
        Path_reporte: latestFiles[0].path,
        Nombre: latestFiles[0].file,
        ID_usuario: user[0].ID
    };

    req.getConnection((err, conn) =>{
        conn.query('INSERT INTO Reportes SET ?', [nuevoReporte], (err, rows) =>{
            if(err) return res.render('error');
        });
    });
}

// Reportes mensuales
module.exports = reportesController;