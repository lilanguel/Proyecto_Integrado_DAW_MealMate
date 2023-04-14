const express = require('express')
require('dotenv').config();
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())

const User = require('./models/user')

app.use('/api', require('./routes/index'))

// Conexión
mongoose.connect(process.env.DB_URI).then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error(error));

// Servidor escuchando
app.listen(process.env.PORT, () =>
    console.log("Servidor escuchando en el puerto " + process.env.PORT)
);