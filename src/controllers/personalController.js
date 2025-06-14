const personal = {};
const connection = require('express-myconnection');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const {create_token, validate_token} = require('../controllers/auth/jwt');
const { error } = require('console');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'user-configs', 'user-pre-avatar');

        // Verificar si la carpeta existe, si no, crearla
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Establecer la carpeta de destino para el archivo
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Establecer el nombre del archivo para evitar conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

personal.list = async (req, res) => {
    try {  
        const token = await validate_token(req);
        
        if (!token) {
            return res.redirect('/login'); // Aquí decides cómo manejar el fallo
        }

        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) return res.render('error')
                else resolve(conn);
            });
        });
        
        const user = await new Promise((resolve, reject) => {
            conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
                if (err) return res.render('error')
                else resolve(rows);
            });
        });

        const userAdmin = await new Promise((resolve, reject) => {
            conn.query(
                'SELECT Tipo_usr FROM Usuarios WHERE ID = ?',
                [user[0].ID],
                (err, rows) => {
                    if (err) return res.render('error')
                    else resolve(rows);
                }
            );
        });

        if (!user || user.length === 0) {
            return res.status(404).send("Usuario no encontrado.");
        }

        const avatar = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre FROM Avatar WHERE Id_usuario=?', [user[0].ID], (err, rows) => {
                if (err) return res.render('error')
                else resolve(rows);
            });
        });

        const perfil = avatar.length > 0 ? `/user-configs/user-avatar/${avatar[0].Nombre}` : null;

        const data = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre_usuario, Passwrd, Email FROM Usuarios WHERE ID=?', [user[0].ID], (err, rows) => {
                if (err) return res.render('error')
                else resolve(rows);
            });
        });

        const finance = await new Promise((resolve, reject) => {
            conn.query('SELECT Producto, Contacto FROM Ingresos WHERE ID_usuario = ?', [user[0].ID], (err, rows) => {
                if (err) return res.render('error')
                else resolve(rows);
            });
        });

        const list = finance.map(f => f.Producto);
        const list2 = finance.map(f => f.Contacto);

        // A partir de aquí solo se ejecuta si el token es válido
        if (userAdmin[0].Tipo_usr == 'A') {
            return res.redirect('/App/aas/Admin/api/v1/');
        } else {
            return res.render('personalFact', {
                data: data,
                finance: list.length,
                finance2: list2.length,
                avatar: perfil
            });
        }

       
    } catch (error) {
        console.error("Error en personal.list:", error);
        return res.render('error')
    }
};


personal.update = async (req, res) => {
    const data = req.body;

    // Eliminar campos vacíos para evitar sobrescribir con valores vacíos
    for (const key in data) {
        if (data[key] === '' || data[key] == null) {
            delete data[key];
        }
    }

    try {
        // Obtener conexión
        const connection = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) return reject(res.render('error'))
                else resolve(conn);
            });
        });

        // Obtener el ID del usuario desde la sesión
        const user = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT ID FROM Usuarios WHERE Nombre_usuario = ?',
                [req.session.usuario.Nombre_usuario],
                (err, rows) => {
                    if (err) return reject(res.render('error'))
                    else resolve(rows);
                }
            );
        });


        // Buscar archivo temporal en Pre_avatar
        const dirname = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT Archivo, Nombre FROM Pre_avatar WHERE Id_usuario = ?',
                [user[0].ID],
                (err, rows) => {
                    if (err) return reject(res.render('error'))
                    else resolve(rows);
                }
            );
        });

        // Si existe una imagen en Pre_avatar, moverla y actualizar Avatar
        if (dirname.length > 0) {
            const archivoOrigen = path.join(dirname[0].Archivo);
            const archivoDestino = path.join(
                __dirname,
                '..',
                'user-configs',
                'user-avatar',
                path.basename(dirname[0].Archivo)
            );

            if (fs.existsSync(archivoOrigen)) {
                fs.rename(archivoOrigen, archivoDestino, (err) => {
                    if (err) return res.render('error');
                });
            } else {
                console.warn("Archivo no existe, omitiendo fs.rename:", archivoOrigen);
                // Puedes seguir el flujo sin mover nada
            }


            console.log('Archivo destino', archivoDestino);

            // Verificar si ya existe un avatar para este usuario
            connection.query(
                'SELECT Id_usuario FROM Avatar WHERE Id_usuario = ?',
                [user[0].ID],
                (err, rows) => {
                    if (err) return res.json(err);

                    const avatarData = {
                        Id_usuario: user[0].ID,
                        Archivo: archivoDestino,
                        Nombre: dirname[0].Nombre
                    };

                    if (rows.length < 1) {
                        connection.query('INSERT INTO Avatar SET ?', avatarData, (err, rows) => {
                            if (err) return res.json(err)
                        });
                    } else {
                        connection.query(
                            'UPDATE Avatar SET ? WHERE Id_usuario = ?',
                            [avatarData, user[0].ID],
                            (err, rows) => {
                                if (err) return res.json(err)
                            }
                        );
                    }
                }
            );
        }

        // Si hay campos a actualizar (nombre, correo, contraseña, etc.)
        if (data && Object.keys(data).length > 0) {
            connection.query('UPDATE Usuarios SET ? WHERE ID = ?', [data, user[0].ID], (err, rows) => {
                if (err) {
                    return res.render('error')
                }
        
                // Si el nombre de usuario fue actualizado, actualiza la sesión
                if (data.Nombre_usuario) {
                    req.session.usuario.Nombre_usuario = data.Nombre_usuario.trim();
                    console.log('Nombre de usuario actualizado en la sesión:', req.session.usuario.Nombre_usuario);
                }
        
                setTimeout(() => {
                    res.redirect('/facturacion/facturacion-personal');
                }, 3000);
            });
        } else {
            // Si solo se actualizó la imagen
            return res.redirect('/facturacion/facturacion-personal');
        }
    } catch (error) {
        console.error('Error en la operación:', error);
        return res.render('error')
    }
};


personal.updatev1 = (req, res) => {
    guardarImagen(req, res);

}
personal.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render('error')
        }

        res.clearCookie('connect.sid');
        res.redirect('/')
    })
}

personal.delete = async (req, res) => {
    try {
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) return res.render('error')
                else resolve(conn);
            });
        });

        const data = await new Promise((resolve, reject) => {
            conn.query('SELECT Nombre_usuario,Email FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) => {
                if (err) {
                    return res.render('error')
                }
                resolve(rows);
            });
        });

        conn.query('INSERT INTO UsuariosEliminados SET ?', [{Nombre_usuario: data[0].Nombre_usuario, Correo: data[0].Email}], (err, rows) =>{
            if(err){
                return res.render('error')
            }

        });

        conn.query('DELETE FROM Usuarios WHERE Nombre_usuario=?', [req.session.usuario.Nombre_usuario], (err, rows) =>{
            if(err){
                return res.render('error')
            }
            res.redirect('/')
        });

    } catch (error) {
        return res.render('error')
    }

}

const upload = multer({ storage: storage });


async function guardarImagen(req, res){
    const conn = await new Promise((resolve, reject) =>{
        req.getConnection((err, conn) => {
            if(err){
                return res.render('error')
            }

            resolve(conn);
        });
    }); 
    
    const user = await new Promise((resolve, reject) =>{
        conn.query('SELECT ID FROM Usuarios WHERE Nombre_usuario = ?', [req.session.usuario.Nombre_usuario], (err, rows) =>{
            if(err){
                return res.render('error')
            }
            resolve(rows);
        });
    });

    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.render('error')
        }

        if (!req.file) {
            return res.render('error')
        }

        conn.query('SELECT * FROM Pre_avatar WHERE Id_usuario = ?', [user[0].ID], (err, rows) => {
            if(err) return res.render('error');


            if(rows < 1){
                conn.query('INSERT INTO Pre_avatar SET ?', [{Archivo:req.file.path, Id_usuario: user[0].ID, Nombre: req.file.filename}], (err, rows) =>{
                    if(err){
                        return res.render('error')
                    }
                    console.log(rows);
                });                
            }else{
                conn.query('UPDATE Pre_avatar SET ? WHERE Id_usuario = ?', [{Archivo: req.file.path, Nombre: req.file.filename}, user[0].ID], (err,rows) =>{
                    if(err){
                        return res.render('error')
                    }
                    console.log(rows);
                });
            }
        })

    });
}
module.exports = personal;