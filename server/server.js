require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//App.use => son middleware son funciones que se van a disparar cada vez que pase el codigo, cada peticion va a pasar por estos middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Metodos HTTP
app.get('/', function(req, res) {
    res.send('Hello World')
})
app.post('/usuario', function(req, res) {
    //res.send('Hello World')
    let body1 = req.body;
    //Si el nombre no es enviado, envia un error con status. y un objeto con un mensaje.
    if (body1.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    }
    res.json({
        Persona: body1
    })
})
app.put('/', function(req, res) {
    res.send('Hello World')
})
app.delete('/', function(req, res) {
    res.send('Hello World')
})
app.listen(process.env.PORT, () => { console.log(`Escuchando por el puerto ${process.env.PORT}`); })