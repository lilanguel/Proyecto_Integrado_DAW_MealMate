const {
    Schema,
    model
} = require('mongoose')

const objetivo = require("./objetivo.js");

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
    },
    objetivo: {
        type:Schema.Types.ObjectId,
        ref: objetivo
    }
}, {
    timestamps: true
})

module.exports = model('Ejercicio', ejercicioSchema)