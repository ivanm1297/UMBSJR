// Requiere el módulo '../models/models' y lo asigna a la variable mainModel
const mainModel = require('../models/adminModel');
const Municipio = require('../models/municipioModel');
const Localidad = require('../models/localidadModel');
const Alumno = require('../models/alumnoModel');
const cps = require('../models/CPModel');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// Exporta una función que recibe un objeto 'db' como argumento
module.exports = function (db) {

  // Dentro de la función exportada, se define un objeto con dos métodos: getIndex y postLogin.
  return {

    // getIndex es una función asíncrona que maneja una solicitud GET en la ruta raíz '/'.
    getIndex: async (req, res) => {
      try {
        // Renderiza una vista llamada 'index'
        res.render('index');
      } catch (err) {
        // Si ocurre un error, responde con un estado 500 y un mensaje de error.
        res.status(500).send('Error al obtener el index');
      }
    },

    getadmin: async (req, res) => {
      try {
        const municipios = await Municipio.find();
        res.render('dashboard', { user: req.session.user, municipios });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los municipios');
      }
    },

    // postLogin es una función asíncrona que maneja una solicitud POST para iniciar sesión.
    postLogin: async (req, res) => {
      try {
        // Obtiene las propiedades 'username' y 'pass' del cuerpo de la solicitud (req.body)
        const { username, pass } = req.body;

        // Obtiene una colección de usuarios del objeto 'db', que se supone que es una base de datos MongoDB
        const usuariosCollection = db.collection('usuarios');

        // Utiliza await para esperar a que se complete la consulta para encontrar un usuario en la colección
        const user = await usuariosCollection.findOne({ "Correo": username });

        // Comprueba si se encontró un usuario
        if (user) {
          // Si se encontró un usuario, compara la contraseña enviada con la contraseña almacenada en el usuario
          if (pass === user.Password) {
            try {
              const municipios = await Municipio.find();
              req.session.user = user;
              return res.render('dashboard', { user: req.session.user, municipios });

            } catch (err) {
              console.error(err);
              res.status(500).send('Error al obtener los municipios');
            }
            // Si las contraseñas coinciden, establece el objeto 'user' en la sesión y renderiza la vista 'dashboard'

          } else {
            // Si las contraseñas no coinciden, muestra un mensaje de error en la vista 'index'
            return res.render('index', { error: 'Contraseña incorrecta. Inténtalo de nuevo.' });
          }
        } else {
          // Si no se encontró un usuario, muestra un mensaje de error en la vista 'index'
          return res.render('index', { error: 'Usuario no encontrado. Inténtalo de nuevo.' });
        }
      } catch (err) {
        // Si ocurre un error en el proceso, muestra un mensaje de error en la consola y responde con un estado 500.
        console.error('Error al buscar el usuario:', err);
        res.status(500).send('Error al acceder al login');
      }
    },

    getComunidadesByMunicipio: async (req, res) => {
      try {
        const municipioId = req.params.municipioId;
        const localidades = await cps.find({ MUNICIPIO: municipioId });
        res.json(localidades);
      } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las localidades');
      }
    },

    getCPByLocalidad: async (req, res) => {
      try {
        const LocalidadId = req.params.LocalidadId;

        const cpData = await cps.findOne({ LOCALIDAD: LocalidadId }, { CP: 1 });

        if (cpData && cpData.CP) {
          res.json({ CP: cpData.CP });
        } else {
          res.status(404).json({ error: 'Codigo postal no encontrado' });
        }
      } catch (err) {
        res.status(500).send('Error al obtener el CP');
      }
    },

    postlogout: (req, res) => {
      //DEstruye la sesion del usuario
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar sesion:', err);
        }
        // Redirige a la ppagina de inicio de sesion despues de cerrar sesion
        res.redirect('/');
      });
    },
    //Para obtener los usuarios mediante AJAX
    getUsuarios: async (req, res) => {
      try {
        //Realiza la consulta a la base de datos para obtener los usuarios
        const usuarios = await mainModel.find();

        //Lee el contenido del archivo admin-reg.ejs
        const adminRegPath = path.join(__dirname, '../views/admin-reg.ejs');
        const adminRegContent = fs.readFileSync(adminRegPath, 'utf8');

        //Responde con el contenido renderizado en formato HTML
        const renderedContent = ejs.render(adminRegContent, { usuarios });

        res.send(renderedContent);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
      }
    },
    postRegistro: async (req, res) => {
      try {
        const { nombre_admin, ap_admin, am_admin, Fecha_Nacimiento_admin, correo_admin, pwd_admin, telefono_admin, privilegios, CURP_admin, municipios_admin, cp_admin, localidad_admin, colonia_admin, calle_admin, NI_admin, NE_admin } = req.body;
        // Verificar si el número de teléfono ya está registrado en la base de datos
        const usuarioExistenteTelefono = await mainModel.findOne({ Telefono: telefono_admin });
        if (usuarioExistenteTelefono) {
          return res.status(400).json({ error: 'El número de teléfono ya está registrado.' });
        }

        const usuarioExistenteCorreo = await mainModel.findOne({ Correo: correo_admin });
        if (usuarioExistenteCorreo) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        const usuarioExistenteCURP = await mainModel.findOne({ CURP: CURP_admin });
        if (usuarioExistenteCURP) {
          return res.status(400).json({ error: 'El CURP ya está registrado.' });
        }
        // Obtener el archivo de la solicitud (en este caso, 'foto' es el nombre del campo en el formulario)
        const fotoFile = req.files && req.files.foto_admin ? req.files.foto_admin : null;

        // Verificar si se envió una foto
        if (!fotoFile) {
          return res.render('dashboard', { error: 'Debe seleccionar una foto.' });
        }

        // Obtener la extensión del archivo (por ejemplo, 'jpg' o 'jpeg')
        const extension = fotoFile.name.split('.').pop().toLowerCase();
        // Guardar la foto en la carpeta 'usuarios' dentro de la carpeta 'public'
        const fotoName = `${nombre_admin}${ap_admin}${am_admin}_${Date.now()}.${extension}`;
        const fotoPath = path.join(__dirname, '../public/usuarios', fotoName);
        fotoFile.mv(fotoPath, (err) => {
          if (err) {
            console.error('Error al guardar la foto:', err);
            return res.render('dashboard', { error: 'Error al guardar la foto.' });
          }
        });
        const nuevoUsuario = new mainModel({
          Nombre_usuario: nombre_admin,
          Apellido_Paterno: ap_admin,
          Apellido_Materno: am_admin,
          Fecha_Nacimiento: new Date(Fecha_Nacimiento_admin),
          Correo: correo_admin,
          Password: pwd_admin,
          Telefono: telefono_admin,
          Privilegios: privilegios,
          Foto: fotoFile ? fotoName : '', // Guarda el nombre de la imagen subida si existe
          CURP: CURP_admin,
          Direccion: {
            Municipio: municipios_admin,
            CP: cp_admin,
            Localidad: localidad_admin,
            Colonia: colonia_admin,
            Calle: calle_admin,
            NI: NI_admin,
            NE: NE_admin,
          },
        });

        // Guardar el usuario en la base de datos
        await nuevoUsuario.save();

        res.json({ message: 'Usuario registrado exitosamente' });
      } catch (err) {
        res.status(500).json({ error: 'Error al registrar el usuario. Inténtalo de nuevo.' });
      }
    },

    postEliminar: async (req, res) => {
      try {
        const userId = req.params.id; // Obtener el ID del usuario a eliminar desde los parámetros de la URL

        // Realizar la eliminación del usuario en la base de datos
        const result = await mainModel.deleteOne({ _id: userId });

        if (result.deletedCount === 1) {
          // Si se eliminó un registro correctamente, envía una respuesta de éxito
          res.json({ message: 'Usuario eliminado correctamente' });
        } else {
          // Si no se pudo eliminar un registro, envía una respuesta de error
          res.status(404).json({ error: 'Usuario no encontrado. No se pudo eliminar.' });
        }
      } catch (err) {
        console.error('Error al eliminar el usuario:', err);
        res.status(500).json({ error: 'Error al eliminar el usuario. Inténtalo de nuevo.' });
      }
    },

    postUsuarioById: async (req, res) => {
      const userId = req.body.userId;

      try {
        const usuario = await mainModel.findById(userId);

        if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(usuario);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error en el servidor' });
      }
    },

    postAlumno: async (req, res) => {
      try {
        const { nombre_alumno, ap_alumno, am_alumno, Fecha_Nacimiento_alumno, correo_alumno, pwd_alumno, telefono_alumno, privilegios, CURP_alumno, municipios_alumno, cp_alumno, localidad_alumno, colonia_alumno, calle_alumno, NI_alumno, NE_alumno, curp_alumno, acta_alumno, solicitud_alumno, historial_alumno } = req.body;
        // Verificar si el número de teléfono ya está registrado en la base de datos
        const usuarioExistenteTelefono = await Alumno.findOne({ Telefono: telefono_alumno });
        if (usuarioExistenteTelefono) {
          return res.status(400).json({ error: 'El número de teléfono ya está registrado.' });
        }

        const usuarioExistenteCorreo = await Alumno.findOne({ Correo: correo_alumno });
        if (usuarioExistenteCorreo) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        const usuarioExistenteCURP = await Alumno.findOne({ CURP: CURP_alumno });
        if (usuarioExistenteCURP) {
          return res.status(400).json({ error: 'El CURP ya está registrado.' });
        }
        // Obtener el archivo de la solicitud (en este caso, 'foto' es el nombre del campo en el formulario)
        const fotoFile = req.files && req.files.foto_alumno ? req.files.foto_alumno : null;

        // Verificar si se envió una foto
        if (!fotoFile) {
          return res.render('dashboard', { error: 'Debe seleccionar una foto.' });
        }

        // Obtener la extensión del archivo (por ejemplo, 'jpg' o 'jpeg')
        const extension = fotoFile.name.split('.').pop().toLowerCase();
        // Guardar la foto en la carpeta 'usuarios' dentro de la carpeta 'public'
        const fotoName = `${nombre_alumno}${ap_alumno}${am_alumno}_${Date.now()}.${extension}`;
        const fotoPath = path.join(__dirname, '../public/usuarios', fotoName);
        fotoFile.mv(fotoPath, (err) => {
          if (err) {
            console.error('Error al guardar la foto:', err);
            return res.render('dashboard', { error: 'Error al guardar la foto.' });
          }
        });

        const curpFile = req.files && req.files.curp_alumno ? req.files.curp_alumno : null;

        // Verificar si se envió una foto
        if (!curpFile) {
          return res.render('dashboard', { error: 'Debe seleccionar un archivo.' });
        }

        // Obtener la extensión del archivo (por ejemplo, 'jpg' o 'jpeg')
        const extension_curp = curpFile.name.split('.').pop().toLowerCase();
        // Guardar la foto en la carpeta 'usuarios' dentro de la carpeta 'public'
        const curpName = `${nombre_alumno}${ap_alumno}${am_alumno}_${Date.now()}.${extension_curp}`;
        const curpPath = path.join(__dirname, '../public/curp', curpName);
        curpFile.mv(curpPath, (err) => {
          if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.render('dashboard', { error: 'Error al guardar el archivo.' });
          }
        });

        const actaFile = req.files && req.files.acta_alumno ? req.files.acta_alumno : null;

        // Verificar si se envió una foto
        if (!actaFile) {
          return res.render('dashboard', { error: 'Debe seleccionar un archivo.' });
        }

        // Obtener la extensión del archivo (por ejemplo, 'jpg' o 'jpeg')
        const extension_acta = actaFile.name.split('.').pop().toLowerCase();
        // Guardar la foto en la carpeta 'usuarios' dentro de la carpeta 'public'
        const actaName = `${nombre_alumno}${ap_alumno}${am_alumno}_${Date.now()}.${extension_acta}`;
        const actaPath = path.join(__dirname, '../public/acta_nacimiento', actaName);
        actaFile.mv(actaPath, (err) => {
          if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.render('dashboard', { error: 'Error al guardar el archivo.' });
          }
        });

        const solicitudFile = req.files && req.files.solicitud_alumno ? req.files.solicitud_alumno : null;

        // Verificar si se envió una foto
        if (!solicitudFile) {
          return res.render('dashboard', { error: 'Debe seleccionar un archivo.' });
        }

        // Obtener la extensión del archivo (por ejemplo, 'jpg' o 'jpeg')
        const extension_solicitud = solicitudFile.name.split('.').pop().toLowerCase();
        // Guardar la foto en la carpeta 'usuarios' dentro de la carpeta 'public'
        const solicitudName = `${nombre_alumno}${ap_alumno}${am_alumno}_${Date.now()}.${extension_solicitud}`;
        const solicitudPath = path.join(__dirname, '../public/solicitud', solicitudName);
        solicitudFile.mv(solicitudPath, (err) => {
          if (err) {
            console.error('Error al guardar el archivo:', err);
            return res.render('dashboard', { error: 'Error al guardar el archivo.' });
          }
        });

        const historialFile = req.files && req.files.historial_alumno ? req.files.historial_alumno : null;

        if (!historialFile) {
          return res.render('dashboard', { error: 'Debe seleccionar un archivo.' });
        }

        const extension_historial = historialFile.name.split('.').pop().toLowerCase();

        const historialName = `${nombre_alumno}${ap_alumno}${am_alumno}_${Date.now()}.${extension_historial}`;
        const historialPath = path.join(__dirname, '../public/historial', historialName);
        historialFile.mv(historialPath, (err) => {
          if (err) {
            console.error('Error al guardar el historial academico:', err);
            return res.render('dashboard', { error: 'Error al guardar el historial academico.' });
          }
        });

        const nuevoAlumno = new Alumno({
          Nombre_usuario: nombre_alumno,
          Apellido_Paterno: ap_alumno,
          Apellido_Materno: am_alumno,
          Fecha_Nacimiento: new Date(Fecha_Nacimiento_alumno),
          Correo: correo_alumno,
          Password: pwd_alumno,
          Telefono: telefono_alumno,
          Privilegios: privilegios,
          Foto: fotoFile ? fotoName : '', // Guarda el nombre de la imagen subida si existe
          CURP: CURP_alumno,
          Direccion: {
            Municipio: municipios_alumno,
            CP: cp_alumno,
            Localidad: localidad_alumno,
            Colonia: colonia_alumno,
            Calle: calle_alumno,
            NI: NI_alumno,
            NE: NE_alumno,
          },
          Curp: curpFile ? curpName : '',
          Acta: actaFile ? actaName : '',
          Solicitud: solicitudFile ? solicitudName : '',
          Historial: historialFile ? historialName : ''
        });

        // Guardar el usuario en la base de datos
        await nuevoAlumno.save();

        res.json({ message: 'Alumno registrado exitosamente' });
      } catch (err) {
        res.status(500).json({ error: 'Error al registrar el alumno. Inténtalo de nuevo.' });
      }
    },
    //!ACTUALIZAR 
    postActualizar: async (req, res) => {
      try {
        const usuarioId = req.body.usuarioId_act;
        const nombre = req.body.nombre_admin_act;
        const ap = req.body.ap_admin_act;
        const am = req.body.am_admin_act;
        const fechaNacimiento = req.body.Fecha_Nacimiento_admin_act;
        const telefono = req.body.telefono_admin_act;
        const curp = req.body.CURP_admin_act;
        const municipio = req.body.municipios_admin_act;
        const cp = req.body.cp_admin_act;
        const localidad = req.body.localidad_admin_act;
        const colonia = req.body.colonia_admin_act;
        const calle = req.body.calle_admin_act;
        const ni = req.body.NI_admin_act;
        const ne = req.body.NE_admin_act;
        const correo = req.body.correo_admin_act;
        const privilegios = req.body.privilegios_act;

        const foto = req.files && req.files.foto_admin_act ? req.files.foto_admin_act : null;

        if (foto === null) {
          console.log('No se seleccionó una nueva foto');
          const usuarioActualizado = await mainModel.findByIdAndUpdate(
            usuarioId,
            {
              Nombre_usuario: nombre,
              Apellido_Paterno: ap,
              Apellido_Materno: am,
              Fecha_nacimiento: fechaNacimiento,
              Telefono: telefono,
              CURP: curp,
              'Direccion.Municipio': municipio,
              'Direccion.CP': cp,
              'Direccion.Localidad': localidad,
              'Direccion.Colonia': colonia,
              'Direccion.Calle': calle,
              'Direccion.NI': ni,
              'Direccion.NE': ne,
              Correo: correo,
              Privilegios: privilegios,
            },
            { new: true }
          );
          res.status(200).json({
            message:
              'Usuario actualizado correctamente (sin cambios en la foto)',
            usuario: usuarioActualizado,
          });
        } else {
          console.log('Se seleccionó una nueva foto');
          const extension = foto.name.split('.').pop().toLowerCase();
          const fotoName = `${nombre}${ap}${am}_${Date.now()}.${extension}`;
          const fotoPath = path.join(__dirname, '../public/usuarios', fotoName);
          foto.mv(fotoPath, async (err) => {
            if (err) {
              console.error('Error al guardar la foto.', err);
              return res.render('dashboard', {
                error: 'Error al guardar la foto.',
              });
            }
            const usuarioActualizado = await mainModel.findByIdAndUpdate(
              usuarioId,
              {
                Nombre_usuario: nombre,
                Apellido_Paterno: ap,
                Apellido_Materno: am,
                Fecha_Nacimiento: fechaNacimiento,
                Telefono: telefono,
                CURP: curp,
                'Direccion.Municipio': municipio,
                'Direccion.CP': cp,
                'Direccion.Localidad': localidad,
                'Direccion.Colonia': colonia,
                'Direccion.Calle': calle,
                'Direccion.NI': ni,
                'Direccion.NE': ne,
                Correo: correo,
                Privilegios: privilegios,
                Foto: fotoName,
              },
              { new: true },
            );
            res.status(200).json({
              message: 'Usuario actualizado correctamente (con nueva foto)!',
              usuario: usuarioActualizado,
            });
          });
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
      }
    }

    
  }
}