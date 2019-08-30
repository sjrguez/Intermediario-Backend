var mongoose = require('mongoose')
var Schema = mongoose.Schema


var vehiculoSchema = new Schema({
    id_usuario: { type: Schema.Types.ObjectId, ref:'Usuario_plataforma',required:true },
    id_marca: { type: Schema.Types.ObjectId, ref:'Marca',required:true },
    id_modelo: { type: Schema.Types.ObjectId, ref:'Modelo',required:true },
    id_motor: { type: Schema.Types.ObjectId, ref:'Motor',required:false },
    id_combustible: { type: Schema.Types.ObjectId, ref:'Combustible',required:false },
    id_transmision: { type: Schema.Types.ObjectId, ref:'Transmision',required:false },
    id_traccion: { type: Schema.Types.ObjectId, ref:'Traccion',required:false },
    id_tipo_vehiculo: {type:Schema.Types.ObjectId, ref:'Tipo_vehiculo',required:false},
    cilindraje: { type: Number,required:false },
    cilindros: { type: Number,required:false },
    ficha: {type: Number, required:false, default:0},
    placa: { type:String,required:false },
    chasis:{
        chasis: { type:String,required:false },
        chasis_valido: { type:Boolean,required:false }
    },
    imagenes:[
        {
            img: { type:String,required:false },
            thumb:{ type:String,required:false }
        }
    ],
    color: {
        id_color_interior: { type: Schema.Types.ObjectId, ref:'Color',required:false },
        id_color_exterior: { type: Schema.Types.ObjectId, ref:'Color',required:true }
    },
    imgPerfil:{
        img: { type:String,required:false},
        thumb: { type:String,required:false}
     },
    year: { type:Number,required:true },
    kilometraje: { type:Number,required:false },
    condicion: { type:String,required: false },
    cabinas: { type:Number,required:false },
    puertas: { type:Number,required:false,default:4 },
    pasajero: { type:Number,required:false,default:4 },
    descripcion:{ type:String,required:false },
    estado: { type:Number,default: 1},
    estadoAdmin: { type:Number,default: 0},
    fecha_registro: { type:Date,required:false,default:new Date() },
    fecha_modificacion: { type:Date,required:false },
    fecha_eliminacion: { type:Date,required:false }
},{collection:"Vehiculos"})


//======= Comentarios =======
//---- Estado de usuario ----
// 1 - Activo
// 2 - Pendiente
// 3 - Desactivo por el usuario
// 5 - Eliminado por el usuario
// 6 - Registrando vehiculo con imagenes

//---- Estado Admin ----
// 1 - Desactivo por la administracion
// 2 - Eliminado por la administracion

module.exports = mongoose.model('Vehiculo',vehiculoSchema)
