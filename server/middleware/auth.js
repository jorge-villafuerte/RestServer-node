const jwt = require('jsonwebtoken');

//=================
//Verificar token
//=================

let VerificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        //console.log(decoded);
        req.user = decoded.usuario;
        next();
    })
}

//====================
//Verificar role admin
//====================

let verificaRoleAdmin = (req, res, next) => {
    let usuario = req.user;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No posees los permisos de Administrador'
            }
        })
    }



}
let VerificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        //console.log(decoded);
        req.user = decoded.usuario;
        next();
    })
}
module.exports = {
    VerificaToken,
    verificaRoleAdmin,
    VerificaTokenImg
}