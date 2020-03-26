//=======Configuracion global============

//==================
//Puerto
//==================
process.env.PORT = process.env.PORT || 3000;
//process variable global que corre y existe durante la ejecucion de la aplicacion.
//PORT hay casos donde la plataform como heroku setea por nosotros el puerto, de no ser asi ponemos uno por defecto.


//==================
//Entorno
//==================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==================
//Caduciadad
//==================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//==================
//Seed / secret
//==================

process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';

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


//==================
//Google sing in
//==================
process.env.CLIENT_ID = process.env.CLIENT_ID || '331033860477-dn7o5qf1g3p6avhrf3tmpqdtm9cctcsl.apps.googleusercontent.com';