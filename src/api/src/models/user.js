const {
    Schema,
    model
} = require('mongoose')

var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;
const Ejercicio = require('./ejercicio');
const Comida = require('./comida');

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
    altura: {
        type: Number,
        required: true
    },
    objetivo: {
        type: String,
        enum: ["Perder peso", "Tonificar", "Aumentar masa muscular", "Mejorar rendimiento"]
    },
    role: {
        type: String,
        enum: ['admin', 'restricted'],
        default: 'restricted'
    },
    rutina_lunes: [{
        ejercicio: {
            type: Schema.Types.ObjectId,
            ref: 'Ejercicio'
        }
    }],
    rutina_martes: [{
        ejercicio: {
            type: Schema.Types.ObjectId,
            ref: 'Ejercicio'
        }
    }],
    rutina_miercoles: [{
        ejercicio: {
            type: Schema.Types.ObjectId,
            ref: 'Ejercicio'
        }
    }],
    rutina_jueves: [{
        ejercicio: {
            type: Schema.Types.ObjectId,
            ref: 'Ejercicio'
        }
    }],
    rutina_viernes: [{
        ejercicio: {
            type: Schema.Types.ObjectId,
            ref: 'Ejercicio'
        }
    }],
    dieta_lunes: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
    dieta_martes: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
    dieta_miercoles: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
    dieta_jueves: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
    dieta_viernes: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
    dieta_sabado: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
    dieta_domingo: [{
        comida: {
            type: Schema.Types.ObjectId,
            ref: 'Comida'
        }
    }],
}, {
    timestamps: true
})

userSchema.pre('save', function (next) {
    var user = this;

    // Verificar si la contraseña ha sido modificada
    if (!user.isModified('password')) return next();

    // Generar el salt y hashear la contraseña
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.pre('findOneAndUpdate', function (next) {
    var update = this.getUpdate();
    if (!update || !update.password) return next();

    // Generar el salt y hashear la contraseña actualizada
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(update.password, salt, function (err, hash) {
            if (err) return next(err);
            update.password = hash;
            next();
        });
    });
});

module.exports = model('User', userSchema)