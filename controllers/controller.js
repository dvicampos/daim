const db = require('../models/db');
const bcrypt = require('bcrypt');

exports.index = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        return res.redirect('/login');
    }

    const grupo_id = req.session.encargado.grupo_id; 

    db.query(
        `SELECT * FROM recordatorios WHERE grupo_id = ?`, 
        [grupo_id], 
        (err, recordatorios) => {
            if (err) {
                console.error('Error al obtener los recordatorios:', err);
                return res.status(500).send('Error al obtener los recordatorios.');
            }

            db.query(
                `SELECT encargados.nombre, encargados.apellido, grupos.nombre_empresa 
                FROM encargados 
                LEFT JOIN grupos ON encargados.grupo_id = grupos.id 
                WHERE encargados.id = ?`,
                [req.session.encargadoId],
                (err, results) => {
                    if (err) {
                        console.error('Error al obtener los datos del usuario:', err);
                        return res.status(500).send('Error al obtener los datos del usuario.');
                    }

                    if (results.length === 0) {
                        return res.redirect('/login');
                    }

                    const usuario = results[0];

                    res.render('index', { 
                        recordatorios, 
                        usuario 
                    });
                }
            );
        }
    );
};



// Registro de abogados
exports.register = (req, res) => {
    db.query('SELECT * FROM grupos', (err, grupos) => {
        if (err) {
            console.error(err);
            return res.render('register', { layout: false, grupos: [] });
        }
        res.render('register', { layout: false, grupos });
    });
};

// Ingreso de encargados
exports.login = (req, res) => {
    res.render('login', {layout: false});
};

exports.loginPost = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM encargados WHERE email = ?', [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.redirect('/login');
        }
        const encargado = results[0];
        const match = await bcrypt.compare(password, encargado.password);
        if (match) {
            req.session.encargadoId = encargado.id;
            req.session.encargado = {
                id: encargado.id,
                nombre: encargado.nombre,
                apellido: encargado.apellido,
                grupo_id: encargado.grupo_id,
            };
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });
};

exports.createGroup = (req, res) => {
    res.render('createGroup', { layout: false });
};

exports.createGroupPost = (req, res) => {
    const { nombre_empresa, rubro, descripcion, ubicacion } = req.body;

    db.query('INSERT INTO grupos (nombre_empresa, rubro, descripcion, ubicacion) VALUES (?, ?, ?, ?)',
        [nombre_empresa, rubro, descripcion, ubicacion],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/create-group');
            }
            res.redirect('/register');
        }
    );
};

exports.editGroup = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        return res.redirect('/login');
    }

    const grupo_id = req.session.encargado.grupo_id;

    db.query('SELECT * FROM grupos WHERE id = ?', [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener el grupo:', err);
            return res.status(500).send('Error al obtener el grupo.');
        }

        if (results.length === 0) {
            return res.status(404).send('Grupo no encontrado.');
        }

        res.render('editGroup', { grupo: results[0] });
    });
};

exports.updateGroup = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        return res.redirect('/login');
    }

    const grupo_id = req.session.encargado.grupo_id;
    const { nombre_empresa, rubro, descripcion, ubicacion } = req.body;

    db.query(
        'UPDATE grupos SET nombre_empresa = ?, rubro = ?, descripcion = ?, ubicacion = ? WHERE id = ?',
        [nombre_empresa, rubro, descripcion, ubicacion, grupo_id],
        (err) => {
            if (err) {
                console.error('Error al actualizar el grupo:', err);
                return res.status(500).send('Error al actualizar el grupo.');
            }
            res.redirect('/dashboard');
        }
    );
};


exports.registerPost = async (req, res) => {
    const { nombre, apellido, email, telefono, especialidad, password, grupo_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO encargados (nombre, apellido, email, telefono, especialidad, password, grupo_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, telefono, especialidad, hashedPassword, grupo_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/register');
            }

            const encargadoId = results.insertId;
            if (grupo_id) {
                db.query('INSERT INTO grupo_encargado (grupo_id, encargado_id) VALUES (?, ?)',
                    [grupo_id, encargadoId],
                    (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
            }
            res.redirect('/login');
        });
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
};

// CLIENTES 
exports.clientes = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const grupo_id = req.session.encargado.grupo_id;

    const sql = `
        SELECT clientes.*, grupos.nombre_empresa AS grupo_nombre
        FROM clientes
        LEFT JOIN grupos ON clientes.grupo_id = grupos.id
        WHERE clientes.grupo_id = ?
    `;

    db.query(sql, [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener clientes:', err);
            return res.status(500).send('Error al obtener clientes');
        }
        res.render('clientes', { clientes: results });
    });
};

exports.crearCliente = (req, res) => {
    res.render('crearCliente');
};

exports.crearClientePost = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const { nombre, apellido, email, telefono, direccion } = req.body;
    const grupo_id = req.session.encargado.grupo_id;

    db.query(
        'INSERT INTO clientes (nombre, apellido, email, telefono, direccion, grupo_id) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, telefono, direccion, grupo_id],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.redirect('/crearCliente');
            }

            res.redirect('/clientes');
        }
    );
};


exports.editarCliente = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editarCliente', { cliente: results[0] });
    });
};

exports.editarClientePost = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, direccion } = req.body;
    db.query('UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?',
        [nombre, apellido, email, telefono, direccion, id], (err) => {
            if (err) throw err;
            res.redirect('/clientes');
        });
};

exports.eliminarCliente = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM casos WHERE cliente_id = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar relaciones en casos:', err);
            return res.status(500).send('Error al eliminar relaciones del cliente');
        }
        db.query('DELETE FROM clientes WHERE id = ?', [id], (err) => {
            if (err) {
                console.error('Error al eliminar el cliente:', err);
                return res.status(500).send('Error al eliminar el cliente');
            }

            res.redirect('/clientes');
        });
    });
};




// encargados
exports.encargados = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.status(403).send('Acceso denegado');
    }

    const grupo_id = req.session.encargado.grupo_id;

    const query = `
        SELECT encargados.*, grupos.nombre_empresa AS grupo_nombre 
        FROM encargados 
        LEFT JOIN grupos ON encargados.grupo_id = grupos.id
        WHERE encargados.grupo_id = ?
    `;

    db.query(query, [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener encargados:', err);
            return res.status(500).send('Error al obtener encargados');
        }
        res.render('encargados', { encargados: results });
    });
};


exports.crearEncargado = (req, res) => {
    res.render('crearEncargado');
};

exports.crearEncargadoPost = async (req, res) => {
    const { nombre, apellido, email, telefono, especialidad, password } = req.body;
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const grupo_id = req.session.encargado.grupo_id;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO encargados (nombre, apellido, email, telefono, especialidad, password, grupo_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, email, telefono, especialidad, hashedPassword, grupo_id], (err) => {
            if (err) throw err;
            res.redirect('/encargados');
        });
};

exports.editarEncargado = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM encargados WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send('Error en la base de datos');
        if (results.length === 0) return res.status(404).send('Encargado no encontrado');
        res.render('editarEncargado', { encargado: results[0] });
    });
};

exports.editarEncargadoPost = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, especialidad, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const query = `
        UPDATE encargados 
        SET nombre = ?, apellido = ?, email = ?, telefono = ?, especialidad = ? 
        ${hashedPassword ? ', password = ?' : ''}
        WHERE id = ?
    `;

    const values = hashedPassword
        ? [nombre, apellido, email, telefono, especialidad, hashedPassword, id]
        : [nombre, apellido, email, telefono, especialidad, id];

    db.query(query, values, (err) => {
        if (err) throw err;
        res.redirect('/encargados');
    });
};

exports.eliminarEncargado = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM encargados WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/encargados');
    });
};


// CASOS 
exports.casos = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.status(403).send('Acceso denegado');
    }

    const grupo_id = req.session.encargado.grupo_id; 

    const query = `
        SELECT 
            casos.id AS caso_id, 
            clientes.nombre AS cliente_nombre, 
            encargados.nombre AS abogado_nombre, 
            grupos.nombre_empresa AS grupo_nombre, 
            GROUP_CONCAT(categorias.nombre SEPARATOR ', ') AS categorias_nombres, 
            casos.descripcion, 
            casos.estado,
            casos.precio,
            casos.fecha_entrega,
            casos.fecha_devolucion
        FROM 
            casos 
        JOIN 
            clientes ON casos.cliente_id = clientes.id 
        JOIN 
            encargados ON casos.abogado_id = encargados.id 
        LEFT JOIN 
            grupos ON casos.grupo_id = grupos.id 
        JOIN 
            caso_categorias ON casos.id = caso_categorias.caso_id 
        JOIN 
            categorias ON caso_categorias.categoria_id = categorias.id
        WHERE 
            casos.grupo_id = ?
        GROUP BY 
            casos.id, clientes.nombre, encargados.nombre, grupos.nombre_empresa, casos.descripcion, casos.estado, casos.precio, casos.fecha_entrega, casos.fecha_devolucion
    `;

    db.query(query, [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener los casos:', err);
            return res.status(500).send('Error al obtener los casos.');
        }
        res.render('casos', { casos: results });
    });
};


exports.casoIndividual = (req, res) => {
    const casoId = req.params.id; 

    const query = `
        SELECT 
            casos.id AS caso_id, 
            clientes.nombre AS cliente_nombre, 
            clientes.apellido AS cliente_apellido,
            encargados.nombre AS abogado_nombre, 
            encargados.apellido AS abogado_apellido, 
            GROUP_CONCAT(categorias.nombre SEPARATOR ', ') AS categorias_nombres, 
            GROUP_CONCAT(caso_categorias.cantidad SEPARATOR ', ') AS categorias_cantidades, 
            casos.descripcion, 
            casos.estado,
            casos.fecha_entrega, 
            casos.fecha_devolucion,
            casos.precio
        FROM 
            casos 
        JOIN 
            clientes ON casos.cliente_id = clientes.id 
        JOIN 
            encargados ON casos.abogado_id = encargados.id 
        JOIN 
            caso_categorias ON casos.id = caso_categorias.caso_id 
        JOIN 
            categorias ON caso_categorias.categoria_id = categorias.id
        WHERE 
            casos.id = ?
        GROUP BY 
            casos.id, clientes.nombre, clientes.apellido, encargados.nombre, encargados.apellido, casos.descripcion, casos.estado, casos.fecha_entrega, casos.fecha_devolucion, casos.precio
    `;

    db.query(query, [casoId], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.render('casoIndividual', { caso: results[0], layout: false });
        } else {
            res.status(404).send('Caso no encontrado');
        }
    });
};


exports.crearCasoPost = (req, res) => {
    const { cliente_id, abogado_id, descripcion, estado, categoria_id, categoria_cantidad, fecha_entrega, fecha_devolucion } = req.body;
    
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const grupo_id = req.session.encargado.grupo_id;

    const categoriasArray = Array.isArray(categoria_id) ? categoria_id : [categoria_id];
    const cantidadesArray = Array.isArray(categoria_cantidad) ? categoria_cantidad : [categoria_cantidad];

    console.log('Categorías seleccionadas:', categoriasArray);
    console.log('Cantidades seleccionadas:', cantidadesArray);

    db.query('SELECT id, precio FROM categorias WHERE id IN (?)', [categoriasArray], (err, resultados) => {
        if (err) {
            console.error('Error al obtener precios de categorías:', err);
            return res.status(500).send('Error al obtener precios de categorías.');
        }

        let precioTotal = 0;
        resultados.forEach((categoria, index) => {
            const cantidad = parseFloat(cantidadesArray[index]);
            precioTotal += categoria.precio * cantidad;
        });

        precioTotal = precioTotal.toFixed(2);
        console.log('Precio total calculado:', precioTotal);

        db.query('INSERT INTO casos (cliente_id, abogado_id, descripcion, estado, precio, fecha_entrega, fecha_devolucion, grupo_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [cliente_id, abogado_id, descripcion, estado, precioTotal, fecha_entrega, fecha_devolucion, grupo_id], (err, result) => {
                if (err) {
                    console.error('Error al insertar el caso:', err);
                    return res.status(500).send('Error al insertar el caso.');
                }

                console.log('Caso insertado con ID:', result.insertId);
                const casoId = result.insertId;

                const categoriaQueries = categoriasArray.map((categoriaId, index) => {
                    const cantidad = parseFloat(cantidadesArray[index]);
                    const grupo_id = req.session.encargado.grupo_id;
                    return new Promise((resolve, reject) => {
                        db.query('INSERT INTO caso_categorias (caso_id, categoria_id, cantidad, grupo_id) VALUES (?, ?, ?, ?)', [casoId, categoriaId, cantidad, grupo_id], (err) => {
                            if (err) {
                                console.error('Error al insertar en caso_categorias:', err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(categoriaQueries)
                    .then(() => {
                        console.log('Categorías del caso insertadas correctamente.');
                        res.redirect('/casos');
                    })
                    .catch(err => {
                        console.error('Error al insertar categorías del caso:', err);
                        res.status(500).send('Error al insertar categorías del caso.');
                    });
            });
    });
};

exports.crearCaso = (req, res) => {
    db.query('SELECT * FROM clientes', (err, clientes) => {
        if (err) throw err;
        db.query('SELECT * FROM encargados', (err, encargados) => {
            if (err) throw err;
            db.query('SELECT * FROM categorias', (err, categorias) => {
                if (err) throw err;
                res.render('crearCaso', { clientes, encargados, categorias });
            });
        });
    });
};

exports.editarCaso = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM casos WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        const caso = results[0];

        db.query('SELECT categoria_id, cantidad FROM caso_categorias WHERE caso_id = ?', [id], (err, casoCategorias) => {
            if (err) throw err;

            db.query('SELECT * FROM clientes', (err, clientes) => {
                if (err) throw err;

                db.query('SELECT * FROM encargados', (err, encargados) => {
                    if (err) throw err;

                    db.query('SELECT * FROM categorias', (err, categorias) => {
                        if (err) throw err;

                        res.render('editarCaso', { caso, casoCategorias, clientes, encargados, categorias });
                    });
                });
            });
        });
    });
};

exports.editarCasoPost = (req, res) => {
    const { id } = req.params;
    const { cliente_id, abogado_id, categoria_id, categoria_cantidad, descripcion, estado, precio, fecha_entrega, fecha_devolucion } = req.body;

    const categoriasArray = Array.isArray(categoria_id) ? categoria_id : [categoria_id];
    const cantidadesArray = Array.isArray(categoria_cantidad) ? categoria_cantidad : [categoria_cantidad];

    db.query('UPDATE casos SET cliente_id = ?, abogado_id = ?, descripcion = ?, estado = ?, precio = ?, fecha_entrega = ?, fecha_devolucion = ? WHERE id = ?',
        [cliente_id, abogado_id, descripcion, estado, precio, fecha_entrega, fecha_devolucion, id], (err) => {
            if (err) throw err;

            db.query('DELETE FROM caso_categorias WHERE caso_id = ?', [id], (err) => {
                if (err) throw err;

                const categoriaQueries = categoriasArray.map((categoriaId, index) => {
                    const cantidad = parseFloat(cantidadesArray[index]);
                    return new Promise((resolve, reject) => {
                        db.query('INSERT INTO caso_categorias (caso_id, categoria_id, cantidad) VALUES (?, ?, ?)', [id, categoriaId, cantidad], (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                });

                Promise.all(categoriaQueries)
                    .then(() => {
                        res.redirect('/casos');
                    })
                    .catch(err => {
                        throw err;
                    });
            });
        });
};



exports.eliminarCaso = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM caso_categorias WHERE caso_id = ?', [id], (err) => {
        if (err) throw err;

        db.query('DELETE FROM casos WHERE id = ?', [id], (err) => {
            if (err) throw err;
            res.redirect('/casos');
        });
    });
};


const pdf = require('html-pdf');
const QRCode = require('qrcode');

exports.generarPDF = (req, res) => {
    const { id } = req.params;

    db.query(`SELECT 
                casos.id, 
                clientes.nombre AS cliente_nombre,
                clientes.apellido AS cliente_apellido, 
                clientes.telefono AS cliente_telefono,
                encargados.nombre AS encargado_nombre, 
                encargados.apellido AS encargado_apellido,
                GROUP_CONCAT(categorias.nombre SEPARATOR ', ') AS categorias_nombres, 
                GROUP_CONCAT(caso_categorias.cantidad SEPARATOR ', ') AS categorias_cantidades,
                GROUP_CONCAT(categorias.precio SEPARATOR ', ') AS categorias_precios, 
                casos.descripcion, 
                casos.estado, 
                casos.precio,
                casos.fecha_creacion,
                casos.fecha_entrega, 
                casos.fecha_devolucion
              FROM casos 
              JOIN clientes ON casos.cliente_id = clientes.id 
              JOIN encargados ON casos.abogado_id = encargados.id 
              JOIN caso_categorias ON casos.id = caso_categorias.caso_id 
              JOIN categorias ON caso_categorias.categoria_id = categorias.id 
              WHERE casos.id = ? 
              GROUP BY casos.id, clientes.nombre, clientes.apellido, clientes.telefono, encargados.nombre, encargados.apellido, casos.descripcion, casos.estado, casos.precio, casos.fecha_creacion, casos.fecha_entrega, casos.fecha_devolucion`, 
              [id], (err, results) => {
        if (err) throw err;

        const caso = results[0];

        const casoUrl = `https://mexwebtechnological.com/casos/ver/${caso.id}`;

        QRCode.toDataURL(casoUrl, (err, qrCodeUrl) => {
            if (err) throw err;

            res.render('pdfCaso', { caso, qrCodeUrl, layout: false }, (err, html) => {
                if (err) return res.send(err);

                const options = {
                    format: 'A4',
                    orientation: 'portrait',
                    border: {
                        top: "10mm",
                        right: "10mm",
                        bottom: "10mm",
                        left: "10mm"
                    }
                };

                pdf.create(html, options).toBuffer((err, buffer) => {
                    if (err) return res.send(err);
                    res.set({
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': `attachment; filename=caso_${id}.pdf`,
                    });
                    res.send(buffer);
                });
            });
        });
    });
};


// CATEGORIAS 
exports.categorias = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.status(403).send('Acceso denegado');
    }

    const grupo_id = req.session.encargado.grupo_id; 

    const query = `
        SELECT categorias.*, grupos.nombre_empresa AS grupo_nombre 
        FROM categorias 
        LEFT JOIN grupos ON categorias.grupo_id = grupos.id
        WHERE categorias.grupo_id = ?
    `;

    db.query(query, [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener las categorías:', err);
            return res.status(500).send('Error al obtener las categorías.');
        }

        res.render('categorias', { categorias: results });
    });
};



exports.crearCategoria = (req, res) => {
    res.render('crearCategoria');
};

exports.crearCategoriaPost = (req, res) => {
    const { nombre, precio, descripcion, stock } = req.body;

    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const grupo_id = req.session.encargado.grupo_id;

    db.query('INSERT INTO categorias (nombre, precio, descripcion, stock, grupo_id) VALUES (?, ?, ?, ?, ?)',
        [nombre, precio, descripcion, stock, grupo_id], (err) => {
            if (err) {
                console.error('Error al insertar categoría:', err);
                return res.status(500).send('Error al insertar la categoría.');
            }
            res.redirect('/categorias');
        });
};

exports.editarCategoria = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM categorias WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editarCategoria', { categoria: results[0] });
    });
};

exports.editarCategoriaPost = (req, res) => {
    const { id } = req.params;
    const { nombre, precio, descripcion, stock } = req.body;
    db.query('UPDATE categorias SET nombre = ?, precio = ?, descripcion = ?, stock = ? WHERE id = ?',
        [nombre, precio, descripcion, stock, id], (err) => {
            if (err) throw err;
            res.redirect('/categorias');
        });
};

exports.eliminarCategoria = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM casos WHERE categoria_id = ?', [id], (err) => {
        if (err) {
            console.error('Error al eliminar relaciones en casos:', err);
            return res.status(500).send('Error al eliminar las relaciones en casos');
        }

        db.query('DELETE FROM caso_categorias WHERE categoria_id = ?', [id], (err) => {
            if (err) {
                console.error('Error al eliminar relaciones en caso_categorias:', err);
                return res.status(500).send('Error al eliminar las relaciones en caso_categorias');
            }

            db.query('DELETE FROM categorias WHERE id = ?', [id], (err) => {
                if (err) {
                    console.error('Error al eliminar la categoría:', err);
                    return res.status(500).send('Error al eliminar la categoría');
                }

                res.redirect('/categorias');
            });
        });
    });
};



//NOTAS
exports.crearNota = (req, res) => {
    const { titulo, contenido } = req.body;
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const grupo_id = req.session.encargado.grupo_id;
    db.query('INSERT INTO notas (titulo, contenido, grupo_id) VALUES (?, ?, ?)', [titulo, contenido, grupo_id], (err) => {
        if (err) throw err;
        res.redirect('/notas');
    });
};

exports.leerNotas = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.status(403).send('Acceso denegado');
    }

    const grupo_id = req.session.encargado.grupo_id; 

    const query = `
        SELECT notas.*, grupos.nombre_empresa AS grupo_nombre 
        FROM notas 
        LEFT JOIN grupos ON notas.grupo_id = grupos.id
        WHERE notas.grupo_id = ?
    `;

    db.query(query, [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener las notas:', err);
            return res.status(500).send('Error al obtener las notas.');
        }

        res.render('notas', { notas: results });
    });
};

// Obtener la nota para editar
exports.obtenerNotaParaEditar = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM notas WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editarNota', { nota: results[0] });
    });
};

// Actualizar una nota
exports.editarNota = (req, res) => {
    const { id } = req.params;
    const { titulo, contenido } = req.body;

    db.query('UPDATE notas SET titulo = ?, contenido = ? WHERE id = ?', [titulo, contenido, id], (err) => {
        if (err) throw err;
        res.redirect('/notas');
    });
};

exports.eliminarNota = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM notas WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/notas');
    });
};

//RECORDATORIOS
exports.crearRecordatorio = (req, res) => {
    const { titulo, contenido, fecha_inicio, fecha_fin } = req.body;
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.redirect('/crearCliente');
    }

    const grupo_id = req.session.encargado.grupo_id;
    db.query('INSERT INTO recordatorios (titulo, contenido, fecha_inicio, fecha_fin, grupo_id) VALUES (?, ?, ?, ?, ?)', 
        [titulo, contenido, fecha_inicio, fecha_fin, grupo_id], (err) => {
            if (err) throw err;
            res.redirect('/recordatorios');
        });
};

exports.leerRecordatorios = (req, res) => {
    if (!req.session.encargado || !req.session.encargado.grupo_id) {
        console.error('Error: No se encontró grupo_id en la sesión');
        return res.status(403).send('Acceso denegado');
    }

    const grupo_id = req.session.encargado.grupo_id;

    const query = `
        SELECT recordatorios.*, grupos.nombre_empresa AS grupo_nombre 
        FROM recordatorios 
        LEFT JOIN grupos ON recordatorios.grupo_id = grupos.id
        WHERE recordatorios.grupo_id = ?
    `;

    db.query(query, [grupo_id], (err, results) => {
        if (err) {
            console.error('Error al obtener los recordatorios:', err);
            return res.status(500).send('Error al obtener los recordatorios.');
        }

        const recordatorios = results.map(recordatorio => ({
            ...recordatorio,
            fecha_inicio: recordatorio.fecha_inicio.toISOString().split('T')[0],
            fecha_fin: recordatorio.fecha_fin.toISOString().split('T')[0]
        }));

        res.render('recordatorios', { recordatorios });
    });
};


exports.editarRecordatorio = (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, fecha_inicio, fecha_fin, completado } = req.body;

    db.query('UPDATE recordatorios SET titulo = ?, contenido = ?, fecha_inicio = ?, fecha_fin = ?, completado = ? WHERE id = ?', 
        [titulo, contenido, fecha_inicio, fecha_fin, completado === 'on', id], (err) => {
            if (err) throw err;
            res.redirect('/recordatorios');
        });
};
exports.obtenerRecordatorioParaEditar = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM recordatorios WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editarRecordatorio', { recordatorio: results[0] });
    });
};
exports.eliminarRecordatorio = (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM recordatorios WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/recordatorios');
    });
};
