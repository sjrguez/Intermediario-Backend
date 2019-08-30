"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var usuarioSchema = Schema({
    usuario: { type: String, required: false },
    nombre_completo: { type: String, required: [true, "Nombre es requerido"] },
    correo: { type: String, required: true },
    correo_valido: { type: Boolean, required: false, default: false },
    cedula_valido: { type: Boolean, required: false, default: false },
    telefono_valido: { type: Boolean, required: false, default: false },
    password: { type: String, required: false },
    cedula: { type: String, required: false },
    telefono: { type: String, required: false },
    direccion: { type: String, required: false },
    fecha_nacimiento: { type: Date, required: false },
    sexo: { type: String, required: false },
    google: { type: Boolean, required: false, default: false },
    facebook: { type: Boolean, required: false, default: false },
    licencia: { type: String, required: false },
    estado: { type: Number, required: false, default: 1 },
    fecha_registro: { type: Date, required: false, default: new Date() },
    fecha_modificacion: { type: Date, required: false },
    fecha_eliminacion: { type: Date, required: false },
    membresia: {
        id_membresia: { type: Schema.Types.ObjectId, ref: 'Membresia', required: [true, "La membresia es requerida"] },
        privilegios_plataforma: [
            {
                id_privilegio_plataforma: { type: Schema.Types.ObjectId, ref: "Privilegios_plataforma" },
                id_funciones_plataforma: { type: Schema.Types.ObjectId, ref: "Funcione_privilegio_plataforma" },
            }
        ]
    },
}, { collection: "Usuarios_plataforma" });
module.exports = mongoose.model('Usuario_plataforma', usuarioSchema);
