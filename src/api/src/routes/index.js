const {
    Router
} = require('express')

const router = Router()

const User = require('../models/user')

const jwt = require('jsonwebtoken')

var bcrypt = require('bcryptjs');

router.get('/', (req, res) => res.send('Hello world!'))

router.post('/signup', async (req, res) => {
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

    if (await User.findOne({
            email
        })) {
        return res.status(401).send("El correo ya está en uso")
    }

    if (await User.findOne({
            nombre_usuario
        })) {
        return res.status(401).send("El nombre de usuario ya está en uso")
    }

    await newUser.save();

    const token = jwt.sign({
        _id: newUser._id,
        admin: newUser.admin
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
        admin: user.admin
    }, process.env.JWT_SECRET);

    res.status(200).json({
        token
    })
})

router.get('/main', verifyToken, (req, res) => {
    res.json([{
            name: 1,
            description: "hola desde 1"
        }, {
            name: 2,
            description: "hola desde 2"
        },
        {
            name: 3,
            description: "hola desde 3"
        }
    ])
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

module.exports = router