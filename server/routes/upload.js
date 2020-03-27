const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');
//middleware.. todos los archivos que se suban se cargaran a partir de este middleware
app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }
    //Validar tipo
    let tiposValidos = ['usuarios', 'productos'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                Type: tipo
            }
        });

    }

    //validar extencion
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];

    let extencionesValidas = ['jpg', 'png', 'jpeg'];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son ' + extencionesValidas.join(', '),
                extencion
            }
        });

    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        switch (tipo) {
            case 'usuarios':
                usuarioImg(id, res, nombreArchivo);
                break;
            case 'productos':
                productoImg(id, res, nombreArchivo);
                break;

        }
    });
});

function usuarioImg(id, res, archivoNombre) {

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            borrarArchivo(archivoNombre, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuario) {
            borrarArchivo(archivoNombre, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro un usuario con ese ID'
                }
            })
        }
        borrarArchivo(usuario.img, 'usuarios');

        usuario.img = archivoNombre;
        usuario.save((err2, usuarioSaved) => {
            return res.json({
                ok: true,
                Usuario: usuarioSaved,
                Img: archivoNombre
            })
        })



    })
}

function productoImg(id, res, archivoNombre) {

    Producto.findById(id, (err, producto) => {
        if (err) {
            borrarArchivo(archivoNombre, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!producto) {
            borrarArchivo(archivoNombre, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro un producto con ese ID'
                }
            })
        }
        borrarArchivo(producto.img, 'productos');

        producto.img = archivoNombre;
        producto.save((err2, productoSaved) => {
            return res.json({
                ok: true,
                Producto: productoSaved,
                Img: archivoNombre
            })
        })
    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;