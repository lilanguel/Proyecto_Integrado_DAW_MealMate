const {
    check
} = require('express-validator')
const {
    validateResult
} = require('../helpers/validateHelper')
const User = require('../models/user')

// Validación de creación de un usuario
const validateCreate = [
    check('nombre_usuario')
    .exists()
    .not()
    .isEmpty()
    .isLength({
        max: 15
    })
    .withMessage('El nombre de usuario es requerido y debe tener máximo 15 caracteres')
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
    })
    .withMessage('La contraseña debe tener entre 8 y 15 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe tener al menos una letra mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe tener al menos un número'),

    check('peso')
    .exists()
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('El peso es requerido y debe ser un número')
    .custom((value, {
        req
    }) => {
        if (value < 0 || value > 250) {
            throw new Error('El peso debe ser entre 0 y 250 kg');
        }
        return true;
    }),

    check('altura')
    .exists()
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('La altura es requerida y debe ser un número')
    .custom((value, {
        req
    }) => {
        if (value < 20 || value > 250) {
            throw new Error('La altura debe ser entre 20 y 250 cm');
        }
        return true;
    }),

    (req, res, next) => {
        validateResult(req, res, next);
    },
];

// Validación de edición de un usuario
const validateEdit = [
    check('nombre_usuario')
    .optional()
    .not()
    .isEmpty()
    .isLength({
        max: 15
    })
    .withMessage('El nombre de usuario debe tener máximo 15 caracteres')
    .custom(async (value, {
        req
    }) => {
        const user = await User.findOne({
            nombre_usuario: value,
            _id: {
                $ne: req.params.id
            }
        });
        if (user) {
            throw new Error('El nombre de usuario ya está en uso');
        }
        return true;
    }),

    check('email')
    .optional()
    .not()
    .isEmpty()
    .isEmail().withMessage('El email debe ser un email con formato correcto')
    .custom(async (value, {
        req
    }) => {
        const user = await User.findOne({
            email: value,
            _id: {
                $ne: req.params.id
            }
        });
        if (user) {
            throw new Error('El correo ya está en uso');
        }
        return true;
    }),

    check('sexo')
    .optional()
    .not()
    .isEmpty()
    .isIn(['hombre', 'mujer'])
    .withMessage('El sexo debe ser hombre o mujer'),

    check('fecha_nacimiento')
    .optional()
    .not()
    .isEmpty()
    .isDate()
    .withMessage('La fecha de nacimiento debe ser una fecha válida'),

    check('peso')
    .optional()
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('El peso debe ser un número')
    .custom((value) => {
        if (value < 0 || value > 250) {
            throw new Error('El peso debe ser entre 0 y 250 kg');
        }
        return true;
    }),

    check('altura')
    .optional()
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('La altura debe ser un número')
    .custom((value) => {
        if (value < 20 || value > 250) {
            throw new Error('La altura debe ser entre 20 y 250 cm');
        }
        return true;
    }),

    (req, res, next) => {
        validateResult(req, res, next);
    },
];

// Validación de cambio de contraseña de un usuario
const validateChangePassword = [
    check('password')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida')
    .isLength({
        min: 8,
        max: 15
    })
    .withMessage('La contraseña debe tener entre 8 y 15 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una letra mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número'),

    check('confirmPassword')
    .notEmpty()
    .withMessage('La confirmación de la contraseña es requerida')
    .custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('La confirmación de la contraseña no coincide con la nueva contraseña');
        }
        return true;
    }),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

module.exports = {
    validateCreate,
    validateEdit,
    validateChangePassword
}