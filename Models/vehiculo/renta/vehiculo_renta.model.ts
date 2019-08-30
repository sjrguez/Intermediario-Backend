var mongoose = require('mongoose')
var Schema = mongoose.Schema
const ACCESORIO_MODEL=require('../../vehiculo/accesorio.model')

var vehiculoRentaSchema = new Schema({

    id_vehiculo: {type:Schema.Types.ObjectId, ref:'Vehiculo',required:true},
    id_usuario: {type:Schema.Types.ObjectId, ref:'Usuario_plataforma',required:true},
    id_pagina: {type:Schema.Types.ObjectId, ref:'Pagina',required:true},
    vehiculo_indexado:{
   nombre_pagina:{type:String,required:true},
    marca:{
        id_marca:{type:Schema.Types.ObjectId, ref:'Marcas',required:true},
        nombre:{type:String,required:true}
    },
    modelo:{
        id_modelo:{type:Schema.Types.ObjectId, ref:'Modelos',required:true},
        nombre:{type:String,required:true}
    },
    year:{type:String,required:true},
    transmision:{type:String,required:true},
    tipo_vehiculo:{type:String,required:true},
    provincias:[{
        id_sucursal:{type:Schema.Types.ObjectId, ref:'Sucursal',required:true},
        nombre:{type:String,required:true}
    }],
    },
    visita:{
        comunes:{
            visita_total:{type:Number,required:false,default:0},
            visita_hoy:{type:Number,required:false,default:0},
            visita_ayer:{type:Number,required:false,default:0},
        },
        registrados:{
            visita_total:{type:Number,required:false,default:0},
            visita_hoy:{type:Number,required:false,default:0},
            visita_ayer:{type:Number,required:false,default:0},
        }
    },
     precios:{
        precio_general: {type:Number,required:true},
        precio_multiple: [
            {
                días : {type:Number,required:false},
                precio: {type:Number,required:false},
                estado: {type:Boolean,required:false}
            }
        ]
     },
    posicion: {type:Number,required:true},
    estado: {type:Number,default:1,required:true},
    oferta:{type:Boolean,default:false},
    estadoAdmin: { type:Number,default: 0},
    fecha_registro: {type:Date,required:false,default:new Date()},
    fecha_modificacion: {type:Date,required:false},
    fecha_eliminacion: {type:Date,required:false},
    accesorios:[
        {
            id_tipoAccesorio: {type:Schema.Types.ObjectId, ref:'Tipo_accesorio',required:false},
            id_accesorio: {type:Schema.Types.ObjectId, ref:ACCESORIO_MODEL,required:false}
        }
    ],
    descripcion:{Type:String,required:false}
},{collection:"Vehiculos_rentas"})

//======= Comentarios =======
//---- Estado de usuario ----
// 1 - Activo
// 2 - Pendiente
// 3 - Desactivo
// 5 - Eliminado por el usuario

//---- Estado de administracion ----
// 2 - Eliminado por la administracion

module.exports = mongoose.model('Vehiculo_renta',vehiculoRentaSchema)
