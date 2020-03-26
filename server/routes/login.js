require('../config/config')
const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { VerificaToken } = require('../middleware/auth')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {
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

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUsuario = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                error: {
                    e,
                    message: 'Token no valido o error de otro tipo'
                }
            })
        });

    //console.log('google user', googleUsuario);
    Usuario.findOne({ email: googleUsuario.email }, (err, usuarioEncontrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (usuarioEncontrado) {


            if (usuarioEncontrado.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {

                let token = jwt.sign({
                    usuario: usuarioEncontrado
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

                return res.json({
                    ok: true,
                    Usuario: usuarioEncontrado,
                    token
                })


            }
        } else {
            console.log('entra aca aca aca');
            let usuario = new Usuario();

            usuario.nombre = googleUsuario.nombre;
            usuario.email = googleUsuario.email;
            usuario.img = googleUsuario.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err2, usuarioGuardado) => {
                if (err2) {
                    return res.status(500).json({
                        ok: false,
                        err2
                    })
                }
                let token = jwt.sign({
                    usuario: usuarioGuardado
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
                console.log(usuarioGuardado);
                return res.json({
                    ok: true,
                    Usuario: usuarioGuardado,
                    token
                })

            })
        }
    })


    /*     res.json({
            usuario: googleUsuario
        }) */
})

module.exports = app;