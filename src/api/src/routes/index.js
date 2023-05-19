const {
    Router
} = require('express')

const router = Router()

// Modelos
const User = require('../models/user')
const Ejercicio = require('../models/ejercicio')
const Comida = require('../models/comida');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const lodash = require('lodash');

const {
    transporter
} = require('../config/mailer');

// Validators
const {
    validateCreate
} = require('../validators/users')

router.post('/signup', validateCreate, async (req, res) => {
    const {
        nombre_usuario,
        email,
        sexo,
        fecha_nacimiento,
        password,
        peso,
        altura
    } = req.body

    const newUser = new User({
        nombre_usuario,
        email,
        sexo,
        fecha_nacimiento,
        password,
        peso,
        altura
    })

    await newUser.save();

    const token = jwt.sign({
        _id: newUser._id,
        role: newUser.role
    }, process.env.JWT_SECRET)

    res.status(200).json({
        token
    })
})

router.post('/signin', async (req, res) => {
    const {
        email,
        password
    } = req.body

    const user = await User.findOne({
        email
    })

    if (!user) return res.status(401).send("El correo no existe")

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) return res.status(401).send("La contraseña no es correcta")

    const token = jwt.sign({
        _id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);

    res.status(200).json({
        token
    })
})

function verificarToken(req, res, next) {
    if (req.headers.authorization == null) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        if (error) {
            return res.status(401).json({
                mensaje: 'Token no válido'
            });
        }

        req.usuario = usuario;
        next();
    });
}

router.put('/objetivo/:id', verificarToken, (req, res) => {
    const idUsuario = req.params.id;
    const nuevoObjetivo = req.body.objetivo;

    // Comprobar si el usuario es correcto
    if (idUsuario !== req.usuario._id) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }

    // Actualizar el objetivo del usuario
    User.findByIdAndUpdate(idUsuario, {
            objetivo: nuevoObjetivo
        })
        .then(() => {
            res.json({
                mensaje: 'Objetivo actualizado'
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensaje: 'Error al actualizar el objetivo'
            });
        });
});

router.get('/generar-rutina/:id', verificarToken, async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        const idUsuario = req.params.id;

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        const objetivo = usuario.objetivo;

        // filtrar los ejercicios por el objetivo correspondiente
        const ejercicios = await Ejercicio.find({
            objetivo: objetivo
        });

        // obtener un conjunto aleatorio de ejercicios de los que se han filtrado
        const ejerciciosAleatorios1 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios2 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios3 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios4 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios5 = lodash.sampleSize(ejercicios, 4);

        // añadir los ejercicios aleatorios a cada array de rutina correspondiente
        const rutina = {
            rutina_lunes: ejerciciosAleatorios1,
            rutina_martes: ejerciciosAleatorios2,
            rutina_miercoles: ejerciciosAleatorios3,
            rutina_jueves: ejerciciosAleatorios4,
            rutina_viernes: ejerciciosAleatorios5
        };

        // actualizar la rutina del usuario
        await User.findByIdAndUpdate(usuario._id, rutina);

        res.status(200).json({
            message: 'Rutina generada con éxito'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al generar la rutina'
        });
    }
});

// Endpoint para obtener los datos de un usuario por su id
router.get('/users/:id', verificarToken, async (req, res) => {
    try {
        const idUsuario = req.params.id;

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        const user = await User.findById(req.params.id)
            .populate({
                path: 'rutina_lunes._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_martes._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_miercoles._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_jueves._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_viernes._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'dieta_lunes._id',
                model: 'Comida'
            })
            .populate({
                path: 'dieta_martes._id',
                model: 'Comida'
            })
            .populate({
                path: 'dieta_miercoles._id',
                model: 'Comida'
            })
            .populate({
                path: 'dieta_jueves._id',
                model: 'Comida'
            })
            .populate({
                path: 'dieta_viernes._id',
                model: 'Comida'
            })
            .populate({
                path: 'dieta_sabado._id',
                model: 'Comida'
            })
            .populate({
                path: 'dieta_domingo._id',
                model: 'Comida'
            })

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.get('/users/:id/rutina/:dia', verificarToken, async (req, res) => {
    try {
        const idUsuario = req.params.id;

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        const user = await User.findById(req.params.id).populate({
            path: `rutina_${req.params.dia}._id`,
            model: 'Ejercicio'
        });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const dia = req.params.dia;
        let rutina = [];

        switch (dia) {
            case 'lunes':
                rutina = user.rutina_lunes.map((item) => item._id);
                break;
            case 'martes':
                rutina = user.rutina_martes.map((item) => item._id);
                break;
            case 'miercoles':
                rutina = user.rutina_miercoles.map((item) => item._id);
                break;
            case 'jueves':
                rutina = user.rutina_jueves.map((item) => item._id);
                break;
            case 'viernes':
                rutina = user.rutina_viernes.map((item) => item._id);
                break;
            default:
                return res.status(400).json({
                    message: 'Invalid day'
                });
        }
        res.json(rutina);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});

router.post('/enviar-correo', async (req, res) => {
    try {
        const {
            destinatario,
            asunto,
            mensaje
        } = req.body;

        // Configura los detalles del correo
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: destinatario,
            subject: asunto,
            text: mensaje,
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Correo enviado correctamente'
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({
            message: 'Error al enviar el correo'
        });
    }
});

module.exports = router