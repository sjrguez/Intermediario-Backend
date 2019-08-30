"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./Server/server"));
const router_1 = __importDefault(require("./Routers/router"));
const enviroment_1 = require("./Global/enviroment");
// Constantes
const Mongoose = require('mongoose');
const Cors = require('cors');
const Helmet = require('helmet');
const BodyParser = require('body-parser');
// Instancia de la clase Server
const SERVER = new server_1.default();
const ServerApp = SERVER.constantes().App;
const ServerPort = SERVER.constantes().Port;
// ======== Configuracion del BodyParse =======
ServerApp.use(BodyParser.urlencoded({ limit: '17mb', extended: true }));
ServerApp.use(BodyParser.json({ limit: '17mb', extended: true }));
// ======= Configuracion del Cors =======
const Permitidos = [enviroment_1.HOST];
ServerApp.use(Cors({
    origin: function (origin, callback) {
        // Permitiendo peticiones cuando no existe origen
        // como las aplicaciones mobiles
        //  if(!origin) return callback(null, true);
        // if(Permitidos.indexOf(origin) === -1){
        //   var msg = 'Acceso no permitido.';
        //   return callback(msg, false);
        // }
        return callback(null, true);
    }, credentials: true,
    optionsSuccessStatus: 200
}));
// ======== Configuracion del Helmet ========
ServerApp.use(Helmet());
ServerApp.use(Helmet.hidePoweredBy({ setTo: 'StupidThings 1.0' }));
ServerApp.use(Helmet.noCache({ noEtag: true })); //conjunto de header de  Cache-Control
// ======== Configuracion de Mongoose ========
let Contador = 1;
ConexionMongoDB();
function ConexionMongoDB() {
    Mongoose.connection.openUri(`${enviroment_1.URI_MONGO}?retryWrites=true`, { useNewUrlParser: true }, ((error, conect) => __awaiter(this, void 0, void 0, function* () {
        if (error) {
            if (Contador === 5)
                throw new Error(error);
            Contador += 1;
            ConexionMongoDB();
        }
        else
            Contador = 1;
        console.log(` MongoDB - \x1b[32monline\x1b[0m`);
    })));
}
// ======== Configuracion de las rutas ========
// ========================= Vehiculos =========================
ServerApp.use(`/${enviroment_1.PREFIJO}-Vehiculo-Usu-${enviroment_1.SUFIJO}`, router_1.default.VEHICULO); //-Ruta de: vehiculo
// ======== Vehiculos publicados ===========
ServerApp.use(`/${enviroment_1.PREFIJO}-VehDea-${enviroment_1.SUFIJO}`, router_1.default.VEHICULO_DEALER); //-Ruta de: vehiculos dealer
ServerApp.use(`/${enviroment_1.PREFIJO}-VehRent-${enviroment_1.SUFIJO}`, router_1.default.VEHICULO_RENTA); //-Ruta de: vehiculos renta
// ========================= Paginas =========================
ServerApp.use(`/${enviroment_1.PREFIJO}-Pag-${enviroment_1.SUFIJO}`, router_1.default.PAGINA); //-Ruta de: pagina
// Inicializar el servidor
SERVER.start(() => {
    console.log("Servidor corriendo en el puerto:", ServerPort);
});
