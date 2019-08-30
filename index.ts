import Server from "./Server/server";
import RUTAS from "./Routers/router";


import { HOST, URI_MONGO, PREFIJO, SUFIJO } from "./Global/enviroment"
// Constantes

const Mongoose = require('mongoose')
const Cors = require('cors')
const Helmet = require('helmet')
const BodyParser = require('body-parser')


// Instancia de la clase Server

const SERVER = new Server()
const ServerApp = SERVER.constantes().App
const ServerPort = SERVER.constantes().Port


// ======== Configuracion del BodyParse =======

ServerApp.use(BodyParser.urlencoded({limit: '17mb', extended: true}))
ServerApp.use(BodyParser.json({limit: '17mb', extended: true}))


 // ======= Configuracion del Cors =======

 const Permitidos  = [ HOST ]  

  ServerApp.use( Cors({
    origin: function(origin:any, callback:any){
      
        // Permitiendo peticiones cuando no existe origen
        // como las aplicaciones mobiles
        //  if(!origin) return callback(null, true);
        // if(Permitidos.indexOf(origin) === -1){
        //   var msg = 'Acceso no permitido.';
        //   return callback(msg, false);
        
        // }
        return callback(null, true);
      },credentials:true,
      optionsSuccessStatus: 200 
  }) )

  // ======== Configuracion del Helmet ========

ServerApp.use( Helmet() )
ServerApp.use(Helmet.hidePoweredBy({setTo: 'StupidThings 1.0'})); 
ServerApp.use(Helmet.noCache({noEtag: true})); //conjunto de header de  Cache-Control

// ======== Configuracion de Mongoose ========
let Contador: number = 1
ConexionMongoDB();
function ConexionMongoDB(){
  Mongoose.connection.openUri(`${URI_MONGO}?retryWrites=true`,{useNewUrlParser: true } , (async (error:any,conect:any) => {
  if(error) {
    if(Contador === 5) throw new Error(error)
    Contador+= 1
    ConexionMongoDB()
  }else Contador = 1
  console.log(` MongoDB - \x1b[32monline\x1b[0m`)
}))
}


  // ======== Configuracion de las rutas ========

    // ========================= Vehiculos =========================
        ServerApp.use(`/${PREFIJO}-Vehiculo-Usu-${SUFIJO}`,RUTAS.VEHICULO) //-Ruta de: vehiculo
    
        // ======== Vehiculos publicados ===========
        ServerApp.use(`/${PREFIJO}-VehDea-${SUFIJO}`,RUTAS.VEHICULO_DEALER) //-Ruta de: vehiculos dealer
        ServerApp.use(`/${PREFIJO}-VehRent-${SUFIJO}`,RUTAS.VEHICULO_RENTA) //-Ruta de: vehiculos renta
    
    // ========================= Paginas =========================
      ServerApp.use(`/${PREFIJO}-Pag-${SUFIJO}`,RUTAS.PAGINA) //-Ruta de: pagina
    
    
// Inicializar el servidor
  
SERVER.start(()=>{
    console.log("Servidor corriendo en el puerto:", ServerPort);
})

