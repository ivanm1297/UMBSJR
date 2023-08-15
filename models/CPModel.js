const mongoose = require('mongoose');

const CPSchema = new mongoose.Schema({
    CP:{
        type:String,
    },
    LOCALIDAD:{
        type: String,
    },
    ASENTAMIENTO:{
        type: String,
    },
    MUNICIPIO:{
        type: String,
    },
    ESTADO:{
        type: String,
    }
});

module.exports = mongoose.model('CP', CPSchema);