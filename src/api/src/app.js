const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())

// Models
const User = require('./models/user')
const Comida = require('./models/comida')
const Ejercicio = require('./models/ejercicio')
const Objetivo = require('./models/objetivo')


// AdminBro
const AdminBro = require('admin-bro')
const expressAdminbro = require('@admin-bro/express')
const mongooseAdminbro = require('@admin-bro/mongoose')

AdminBro.registerAdapter(mongooseAdminbro)

const AdminBroOptions = {
    resources: [User, Comida, Ejercicio, Objetivo]
}

const adminBro = new AdminBro(AdminBroOptions)
const router = expressAdminbro.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

// Rutas
app.use('/api', require('./routes/index'))

// Conexión
mongoose.connect(process.env.DB_URI).then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error(error));

// Servidor escuchando
app.listen(process.env.PORT, () =>
    console.log("Servidor escuchando en el puerto " + process.env.PORT)
);