const {
    Schema,
    model
} = require('mongoose')


const objetivoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = model('Objetivo', objetivoSchema)