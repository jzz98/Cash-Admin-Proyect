const factController = {};
const connection = require('express-myconnection');
const path = require('path');
const fs = require('fs');
const buildPDF = require('../libs/pdf');
const { data } = require('autoprefixer');
const {validate_token} = require('./auth/jwt');

factController.list = async (req, res) => {
    const token = await validate_token(req);

    if (!token) {
        return res.redirect('/login'); // Aquí decides cómo manejar el fallo
    }    
    try {
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) return reject(res.render('error'));
                else resolve(conn);
            });
        });

        const nombreUsuario = req.session.usuario.Nombre_usuario.trim();
        
        const user = await new Promise((resolve, reject) => {
            conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [nombreUsuario], (err, rows) => {
                if (err) return reject(res.render('error'));
                else resolve(rows);
            });
        });


        console.log('Breakporint 2:',user)
        if (!user || user.length === 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const avatar = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre FROM Avatar WHERE Id_usuario=?', [user[0].ID], (err, rows) => {
                if (err) return reject(res.render('error'));
                else resolve(rows);
            });
        });

        const perfil = avatar.length > 0 ? `/user-configs/user-avatar/${avatar[0].Nombre}` : null;

        const data = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre_usuario, Passwrd, Email FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
                if (err) return reject(res.render('error'));
                else resolve(rows);
            });
        });



            res.render('fact', {
                data: data,
                name: req.session.usuario.Nombre_usuario,
                avatar: perfil
            });
    } catch (error) {
        console.error("Error en personal.list:", error);
        return res.render('error');
    }
};

factController.crearFactura = async(req, res) => {
    const formData = req.body; // Datos del formulario
    const file = req.file; 

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
    
    formData.ID_usuario = user[0].ID;

    try {
        // Si no se sube un archivo, asignar "logo" como valor predeterminado
        formData.Logo = file ? `/uploads/${file.filename}` : 'logo';  

        if (file) {
            console.log('Archivo guardado en:', formData.Logo);
        } else {
            console.log('No se subió ningún archivo. Se usará el valor predeterminado "logo".');
        }

        req.getConnection((err, conn) => {
            if (err) {
                return res.render('error')
            }

            const facturaDir = path.join(__dirname, '..', 'facturas');

            const lista = [1,2,3,4,5,6,7,8,9];
            const indice = Math.floor(Math.random() * lista.length);

            const pdfPath = path.join(facturaDir, `factura${lista[indice]}.pdf`);
            formData.Factura_path = pdfPath;
            conn.query('INSERT INTO Facturas SET ?', [formData], (err, rows) => {
                if (err) {
                    return res.render('error');
                }

                if (!fs.existsSync(facturaDir)) {
                    fs.mkdirSync(facturaDir, { recursive: true });
                }
    
                // Crear y guardar el PDF
                buildPDF(formData, pdfPath, () => {
                    console.log(`Factura guardada en: ${pdfPath}`);

                    // Enviar el archivo para su descarga
                    res.download(pdfPath, `factura.pdf`, (err) => {
                        if (err) {
                            console.error('Error al descargar el archivo:', err);
                            return res.redirect('/facturacion/factura-nueva?error');
                        }
                    });
                });

            });
        });

    } catch (error) {
        return res.redirect('/facturacion/factura-nueva?error');
    }
};

factController.prodcutos = async(req, res) =>{
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
        if(err){
            return res.render('error')
        }

        conn.query('SELECT Producto FROM Inventario WHERE ID_usuario = ?', [user[0].ID], (err, rows) =>{
            if(err){
                return res.render('error')
            }

            return res.json(rows);
        })
    })
}

module.exports = factController;
