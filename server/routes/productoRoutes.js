const express = require('express');
const app = express();
const Producto = require('../models/producto');
const { VerificaToken, verificaRoleAdmin } = require('../middleware/auth');
const _ = require('underscore');
//=============================
//Mostrar todos los productos
//=============================

app.get('/producto', (req, res) => {
    let desde = req.query.desde || 0;
    let hasta = req.query.hasta || 3;

    Producto.find({})
        .populate('usuario')
        .populate('categoria')
        .exec((err, lista_productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!lista_productos) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron productos disponibles'
                    }
                })
            }
            Producto.count({}, (err2, cantidad) => {
                return res.json({
                    ok: true,
                    Productos: lista_productos,
                    Cantidad: cantidad
                })
            })
        })
});

//=============================
//Mostrar producto por ID
//=============================
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro algun producto con ese ID'
                    }
                })
            } else {
                return res.json({
                    ok: true,
                    Producto: producto
                })
            }

        })
        .populate('usuario')
        .populate('categoria');
});
//=============================
//Buscar producto
//=============================
app.get('/producto/buscar/:termino', VerificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('usuario', 'categoria')
        .exec((err, productos_encontrados) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productos_encontrados) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontro algun producto relacionado'
                    }
                })
            } else {
                return res.json({
                    ok: true,
                    Productos: productos_encontrados
                })
            }
        })
});

//=============================
//Crear producto
//=============================
app.post('/producto', VerificaToken, (req, res) => {
    let body = req.body;
    let idUsuario = req.user._id;

    let producto = new Producto({
        usuario: idUsuario,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoSaved) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no se pudo crear'
                }
            })
        }
        res.status(201).json({
            ok: true,
            Producto: productoSaved
        })
    })

});
//=============================
//Actualizar producto
//=============================
app.put('/producto/:id', [VerificaToken, verificaRoleAdmin], (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre', 'descripcion', 'usuario']);
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro un producto con ese ID'
                }
            })
        }
        res.json({
            ok: true,
            Producto: producto
        })
    })

});

//=============================
//Borrar producto
//=============================
app.delete('/producto/:id', [VerificaToken, verificaRoleAdmin], (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ['nombre', 'descripcion', 'usuario']);
    let body = req.body;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No se encontro un producto con ese ID'
                }
            })
        }
        res.json({
            ok: true,
            message: 'El producto fue eliminado (deshabilitado) correctamente',
            Producto: producto
        })
    })

});


module.exports = app;