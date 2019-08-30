"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enviroment_1 = require("../Global/enviroment");
const util_1 = require("util");
const FS = require('fs');
const REQUEST = require('request');
const RP = require('request-promise');
let datosValidos = {
    estado: true,
    error: null,
    data: null
};
/**
 * Esta funcion es para asegurar el archivo tenga solo estos extenciones permitidas de la iamgen
 *
 *
 * @param archivo : el archivo
 * @param cb : callback @returns {Object | null}
 *
 */
function sanitizarImagen(archivo, cb) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif', 'ico'];
    // Check allowed extensions
    let ext = archivo.originalname.split('.');
    let isAllowedExt = fileExts.includes(archivo.originalname.split('.')[ext.length - 1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = archivo.mimetype.startsWith("image/");
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    }
    else {
        cb({ ok: false });
    }
}
const Http_Error = (res, httpCode, object) => {
    return new Promise((resolve, reject) => {
        let respuestaRes = res.status(httpCode).json({
            error: object.mensaje,
            mensaje: object.descripcion
        });
        resolve(respuestaRes);
    });
};
const limpiarObjetoError = () => {
    return { error: null, mensaje: '', code: 0, descripcion: '' };
};
function enviarImagenes(id, lugar, imagenes) {
    return new Promise((resolve, reject) => {
        const FormImagen = [];
        for (let imagen of imagenes) {
            FormImagen.push(FS.createReadStream(imagen.path));
        }
        var formData = {
            id: `${id}`,
            direccion: lugar,
            archivos: FormImagen
        };
        REQUEST.post({ url: `${enviroment_1.URL_SERVIDOR_IMAGES}/upload/saveBlog`, formData: formData }, (err, httpResponse, body) => __awaiter(this, void 0, void 0, function* () {
            yield eliminarImagenes(imagenes);
            if (err)
                return reject({ ok: false });
            let data = JSON.parse(body);
            resolve({
                datos: data.imagen
            });
        }));
    });
}
/***

Eliminar imagenes del otro servidor

*/
function RemoverImagenesServidor(Imagenes) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        var options = {
            method: 'POST',
            uri: `${enviroment_1.URL_SERVIDOR_IMAGES}/upload/deleteImages`,
            body: {
                imagenes: JSON.stringify(Imagenes)
            },
            json: true // Automatically stringifies the body to JSON
        };
        try {
            let data = yield RP(options);
        }
        catch (error) {
        }
        finally {
            resolve();
        }
    }));
}
function eliminarImagenes(imagenes) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let Imgerror = [];
        let intento = 1;
        do {
            for (let imagen of imagenes) {
                try {
                    yield FS.unlinkSync(imagen.path);
                }
                catch (error) {
                    Imgerror.push(imagen);
                }
            }
            if (Imgerror.length > 0) {
                imagenes = Imgerror;
                if (intento <= 2)
                    Imgerror = [];
                intento += 1;
            }
            else {
                break;
            }
        } while (intento <= 3);
        if (Imgerror.length > 0) {
            // TODO: Guardar errores
        }
        resolve();
    }));
}
const validarCamposUnicos = ((modelo, campos, ID) => __awaiter(this, void 0, void 0, function* () {
    if (ID)
        campos._id = { $nin: ID };
    yield limpiarVariables();
    try {
        datosValidos.data = yield modelo.findOne(campos);
        if (util_1.isNullOrUndefined(datosValidos.data))
            datosValidos.estado = false;
    }
    catch (error) {
        datosValidos.estado = false;
        datosValidos.error = error;
    }
    return datosValidos;
}));
/*Valida ID existente
                Parámetros
 Modelo     :  La de la coleccion
 ID         :  ID del documento
*/
const validarID = ((modelo, ID, condicion, camposVisible = {}) => __awaiter(this, void 0, void 0, function* () {
    let datosValidos = {
        estado: true,
        error: null,
        data: null
    };
    condicion._id = ID;
    try {
        datosValidos.data = yield modelo.findOne(condicion, camposVisible);
        if (util_1.isNullOrUndefined(datosValidos.data)) {
            datosValidos.estado = false;
        }
    }
    catch (error) {
        datosValidos.error = error;
        datosValidos.estado = false;
    }
    return datosValidos;
}));
const limpiarVariables = () => __awaiter(this, void 0, void 0, function* () {
    datosValidos.estado = true;
    datosValidos.error = null;
    datosValidos.data = null;
});
const Funciones = {
    Http_Error,
    validarID,
    limpiarObjetoError,
    validarCamposUnicos,
    enviarImagenes,
    sanitizarImagen,
    eliminarImagenes,
    RemoverImagenesServidor
};
exports.default = Funciones;
