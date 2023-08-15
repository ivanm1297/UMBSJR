const mongoose = require('mongoose');

const municipioSchema = new mongoose.Schema({
  MUNICIPIO:{
  type: String,
  },
  NOMBRE_MUNICIPIO:{
  type: String,
}
});

module.exports = mongoose.model('municipios', municipioSchema);