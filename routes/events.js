const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { actualizarEvento, crearEvento, eliminarEvento, obtenerEventos } = require('../controllers/events');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

router.use( validarJWT );

router.get('/', obtenerEventos);

router.post(
    '/',
    [
        check('title', 'Título del evento es requerido').not().isEmpty(),
        check('start', 'Fecha de inicio es requerida').custom( isDate ),
        check('end', 'Fecha de fin es requerida').custom( isDate ),
        validarCampos
    ],
    crearEvento
);

router.put(
    '/:id',
    [
        check('title', 'Título del evento es requerido').not().isEmpty(),
        check('start', 'Fecha de inicio es requerida').custom( isDate ),
        check('end', 'Fecha de fin es requerida').custom( isDate ),
        validarCampos
    ], 
    actualizarEvento
);

router.delete('/:id', eliminarEvento);

module.exports = router;