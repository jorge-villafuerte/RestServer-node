require('./config/config')

////==============================
//Librerias
//==============================
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')


//==============================
//Middleware 
//==============================

//App.use => son middleware son funciones que se van a disparar cada vez que pase el codigo, cada peticion va a pasar por estos middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json());
//impotamos y usamos las rutas de usuario
//cualquier peticion va ingresar al index
app.use(require('./routes/index'));
app.use(express.static(path.resolve(__dirname, '../public')));
//==============================
//Base de datos - Conexion
//==============================
mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, rsp) => {
    if (err) throw err;
    console.log('BASE DE DATOS ONLINE');
});
app.listen(process.env.PORT, () => { console.log(`Escuchando por el puerto ${process.env.PORT}`); })