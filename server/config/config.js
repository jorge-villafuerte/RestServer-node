//=======Configuracion global============

//====Puerto====
process.env.PORT = process.env.PORT || 3000
    //process variable global que corre y existe durante la ejecucion de la aplicacion.
    //PORT hay casos donde la plataform como heroku setea por nosotros el puerto, de no ser asi ponemos uno por defecto.