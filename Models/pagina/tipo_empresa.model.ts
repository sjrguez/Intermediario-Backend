var mongoose = require('mongoose')
var Schema = mongoose.Schema

var tipoEmpresaSchema = new Schema({
     icono: {type:String,required:false},
     rutaImg: {type:String,required:false},
     nombre: {type:String,required:false},
     estado: {type:Number,required:false,default:1},
     fecha_registro: {type:Date,required:false,default:new Date()},
     fecha_modificacion: {type:Date,required:false},
     fecha_eliminacion: {type:Date,required:false}
},{collection:"Tipos_empresas"})

//======= Comentarios =======
//---- Estado ----
// 1 - Activo
// 2 - Desactivo 
// 3 - Eliminado


module.exports = mongoose.model('Tipo_empresa',tipoEmpresaSchema)
