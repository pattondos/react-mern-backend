const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    const {  email, password } = req.body;
    
    try {

        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Se encontró un usuario con ese email. Verifique sus datos.'
            });
        }

        usuario = new Usuario( req.body );

        const pwdSalt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, pwdSalt );

        await usuario.save();
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            msg: 'Nuevo registro creado exitosamente.',
            uid: usuario.id,
            name: usuario.name,
            token
        });

        console.log('Nuevo registro creado exitosamente.');

    } catch ( error ) {
        console.error('Error al crear nuevo usuario: '+error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado, por favor contacte un administrador.'
        });
    }
}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un usuario con ese email. Verifique sus datos.'
            });
        }

        const verPWD = bcrypt.compareSync( password,  usuario.password );

        if( !verPWD ){
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró un usuario con esa contraseña. Verifique sus datos.'
            });
        }

        const token = await generarJWT( usuario.id, usuario.name );
        
        res.status(200).json({
            ok: true,
            msg: 'Login success.',
            uid: usuario.id,
            name: usuario.name,
            token,
        });
        console.log('Inicio de sesión exitoso.')
        
    } catch (error) {
        console.error('Error al iniciar sesión: '+error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado, por favor contacte un administrador.'
        });    
    }

}

const revalidarToken = async(req, res = response) => {

    const { uid, name } = req;

    const token = await generarJWT( uid, name );

    res.json({
        ok: true,
        nToken: token,
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}