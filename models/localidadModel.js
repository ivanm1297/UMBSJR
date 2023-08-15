const mongoose = require('mongoose');

const localidadSchema = new mongoose.Schema({
    MUNICIPIO:{
        type: String,
        },
    LOCALIDAD:{
            type: String,
        },
    NOMBRE_LOCALIDAD:{
        type: String,
        }
});

module.exports = mongoose.model('localidades', localidadSchema);
