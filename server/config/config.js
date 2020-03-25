//=======Configuracion global============

//==================
//Puerto
//==================
process.env.PORT = process.env.PORT || 3000
    //process variable global que corre y existe durante la ejecucion de la aplicacion.
    //PORT hay casos donde la plataform como heroku setea por nosotros el puerto, de no ser asi ponemos uno por defecto.
    //==================
    //Entorno
    //==================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//==================
//Base de datos
//==================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/Cafeteria';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;