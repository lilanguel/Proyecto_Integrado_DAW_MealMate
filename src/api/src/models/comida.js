const {
    Schema,
    model
} = require('mongoose')

const comidaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    calorias: {
        type: Number,
        required: true
    },
    proteinas: {
        type: Number,
        required: true
    },
    carbohidratos: {
        type: Number,
        required: true
    },
    grasas: {
        type: Number,
        required: true
    },
    fibras: {
        type: Number,
        required: true
    },
    horario: {
        type: String,
        enum: ["desayuno", "almuerzo", "merienda", "cena"],
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Comida', comidaSchema)