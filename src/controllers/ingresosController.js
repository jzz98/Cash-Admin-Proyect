const ingresosController = {};
const connection = require('express-myconnection');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { json } = require('stream/consumers');
const { resolveSoa } = require('dns');
const {validate_token} = require('./auth/jwt');

const API_USERNAME = '##';
const API_PASSWORD = '##';

const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');

// Api request - connection
async function apiConnection(req, res){
    try {
        const response = await fetch('https://api.test.paysafe.com/paymenthub/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`, // Encabezado de autenticación
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "paymentHandleToken": "SCAS9p8LU6yKgMvc",
                "merchantRefNum": "312730qjqeqw",
                "amount": 500,  // Asegúrate de que este monto coincida con el original
                "currencyCode": "USD"
            })
        });

        const result = await response.json();
    } catch (error) {
        console.error('Error:', error);
        return res.render('error')
    }
}


async function apiRequest(req, res, monto) {
    const idnum = () => Date.now().toString() + Math.floor(Math.random() * 1000).toString();

    const url = 'https://api.test.paysafe.com/paymenthub/v1/paymenthandles';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Basic ${credentials}`
        },
        body: JSON.stringify({
            merchantRefNum: idnum(),
            transactionType: "PAYMENT",
            accountId: "1002909200",
            paymentType: "CARD",
            amount: monto,
            currencyCode: "USD",
            threeDs: {
                merchantUrl: "http://localhost:3000/facturacion/ingresos/registrar-ingresos",
                deviceChannel: "BROWSER",
                messageCategory: "PAYMENT",
                transactionIntent: "CHECK_ACCEPTANCE",
                authenticationPurpose: "PAYMENT_TRANSACTION",
                requestorChallengePreference: "NO_PREFERENCE"
            },
            card: {
                cardNum: "4000000000001026",
                cardExpiry: { month: 10, year: 2025 },
                cvv: "111",
                holderName: "Dilip",
                issuingCountry: "US"
            },
            billingDetails: {
                nickName: "Home",
                street: "123 Main St",
                city: "New York",
                state: "NY",
                country: "US",
                zip: "10001"
            },
            returnLinks: [
                { rel: "default", href: "https://yourwebsite.com/payment/return/", method: "GET" },
                { rel: "on_completed", href: "https://yourwebsite.com/payment/return/success", method: "GET" },
                { rel: "on_failed", href: "https://yourwebsite.com/payment/return/failed", method: "GET" }
            ]
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error?.message || "Error en la API de Paysafe");
        }
    } catch (error) {
        console.error("Error:", error);
        return res.render('error')
    }
}

ingresosController.account = async (req, res) => {
    try {
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) return res.render('error')
                else resolve(conn);
            });
        });

        if (!req.session.usuario) {
            return res.status(401).json({ mensaje: "Sesión no encontrada o expirada" });
        }

        const id = await new Promise((resolve, reject) => {
            conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
                if (err) return res.render('error')
                else resolve(rows.length > 0 ? rows[0] : null);
            });
        });

        if (!id) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const cuentaData = await new Promise((resolve, reject) => {
            conn.query('SELECT * FROM Cuenta WHERE ID_usuario=?', [id.ID], (err, rows) => {
                if (err)    return res.render('error')
                else resolve(rows.length > 0 ? rows[0] : null);
            });
        });

        if (!cuentaData) {
            return res.json({ usuario: "Cuenta no encontrada" });
        }


        return res.json(cuentaData);
    } catch (error) {
        console.error("Error en account:", error);
        return res.render('error')
    }
};




ingresosController.list = async(req, res) =>{
    const token = await validate_token(req);

    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }    
    apiConnection(req, res);

    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return res.render('error')
            else resolve(conn);
        });
    });


    const id = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return res.render('error')
            else resolve(rows.length > 0 ? rows[0] : null);
        });
    });
    console.log(id)
    req.getConnection((err, conn) =>{ 
        conn.query('SELECT * FROM Ingresos WHERE ID_usuario = ?', [id.ID], (err, rows) =>{
            if(err){
                return res.render('error');
            }
            
            return res.render('ingresos', {
                data: rows
            });
        });
    });
}

ingresosController.save = async(req, res) =>{
    const data = req.body;

    const connection = await new Promise((resolve, reject) => {
        req.getConnection((err, conn) => {
            if (err) return res.render('error')
            else resolve(conn);
        });
    });


    const id = await new Promise((resolve, reject) => {
        connection.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
            if (err) return res.render('error')
            else resolve(rows.length > 0 ? rows[0] : null);
        });
    });

    apiRequest(req, res, parseInt(data.Monto));
    
    data.ID_usuario = id.ID
    if(Object.values(data).every(value => value === "")){
        return res.redirect('/facturacion/ingresos/registrar-ingresos');
    }

    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('INSERT INTO Ingresos SET ?', [data], (err, rows) =>{
            if(err){
                return res.redirect('/facturacion/ingresos/registrar-ingresos?error');
            }   

            return res.redirect('/facturacion/ingresos/registrar-ingresos');
        });
    });
}

ingresosController.delete = (req, res) =>{
    const {id} = req.params;
    console.log(id);
    
    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('DELETE FROM Ingresos WHERE ID_ingreso=?', [id], (err, rows) =>{
            if(err){
                return res.json(err);
            }
            res.redirect('/facturacion/ingresos/registrar-ingresos');
        });
    });
}

ingresosController.edit = (req, res) =>{
    const {id} = req.params;
    
    req.getConnection((err, conn) =>{
        conn.query('SELECT * FROM Ingresos WHERE ID_ingreso=?', [id], (err, rows) =>{
            if(err){
                return res.render('error')
            }
            
            return res.render('ingresos_edit', {
                data: rows
            });
        });
    });
}

ingresosController.update = (req, res) => {
    const {id} = req.params;
    const newIngresos = req.body;

    req.getConnection((err, conn) =>{
        conn.query('UPDATE Ingresos set ? WHERE ID_ingreso = ?', [newIngresos, id], (err, rows) =>{
            if(err){
                return res.redirect('/facturacion/ingresos/registrar-ingresos?error');
            }

            res.redirect('/facturacion/ingresos/registrar-ingresos');
        }); 
    });
}


module.exports = ingresosController;
