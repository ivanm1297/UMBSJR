// Requiere el módulo 'express' para crear el enrutador.
const express = require('express');
const requireAuth = require('./middlewares/requireAuth');

// Crea un enrutador utilizando la función Router de Express.
const router = express.Router();

// Exporta una función que recibe un controlador 'mainController' como argumento.
module.exports = (mainController) => {

  // Define una ruta GET para la URL raíz '/' y le asigna la función 'getIndex' del controlador.
  router.get('/', mainController.getIndex);

  // Define una ruta POST para la URL '/admin' y le asigna la función 'postLogin' del controlador.
  router.post('/admin', mainController.postLogin);

  //Definir el esquema para recargar pagina
  router.get('/admin', requireAuth, mainController.getadmin);

  // Ruta para registrar un nuevo usuario
  router.post('/registro', mainController.postRegistro);

  router.post('/registroAlumno', mainController.postAlumno);

  router.post('/postUsuarioById', mainController.postUsuarioById);

  //Ruta para obtener los usuarios en formato JSON
  router.get('/getUsuarios', mainController.getUsuarios);
  
  //Rutas de municipios
  // router.get('/admin', mainController.getMunicipios);
  router.get('/localidades/:municipioId', requireAuth, mainController.getComunidadesByMunicipio);

  router.get('/CP/:LocalidadId', requireAuth, mainController.getCPByLocalidad);

  router.delete('/eliminar_admin/:id', mainController.postEliminar);

  router.post('/actualizarUsuario', mainController.postActualizar);

  //Cierre de sesion
  router.post('/logout', mainController.postlogout);
  
  // Retorna el enrutador configurado con las rutas y funciones asignadas.
  return router;
};
