const {
    Router
} = require('express')

const router = Router()

// Modelos
const User = require('../models/user')
const Ejercicio = require('../models/ejercicio')

// Middlewares
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const lodash = require('lodash');

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

router.put('/generar-rutina/:id', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);

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
        const ejerciciosAleatorios = lodash.sampleSize(ejercicios, 4);

        // añadir los ejercicios aleatorios a cada array de rutina correspondiente
        const rutina = {
            rutina_lunes: ejerciciosAleatorios,
            rutina_martes: ejerciciosAleatorios,
            rutina_miercoles: ejerciciosAleatorios,
            rutina_jueves: ejerciciosAleatorios,
            rutina_viernes: ejerciciosAleatorios
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

// Endpoint para obtener un ejercicio por su id
router.get('/ejercicio/:id', async (req, res) => {
    try {
        const ejercicio = await Ejercicio.findById(req.params.id);
        if (!ejercicio) {
            return res.status(404).json({
                message: 'Ejercicio no encontrado'
            });
        }
        return res.json(ejercicio);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
});

// Endpoint para obtener todos los ejercicios
router.get('/ejercicios', async (req, res) => {
    try {
        const ejercicios = await Ejercicio.find();
        if (!ejercicios) {
            return res.status(404).json({
                message: 'No hay ejercicios'
            });
        }
        return res.json(ejercicios);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Error del servidor'
        });
    }
});

// Endpoint para obtener los datos de un usuario por su id
router.get('/users/:id', async (req, res) => {
    try {
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
            });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router