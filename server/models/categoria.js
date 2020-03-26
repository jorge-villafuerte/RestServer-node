const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Esquema = mongoose.Schema;

let caterogiaSchema = new Esquema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'Se debe proporcionar un nombre']
    },
    descripcion: {
        type: String,
        required: [true, 'Se debe proporcionar una descripcion de la categoria']
    },
    usuario: {
        type: Esquema.Types.ObjectId,
        ref: 'Usuario'
    }
});
caterogiaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Categoria', caterogiaSchema);