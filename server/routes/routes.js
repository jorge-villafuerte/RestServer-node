const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore')
    //===========Metodos HTTP=============

app.get('/usuario', function(req, res) {
    //let desde = req.params.desde; // -> tambien valido
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })

        })
})

app.post('/usuario', (req, res) => {
    let body1 = req.body;

    let usuario = new Usuario({
        nombre: body1.nombre,
        email: body1.email,
        password: bcrypt.hashSync(body1.password, 10),
        role: body1.role
    });

    usuario.save((error, resUsuario) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            })
        }
        res.json({
            ok: true,
            usuario: resUsuario

        })
    })
})


//Si el nombre no es enviado, envia un error con status. y un objeto con un mensaje.
/* if (body1.nombre === undefined) {
    res.status(400).json({
        ok: false,
        mensaje: 'El nombre es necesario'
    })
}
res.json({
    Persona: body1
}) */
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB

        })

    });


})
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    }) */
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})

//==========Fin metodos HTTP===========
module.exports = app;