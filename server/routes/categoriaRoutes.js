const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const { VerificaToken, verificaRoleAdmin } = require('../middleware/auth');
const _ = require('underscore');
//=============================
//Mostrar todas las categorias
//=============================

app.get('/categoria', (req, res) => {

    Categoria.find({})
        //.sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, lista_categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.count({}, (err2, cantidad) => {
                return res.json({
                    ok: true,
                    Categorias: lista_categorias,
                    Cantidad: cantidad
                })
            })
        });
});


//=============================
//Mostrar categoria por ID
//=============================

app.get('/categoria/:id', VerificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    mxessage: 'No se encontro una categoria con ese ID'
                }
            })
        } else {
            return res.json({
                ok: true,
                Categoria: categoria
            })
        }

    });
})


//=============================
//Crear categoria
//=============================
app.post('/categoria', [VerificaToken, verificaRoleAdmin], (req, res) => {
    let body = req.body;
    let id_usuario = req.user._id;

    let categoria = new Categoria();
    categoria.nombre = body.nombre;
    categoria.descripcion = body.descripcion;
    categoria.usuario = id_usuario;

    categoria.save((err, categoriaSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaSaved) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            Categoria: categoriaSaved
        })
    })

});
//=============================
//Modificar categoria
//=============================
app.put('/categoria/:id', [VerificaToken, verificaRoleAdmin], (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre', 'descripcion', 'usuario']);
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro una categoria con ese ID'
                }
            })
        }
        res.json({
            ok: true,
            Categoria: categoria
        })
    })

});
//=============================
//Eliminar categoria
//=============================

app.delete('/categoria/:id', [VerificaToken, verificaRoleAdmin], (req, res) => {
    let id = req.params.id;
    Categoria.findOneAndRemove(id, (err, categoriaDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaDeleted) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro una categoria con ese ID'
                }
            })
        }
        res.json({
            ok: true,
            Categoria: categoriaDeleted
        })
    })
});

module.exports = app;