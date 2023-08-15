const mongoose = require('mongoose');

// Definir el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  Nombre_usuario: {
    type: String,
    required: true,
  },
  Apellido_Paterno: {
    type: String,
    required: true,
  },
  Apellido_Materno: {
    type: String,
    required: true,
  },
  Fecha_Nacimiento: {
    type: Date,
    required: true,
  },
  Correo: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Telefono: {
    type: Number,
    required: true,
    unique: true,
  },
  Privilegios: {
    type: String,
    enum: ['Admin', 'Sub_admin'],
    required: true,
  },
  Foto: {
    type: String,
    required: true,
  },
  CURP: {
    type: String,
    required: true,
    unique: true,
  },
  Direccion: {
    Municipio: {
      type: String,
      required: true,
    },
    CP: {
      type: String,
      required: true,
    },
    Localidad: {
      type: String,
      required: true,
    },
    Colonia: {
      type: String,
      required: true,
    },
    Calle: {
      type: String,
      required: true,
    },
    NI: {
      type: String,
      required: true,
    },
    NE: {
      type: String,
      required: true,
    },
  },
});

// Crear el modelo basado en el esquema
const Usuario = mongoose.model('usuarios', usuarioSchema);

module.exports = Usuario;
