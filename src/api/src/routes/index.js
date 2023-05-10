const {
    Router
} = require('express')

const router = Router()

const User = require('../models/user')

const jwt = require('jsonwebtoken')

var bcrypt = require('bcryptjs')

const {
    validateCreate
} = require('../validators/users')

router.get('/', (req, res) => res.send('Hello world!'))

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

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }

    const token = req.headers.authorization.split(' ')[1]

    if (token == null) {
        return res.status(401).send('Unauthorized request')
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = payload._id
    next()
}

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

    if (idUsuario !== req.usuario._id) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }

    User.findByIdAndUpdate(idUsuario, {
            objetivo: nuevoObjetivo
        })
        .then(() => {
            res.json({
                mensaje: 'Objetivo actualizado'
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                mensaje: 'Error al actualizar el objetivo'
            });
        });
});

module.exports = router