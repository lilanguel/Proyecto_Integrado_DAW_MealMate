const {
    check
} = require('express-validator')
const {
    validateResult
} = require('../helpers/validateHelper')
const User = require('../models/user')

const validateCreate = [
    check('nombre_usuario')
    .exists()
    .not()
    .isEmpty()
    .isLength({
        max: 15
    })
    .custom(async (value) => {
        const user = await User.findOne({
            nombre_usuario: value
        });
        if (user) {
            throw new Error('El nombre de usuario ya está en uso');
        }
        return true;
    }),

    check('email')
    .exists()
    .not()
    .isEmpty()
    .isEmail().withMessage('El email debe ser un email con formato correcto')
    .custom(async (value) => {
        const user = await User.findOne({
            email: value
        });
        if (user) {
            throw new Error('El correo ya está en uso');

        }
        return true;
    }),

    check('sexo')
    .exists()
    .not()
    .isEmpty()
    .isIn(['hombre', 'mujer'])
    .withMessage('El sexo debe ser hombre o mujer'),

    check('fecha_nacimiento')
    .exists()
    .not()
    .isEmpty()
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),

    check('password')
    .exists()
    .not()
    .isEmpty()
    .isLength({
        min: 8,
        max: 15
    }).withMessage('La contraseña debe tener entre 8 y 15 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una letra mayúscula')
    .matches(/[0-9]/).withMessage('La contraseña debe tener al menos un número'),

    check('peso')
    .exists()
    .not()
    .isEmpty()
    .isNumeric()
    .custom((value, {
        req
    }) => {
        if (value < 0 || value > 250) {
            throw new Error('El peso debe ser entre 0 y 250 kg')
        }
        return true
    }),

    check('altura')
    .exists()
    .not()
    .isEmpty()
    .isNumeric()
    .custom((value, {
        req
    }) => {
        if (value < 20 || value > 250) {
            throw new Error('La altura debe ser entre 20 y 250 cm')
        }
        return true
    }),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    validateCreate
}