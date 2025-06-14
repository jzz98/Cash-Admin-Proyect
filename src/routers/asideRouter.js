const express = require('express');
const router = express.Router();
const connection = require('express-myconnection');

router.get('/facturacion-personal', (req, res) => {
    res.render('personalFact');
})


router.get('/ingresos/conduce', (req, res) => {
    res.render('conduce');
});

router.get('/ingresos/creditos', (req, res) => {
    res.render('creditos');
})

router.get('/compras/compras', (req, res) => {
    res.render('compras');
})

router.get('/compras/pagos-menores', (req, res) => {
    res.render('pagosMenores');
})
router.get('/compras/pagos-recurrentes', (req, res) => {
    res.render('pagosRec');
})
router.get('/compras/oredenes', (req, res) => {
    res.render('ordenes');
})

router.get('/docs', async(req, res) => {
    try {
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });

        const nombreUsuario = req.session.usuario.Nombre_usuario

        const user = await new Promise((resolve, reject) => {
            conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [nombreUsuario], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });


        console.log('Breakporint 2:', user)
        if (!user || user.length === 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const avatar = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre FROM Avatar WHERE Id_usuario=?', [user[0].ID], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        const perfil = avatar.length > 0 ? `/user-configs/user-avatar/${avatar[0].Nombre}` : null;

        const data = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre_usuario, Passwrd, Email FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });



        res.render('docs', {
            data: data,
            name: req.session.usuario.Nombre_usuario,
            avatar: perfil
        });
    } catch (error) {
        console.error("Error en personal.list:", error);
        res.status(500).send("Ocurrió un error al obtener los datos del perfil.");
    }
});

router.get('/reportes', (req, res) => {
    res.render('reportes');
});



router.get('/videos-educativos', (req, res) => {
    res.render('videosedu');
});
module.exports = router;