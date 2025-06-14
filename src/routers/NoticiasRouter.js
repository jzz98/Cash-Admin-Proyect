const express = require('express');
const NoticiasRouter = express.Router();
const connection = require('express-myconnection');
// const bancosController = require('../controllers/bancosController');

NoticiasRouter.get('/', (req, res) =>{
    res.render('noticias');
});

NoticiasRouter.get('/api/v3/get', (req, res) =>{
    req.getConnection((err, conn) =>{
        if(err){
            return res.render('error');
        }

        conn.query('SELECT Link FROM Noticias', (err, rows) =>{
            if(err){
                return res.render('error');
            }

            res.json(rows);
        })
    })
})
module.exports = NoticiasRouter;