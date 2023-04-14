const {
    Router
} = require('express')

const router = Router()

const User = require('../models/user')

const jwt = require('jsonwebtoken')

router.get('/', (req, res) => res.send('Hello world!'))

router.post('/signup', async (req, res) => {
    const {
        email,
        password
    } = req.body

    const newUser = new User({
        email,
        password
    })

    await newUser.save();

    const token = jwt.sign({
        _id: newUser._id
    }, 'secretkey')
    res.status(200).json({
        token
    })

    console.log(token)
})

router.post('/signin', async (req, res) => {
    const {
        email,
        password
    } = req.body

    const user = await User.findOne({
        email
    })

    if (!user) return res.status(401).send("The email doesn't exists")
    if (user.password !== password) return res.status(401).send("Wrong password")

    const token = jwt.sign({
        _id: user._id
    }, 'secretkey');
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

module.exports = router

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }

    const token = req.headers.authorization.split(' ')[1]

    if (token == null) {
        return res.status(401).send('Unauthorized request')
    }

    const payload = jwt.verify(token, 'secretkey')

    req.userId = payload._id
    next()
}