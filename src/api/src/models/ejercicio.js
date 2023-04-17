const {
    Schema,
    model
} = require('mongoose')

const ejercicioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    series: {
        type: Number,
        required: true
    },
    repeticiones: {
        type: Number,
        required: true
    },
    calorias_quemadas: {
        type: Number,
        required: true
    },
    musculo: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Ejercicio', ejercicioSchema)