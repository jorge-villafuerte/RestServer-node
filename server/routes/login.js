const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { VerificaToken } = require('../middleware/auth')

app.post('/login', VerificaToken, (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, UsuarioLogin) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!UsuarioLogin) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contrasenia incorrecto'
                }
            })
        }
        if (!bcrypt.compareSync(body.password, UsuarioLogin.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario o (contrasenia) incorrecto'
                }
            })
        }

        let token = jwt.sign({
            usuario: UsuarioLogin
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        return res.json({
            ok: true,
            Usuario: UsuarioLogin,
            token
        })
    })

})

module.exports = app;