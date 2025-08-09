const express = require('express');
const router = express.Router();

// Controladores
const comentarioCtrl = require('../controllers/comentarioController');
const consultasCtrl = require('../controllers/consultasController');

// ======================
// RUTAS POST
// ======================
// Crear comentario
router.post('/comentarios', comentarioCtrl.createComentario);

// ======================
// RUTAS GET
// ======================
router.get('/comentarios', comentarioCtrl.getComentarios);
router.get('/publicaciones', consultasCtrl.getPublicacionesConComentarios);
router.get('/autores-publicaciones', consultasCtrl.getAutoresYPublicaciones);
router.get('/comentarios/:ByID', consultasCtrl.getComentariosPorPublicacion);
router.get('/publicacion/comentarios', consultasCtrl.getPublicacionesConNumeroComentarios);
router.get('/publicacion-like/:ByID', consultasCtrl.getPublicacionComentariosLikes);
router.get('/consulta-categoria', consultasCtrl.getCategoriasPublicacionesComentarios);
router.get('/consulta-autores-categorias', consultasCtrl.getAutoresCategoriasPublicacionesLikes);



//---------------------
// Rutas PUT
//---------------------
// Editar comentario
router.put('/comentarios/:ByID', comentarioCtrl.editComentario);


// ======================
// RUTAS DELETE
// ======================
router.delete('/comentarios/:ByID', comentarioCtrl.deleteComentario);


module.exports = router;