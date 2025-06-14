const express = require('express');
const multer = require('multer');
const path = require('path');
const portalRouter = express.Router();
const portalController = require('../controllers/portalController');
const {Resend} = require('resend');
const resend = new Resend("re_T2SaVzTE_R5bJ1rqroGQoHMm3U4Vkqb6o");

portalRouter.get('/', portalController.list);
portalRouter.post('/agregar-cliente', portalController.save);
portalRouter.get('/delete/:id', portalController.delete);
portalRouter.get('/update/:id', portalController.edit);
portalRouter.post('/update/:id', portalController.update);
portalRouter.post('/posibles-clientes', portalController.recovery);
portalRouter.post('/api/data', portalController.sendEmail);

portalRouter.get('/api/email', async(req, res) => {
    const { data, error } = await resend.emails.send({
        from: "name <soporte@>",
        to: ["jostinezequiel09@gmail.com"],
        subject: "hello world",
        html: "<strong>it works!</strong>",
    });

    if (error) {
        return res.render('error');
    }

    res.status(200).json({ data });
})
module.exports = portalRouter;