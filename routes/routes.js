const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const isAuthenticated = require('../middleware/auth');

// Rutas para la página principal
router.get('/', isAuthenticated, controller.index);

// Rutas de registro
router.get('/register', controller.register);
router.post('/register', controller.registerPost);

// Rutas de inicio de sesión
router.get('/login', controller.login);
router.post('/login', controller.loginPost);

// Ruta para cerrar sesión
router.get('/logout', controller.logout);

// Rutas para Clientes
router.get('/clientes', isAuthenticated, controller.clientes);
router.get('/clientes/crear', isAuthenticated, controller.crearCliente);
router.post('/clientes/crear', isAuthenticated, controller.crearClientePost);
router.get('/clientes/editar/:id', isAuthenticated, controller.editarCliente);
router.post('/clientes/editar/:id', isAuthenticated, controller.editarClientePost);
router.get('/clientes/eliminar/:id', isAuthenticated, controller.eliminarCliente);

// Rutas para Abogados
router.get('/encargados', isAuthenticated, controller.encargados);
router.get('/encargados/crear', isAuthenticated, controller.crearEncargado);
router.post('/encargados/crear', isAuthenticated, controller.crearEncargadoPost);
router.get('/encargados/editar/:id', isAuthenticated, controller.editarEncargado);
router.post('/encargados/editar/:id', isAuthenticated, controller.editarEncargadoPost);
router.get('/encargados/eliminar/:id', isAuthenticated, controller.eliminarEncargado);

// Rutas para Casos
router.get('/casos', isAuthenticated, controller.casos);
router.get('/casos/ver/:id', controller.casoIndividual);
router.get('/casos/crear', isAuthenticated, controller.crearCaso);
router.post('/casos/crear', isAuthenticated, controller.crearCasoPost);
router.get('/casos/editar/:id', isAuthenticated, controller.editarCaso);
router.post('/casos/editar/:id', isAuthenticated, controller.editarCasoPost);
router.get('/casos/eliminar/:id', isAuthenticated, controller.eliminarCaso);
router.get('/generar-pdf/:id', isAuthenticated, controller.generarPDF);

// Rutas para Categorías
router.get('/categorias', isAuthenticated, controller.categorias);
router.get('/categorias/crear', isAuthenticated, controller.crearCategoria);
router.post('/categorias/crear', isAuthenticated, controller.crearCategoriaPost);
router.get('/categorias/editar/:id', isAuthenticated, controller.editarCategoria);
router.post('/categorias/editar/:id', isAuthenticated, controller.editarCategoriaPost);
router.get('/categorias/eliminar/:id', isAuthenticated, controller.eliminarCategoria);

router.get('/notas',isAuthenticated, controller.leerNotas);
router.post('/crear-nota',isAuthenticated, controller.crearNota);
router.post('/editar-nota/:id',isAuthenticated, controller.editarNota);
router.get('/editar-nota/:id',isAuthenticated, controller.obtenerNotaParaEditar);
router.get('/eliminar-nota/:id',isAuthenticated, controller.eliminarNota);

router.get('/recordatorios',isAuthenticated, controller.leerRecordatorios);
router.post('/crear-recordatorio',isAuthenticated, controller.crearRecordatorio);
router.get('/editar-recordatorio/:id',isAuthenticated, controller.obtenerRecordatorioParaEditar);
router.post('/editar-recordatorio/:id',isAuthenticated, controller.editarRecordatorio);
router.get('/eliminar-recordatorio/:id',isAuthenticated, controller.eliminarRecordatorio);

module.exports = router;