const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new', 
    [
        check('name', 'Nombre obligatorio.').not().isEmpty(),
        check('email', 'Email obligatorio.').isEmail(),
        check('password', 'Contraseña requerida de 6 caracteres.').isLength({min: 6}),
        validarCampos,
    ] , 
    crearUsuario
);

router.post(
    '/', 
    [
        check('email', 'Email obligatorio.').isEmail(),
        check('password', 'Contraseña requerida de 6 caracteres.').isLength({min: 6}),
        validarCampos,
    ] , 
     loginUsuario
);

router.get('/renew', validarJWT , revalidarToken);

module.exports = router;