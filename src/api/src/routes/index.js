const {
    Router
} = require('express')

const router = Router()

// Modelos
const User = require('../models/user')
const Ejercicio = require('../models/ejercicio')
const Comida = require('../models/comida');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const lodash = require('lodash');

const {
    transporter
} = require('../config/mailer');

// Validators
const {
    validateCreate,
    validateEdit,
    validateChangePassword
} = require('../validators/users')

/**
 * Función que genera un token de verificación con el email pasado como parámetro
 * @param {String} email 
 * @returns {String} 
 */
function generarTokenVerificacion(email) {
    const payload = {
        email: email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
}

/**
 * Función que envía un correo al email del usuario para verificar el email
 * @param {String} email 
 * @param {String} token 
 */
function enviarCorreoVerificacion(email, token) {
    // Configurar los detalles del correo
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Verificación de correo electrónico',
        html: `
        <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MealMate - Verificar correo electrónico</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #F5F4FF;
            color: #4E3A58;
        }
        
        h1 {
            color: #663399;
        }
        
        p {
            margin-bottom: 10px;
        }
        
        a {
            color: #663399;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Verificar correo electrónico</h1>
    <p>Estimado/a usuario de Mealmate,</p>
    <p>Gracias por registrarte en MealMate. Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
    <p><a href="https://mealmate-api.up.railway.app/api/verificar?token=${token}">Verificar correo electrónico</a></p>
    <p>Si no has solicitado esta verificación, puedes ignorar este mensaje.</p>
    <p>¡Gracias!</p>
    <p>El equipo de MealMate</p>
</body>
</html>
      `,
    };

    // Envía el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo electrónico enviado:', info.response);
        }
    });
}

// Verificar el correo electrónico a través de un token
router.get('/verificar', async (req, res) => {
    const token = req.query.token; // Token de la URL

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        // Actualizar el campo "verificado" en la base de datos
        await User.updateOne({
            email: email
        }, {
            $set: {
                verificado: true
            }
        });

        console.log('Campo verificado actualizado correctamente');

        res.status(200).json({
            mensaje: 'Correo electrónico verificado correctamente'
        });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(400).json({
            mensaje: 'Token inválido o caducado'
        });
    }
});

// Crea un nueva cuenta de usuario
router.post('/signup', validateCreate, async (req, res) => {
    const {
        nombre_usuario,
        email,
        sexo,
        fecha_nacimiento,
        password,
        peso,
        altura
    } = req.body // Campos del usuario

    // Generar token de verificación
    const token_verificacion = generarTokenVerificacion(email)

    // Crea un nuevo usuario
    const newUser = new User({
        nombre_usuario,
        email,
        sexo,
        fecha_nacimiento,
        password,
        peso,
        altura
    })

    // Envía un correo al usuario para verificar el email
    enviarCorreoVerificacion(email, token_verificacion)

    // Lo guarda en la base de datos
    await newUser.save();

    // Crea un token para iniciar sesión
    const token = jwt.sign({
        _id: newUser._id,
        role: newUser.role
    }, process.env.JWT_SECRET)

    res.status(200).json({
        token
    })
})

// Valida el email y la contraseña de un usuario para iniciar sesión
router.post('/signin', async (req, res) => {
    const {
        email,
        password
    } = req.body // Email y contraseña del usuario

    // Encuentra al usuario por el email
    const user = await User.findOne({
        email
    })

    // Si el usuario no existe:
    if (!user) return res.status(401).send("El correo no existe")

    // Si la contraseña no es la correcta:
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) return res.status(401).send("La contraseña no es correcta")

    // Si el usuario aún no ha sido verificado
    if (!user.verificado) return res.status(401).send("El email aún no ha sido verificado")

    // Crea un token de inicio de sesión
    const token = jwt.sign({
        _id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);

    res.status(200).json({
        token
    })
})

/**
 * Middleware para verificar el token de autorización.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para llamar al siguiente middleware o controlador.
 */
function verificarToken(req, res, next) {
    // Comprueba si no se proporcionó un encabezado de autorización
    if (req.headers.authorization == null) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }

    // Extrae el token de autorización del encabezado
    const token = req.headers.authorization.split(' ')[1];

    // Comprueba si no se proporcionó un token
    if (!token) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }

    // Verifica la validez del token utilizando la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
        // Comprueba si hay un error al verificar el token
        if (error) {
            return res.status(401).json({
                mensaje: 'Token no válido'
            });
        }

        // Almacena la información del usuario decodificada en el objeto de solicitud
        req.usuario = usuario;

        // Llama al siguiente middleware o controlador
        next();
    });
}

// Actualiza el objetivo del usuario
router.put('/objetivo/:id', verificarToken, (req, res) => {
    const idUsuario = req.params.id; // Id del usuario
    const nuevoObjetivo = req.body.objetivo; // Nuevo objetivo del usuario

    // Comprobar si el usuario es correcto
    if (idUsuario !== req.usuario._id) {
        return res.status(401).json({
            mensaje: 'No autorizado'
        });
    }

    // Actualizar el objetivo del usuario
    User.findByIdAndUpdate(idUsuario, {
            objetivo: nuevoObjetivo
        })
        .then(() => {
            res.json({
                mensaje: 'Objetivo actualizado'
            });
        })
        .catch((error) => {
            res.status(500).json({
                mensaje: 'Error al actualizar el objetivo'
            });
        });
});

// Generar una nueva rutina de ejercicios para el usuario
router.get('/generar-rutina/:id', verificarToken, async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id); // Usuario en cuestión
        const idUsuario = req.params.id; // Id del usuario

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }
        // Comprobar si el usuario existe en la base de datos
        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Obtener el objetivo del usuario
        const objetivo = usuario.objetivo;

        // Filtrar los ejercicios por el objetivo correspondiente
        const ejercicios = await Ejercicio.find({
            objetivo: objetivo
        });

        // Obtener un conjunto aleatorio de ejercicios de los que se han filtrado
        const ejerciciosAleatorios1 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios2 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios3 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios4 = lodash.sampleSize(ejercicios, 4);
        const ejerciciosAleatorios5 = lodash.sampleSize(ejercicios, 4);

        // Añadir los ejercicios aleatorios a cada array de rutina correspondiente
        const rutina = {
            rutina_lunes: ejerciciosAleatorios1,
            rutina_martes: ejerciciosAleatorios2,
            rutina_miercoles: ejerciciosAleatorios3,
            rutina_jueves: ejerciciosAleatorios4,
            rutina_viernes: ejerciciosAleatorios5
        };

        // Actualizar la rutina del usuario
        await User.findByIdAndUpdate(usuario._id, rutina);

        res.status(200).json({
            message: 'Rutina generada con éxito'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al generar la rutina'
        });
    }
});

// Obtener los datos de un usuario por su id
router.get('/users/:id', verificarToken, async (req, res) => {
    try {
        const idUsuario = req.params.id; // Id del usuario

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        // Obtener el usuario
        const user = await User.findById(req.params.id)
            .populate({
                path: 'rutina_lunes._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_martes._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_miercoles._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_jueves._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'rutina_viernes._id',
                model: 'Ejercicio'
            })
            .populate({
                path: 'dietas.dieta',
                model: 'Comida'
            })

        // Comprobar si el usuario existe en la base de datos
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Obtener la rutina de ejercicios de un usuario por día especificado
router.get('/users/:id/rutina/:dia', verificarToken, async (req, res) => {
    try {
        const idUsuario = req.params.id; // Id del usuario

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        // Obtener el usuario y su rutina
        const user = await User.findById(req.params.id).populate({
            path: `rutina_${req.params.dia}._id`,
            model: 'Ejercicio'
        });
        // Comprobar si el usuario existe en la base de datos
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const dia = req.params.dia; // Dia de la semana
        let rutina = []; // Rutina de ejercicios

        switch (dia) {
            case 'lunes':
                rutina = user.rutina_lunes.map((item) => item._id);
                break;
            case 'martes':
                rutina = user.rutina_martes.map((item) => item._id);
                break;
            case 'miercoles':
                rutina = user.rutina_miercoles.map((item) => item._id);
                break;
            case 'jueves':
                rutina = user.rutina_jueves.map((item) => item._id);
                break;
            case 'viernes':
                rutina = user.rutina_viernes.map((item) => item._id);
                break;
            default:
                return res.status(400).json({
                    message: 'Invalid day'
                });
        }
        res.json(rutina);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Server Error'
        });
    }
});

// Recuperar contraseña del usuario
router.post('/recuperar-contrasena', async (req, res) => {
    try {
        const {
            email
        } = req.body; // Email del usuario

        // Comprobar si se ha introducido un email
        if (email === null || email === '') {
            return res.status(400).json({
                message: 'Debe ingresar el correo'
            });
        }

        // Verificar si el correo existe en la base de datos y obtener la contraseña asociada
        const usuario = await User.findOne({
            email: email
        });

        // Comprobar si el usuario existe en la base de datos
        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Generar una nueva contraseña aleatoria
        const nuevaContrasena = generarNuevaContrasena();

        // Actualizar la contraseña en tu base de datos
        await User.findByIdAndUpdate(usuario._id, {
            password: nuevaContrasena
        });

        // Configurar los detalles del correo
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `<!DOCTYPE html>
            <html>
            <head>
              <style>
                body{
                    background-color: #F6D7FB;
                }
              </style>
            </head>
            <body>            
              <!-- Contenido principal -->
              <main style="padding: 20px;">
                <h1>Recuperación de Contraseña</h1>
                <p>Estimado(a) ${usuario.nombre_usuario},</p>
                <p>Recibimos una solicitud para recuperar la contraseña de tu cuenta de MealMate. A continuación, te proporcionamos tu nueva contraseña:</p>
                <p><strong>Tu nueva contraseña es: ${nuevaContrasena}</strong></p>
                <p>Te recomendamos iniciar sesión con tu nueva contraseña y cambiarla tan pronto como sea posible.</p>
                <p>Si no solicitaste la recuperación de contraseña, por favor, ignora este correo electrónico.</p>
              </main>
            </body>
            </html>`,
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: 'Se ha enviado un correo con tu nueva contraseña'
        });
    } catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        res.status(500).json({
            message: 'Error al recuperar la contraseña'
        });
    }
});

/**
 * Función para generar una nueva contraseña aleatoria
 * @returns {String} 
 */
function generarNuevaContrasena() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nuevaContrasena = '';

    for (let i = 0; i < 8; i++) {
        nuevaContrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return nuevaContrasena;
}

// Actualizar los datos de un usuario
router.put('/users/:id', verificarToken, validateEdit, async (req, res) => {
    try {
        const idUsuario = req.params.id; // Id del usuario

        const {
            nombre_usuario,
            email,
            sexo,
            fecha_nacimiento,
            peso,
            altura
        } = req.body // Datos nuevos del usuario

        // Comprobar si el usuario es correcto
        if (idUsuario !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        // Actualizar el usuario
        await User.findByIdAndUpdate(idUsuario, {
            nombre_usuario: nombre_usuario,
            email: email,
            sexo: sexo,
            fecha_nacimiento: fecha_nacimiento,
            peso: peso,
            altura: altura
        });

        res.status(200).json({
            message: 'Usuario actualizado correctamente'
        });
    } catch (error) {
        console.error('Error al actualizar el usuario: ', error);
        res.status(500).json({
            message: 'Error al actualizar el usuario'
        });
    }
})

// Endpoint para cambiar la contraseña del usuario
router.put('/users/:id/cambiar-password', verificarToken, validateChangePassword, async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const {
            password
        } = req.body;

        // Comprobar si el usuario es correcto
        if (id !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        // Obtener el usuario de la base de datos
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Actualizar la contraseña del usuario en la base de datos
        user.password = password;
        await user.save();

        return res.json({
            message: 'Contraseña cambiada exitosamente'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Ha ocurrido un error en el servidor'
        });
    }
});

// Endpoint para generar las dietas
router.get('/generar-dietas/:id', verificarToken, async (req, res) => {
    try {
        const userId = req.params.id; // Id del usuario

        // Comprobar si el usuario es correcto
        if (userId !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        // Obtener el usuario
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Generar las dietas
        const dietaSemana = await generarDietaSemanaPorObjetivo(user.objetivo);

        // Guardar las dietas en el usuario
        user.dietas = dietaSemana;

        // Guardar el usuario actualizado en la base de datos
        await user.save();

        res.status(200).json({
            message: 'Dietas generadas exitosamente'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al generar las dietas'
        });
    }
});

// Función para generar las dietas de la semana
async function generarDietaSemanaPorObjetivo(objetivo) {
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const dietaSemana = [];

    // Generar la dieta para cada día de la semana
    for (const dia of diasSemana) {
        const dietaDia = await generarDietaPorObjetivo(objetivo);
        dietaSemana.push({
            dia,
            dieta: dietaDia
        });
    }

    return dietaSemana;
}

// Función para generar una dieta aleatoria a partir de las comidas disponibles
async function generarDietaPorObjetivo(objetivo) {
    const dieta = [];

    // Obtener una comida para desayunar
    const comidaDesayuno = await obtenerComidaAleatoriaPorHorarioYObjetivo("desayuno", objetivo);
    dieta.push(comidaDesayuno);

    // Obtener una comida para almorzar
    const comidaAlmuerzo = await obtenerComidaAleatoriaPorHorarioYObjetivo("almuerzo", objetivo);
    dieta.push(comidaAlmuerzo);

    // Obtener una comida para merendar
    const comidaMerienda = await obtenerComidaAleatoriaPorHorarioYObjetivo("merienda", objetivo);
    dieta.push(comidaMerienda);

    // Obtener una comida para cenar
    const comidaCena = await obtenerComidaAleatoriaPorHorarioYObjetivo("cena", objetivo);
    dieta.push(comidaCena);

    return dieta;
}

// Función para obtener una comida aleatoria de entre las comidas disponibles
async function obtenerComidaAleatoriaPorHorarioYObjetivo(horario, objetivo) {
    try {
        const comidasHorario = await Comida.find({
            horario,
            objetivo,
        });

        const randomIndex = Math.floor(Math.random() * comidasHorario.length);
        return comidasHorario[randomIndex];
    } catch (error) {
        console.error(error);
        throw new Error('Ha ocurrido un error al buscar las comidas por horario');
    }
}

// Ruta para obtener las dieras de un usuario
router.get('/users/:id/dietas', verificarToken, async (req, res) => {
    try {
        const userId = req.params.id; // Id del usuario

        // Comprobar si el usuario es correcto
        if (userId !== req.usuario._id) {
            return res.status(401).json({
                mensaje: 'No autorizado'
            });
        }

        // Obtener el usuario junto con sus dietas
        const usuario = await User.findById(userId).populate('dietas.dieta');

        if (!usuario) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            dietas: usuario.dietas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Ha ocurrido un error al obtener las dietas del usuario'
        });
    }
});


module.exports = router