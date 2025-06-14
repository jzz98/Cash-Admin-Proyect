const express = require('express');
const multer = require('multer');
const path = require('path');
const resumeRouter = express.Router();
const resumeController = require('../controllers/resumeContoller');

resumeRouter.get('/', (req, res) =>{
    res.render('resumeIngres');
});

resumeRouter.get('/api/chart/', resumeController.list);

module.exports = resumeRouter;