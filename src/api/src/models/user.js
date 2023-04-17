const {
    Schema,
    model
} = require('mongoose')

var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    nombre_usuario: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    sexo: {
        type: String,
        enum: ["hombre", "mujer"],
        required: true
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    peso: {
        type: Number,
        required: true
    },
    altura:{
        type: Number,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = model('User', userSchema)