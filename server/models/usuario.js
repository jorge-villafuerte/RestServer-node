const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Esquema = mongoose.Schema;

let usuarioSchema = new Esquema({
    nombre: {
        type: String,
        required: [true, 'El nombre debe ser proporcionado']
    },
    email: {
        type: String,
        required: [true, 'El email debe ser proporcionado'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contrasenia debe ser proporcionado']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        required: false,
        default: true
    },
    google: {
        type: Boolean,
        required: false,
        default: false
    }
});

//Modificar el metodo toJson que este metodo siempre se llama en un esquema cuando se trata imprimir
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);