require('./config/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//App.use => son middleware son funciones que se van a disparar cada vez que pase el codigo, cada peticion va a pasar por estos middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())
    //impotamos y usamos las rutas de usuario
app.use(require('./routes/routes'))

//Conexion con la base de datos
mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, rsp) => {
    if (err) throw err;
    console.log('BASE DE DATOS ONLINE');
});

app.listen(process.env.PORT, () => { console.log(`Escuchando por el puerto ${process.env.PORT}`); })