const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { VerificaTokenImg } = require('../middleware/auth');

app.get('/imagen/:tipo/:img', VerificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen) > 0) {
        res.sendFile(pathImagen);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/noimage.png');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;