const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mysql = require('mysql2');
const multer = require('multer');
const myconnection = require('express-myconnection');
const app = express();
const path = require('path');
const readDirs = require('./dir.config');
const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');
const {create_token, validate_token} = require('./controllers/auth/jwt');
const cookieParser = require('cookie-parser')

// environment
dotenv.config();

// Routes
const LocalRouter = require('./routers/registerRouter');
const asiderouter = require('./routers/asideRouter');
const factRouter = require('./routers/factRouter');
const ingresosRouter = require('./routers/ingresosRouter');
const resumeIngresos = require('./routers/resuIngRouter');
const portaldeclientes = require('./routers/portalRouter');
const inventario = require('./routers/inventarioRouter');
const reportes = require('./routers/reportesRouter');
const bancosRouter = require('./routers/bancosRouter');
const facturasEmitidas = require('./routers/facturasEmitRouter');
const personalRouter = require('./routers/personalRouter')
const NoticiasRouter = require('./routers/NoticiasRouter');
const AdminRoutes = require('./routers/AdminRouter');

// statics dirs   
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname)); 
app.use(express.static(path.join(__dirname, "CSS")));

// Middlewares 
app.use(morgan('dev'));
app.use(express.json()); // Necesario para manejar JSON
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

// Database conncetion
// app.use(myconnection(mysql, {
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE
// }, 'single'));

// user cookie  
app.use(session({
    secret: '8096169514',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true
    }
}));

// data controller
readDirs();

// routes /------------------------------/

app.use('/App/aas/Admin/api/v1', AdminRoutes);
app.use('/', LocalRouter);
app.use('/facturacion/facturacion-personal', personalRouter);
app.use('/facturacion/factura-nueva', factRouter);
app.use('/facturacion/ingresos/registrar-ingresos', ingresosRouter);
app.use('/facturacion/ingresos/resumen-ingresos', resumeIngresos);
app.use('/facturacion/portal-de-clientes', portaldeclientes);
app.use('/facturacion/inventario', inventario);
app.use('/facturacion/reportes', reportes);
app.use('/facturacion/bancos', bancosRouter);
app.use('/facturacion/facturas-emitidas', facturasEmitidas);
app.use('/facturacion/', asiderouter);
app.use('/facturacion/noticias', NoticiasRouter);

app.use((req, res) =>{
    res.redirect('/login')
})


app.listen(3000, ()=>{
    console.log('App running in port 3000');
});