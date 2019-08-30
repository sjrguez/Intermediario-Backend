"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var paginaSchema = new Schema({
    id_usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    id_tipo_empresa: { type: Schema.Types.ObjectId, ref: 'Tipo_empresa', required: true },
    id_tema_pagina: { type: Schema.Types.ObjectId, ref: 'Tema_pagina', required: false },
    total_vehiculos: { type: Number, default: 0 },
    empresa: {
        nombre_empresa: { type: String, required: true },
        rnc: { type: String, required: false },
        logo: { type: String, required: false },
        logo_oscuro: { type: Boolean, required: false, default: false },
        thumb: { type: String, required: false },
    },
    portada: {
        img: { type: String, required: false },
        thumb: { type: String, required: false },
    },
    certificado: { type: Boolean, required: false },
    visita: {
        comunes: {
            visita_total: { type: Number, required: false },
            visita_hoy: { type: Number, required: false },
            visita_ayer: { type: Number, required: false },
        },
        registrados: {
            visita_total: { type: Number, required: false },
            visita_hoy: { type: Number, required: false },
            visita_ayer: { type: Number, required: false },
        }
    },
    estado: { type: Number, required: false, default: 1 },
    estadoAdmin: { type: Number, required: false, default: 0 },
    fecha_registro: { type: Date, required: false, default: new Date() },
    fecha_modificacion: { type: Date, required: false },
    fecha_eliminacion: { type: Date, required: false }
}, { collection: "Paginas" });
//======= Comentarios =======
//---- Estado ----
// 1 - Activo
// 2 - Pendiente
// 3 - Desactivo por el usuario
// 5 - Eliminado por el usuario
// ---- Estado adminisracion ----
// 1 - Desactivo por la administracion
// 3 - Eliminado por la administracion
module.exports = mongoose.model('Pagina', paginaSchema);
