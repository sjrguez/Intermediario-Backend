import { URL_SERVIDOR_IMAGES } from '../Global/enviroment';
import { isNullOrUndefined } from 'util';

const FS = require('fs');
const  REQUEST = require('request')
const RP = require('request-promise');


let datosValidos = {
    estado:true,
    error:null,
    data:null
}



/**
 * Esta funcion es para asegurar el archivo tenga solo estos extenciones permitidas de la iamgen
 * 
 * 
 * @param archivo : el archivo
 * @param cb : callback @returns {Object | null} 
 * 
 */
function sanitizarImagen(archivo: any, cb: any) {
    // Define the allowed extension
    let fileExts = ['png', 'jpg', 'jpeg', 'gif','ico']
    // Check allowed extensions
    let ext = archivo.originalname.split('.')
    let isAllowedExt = fileExts.includes(archivo.originalname.split('.')[ext.length - 1].toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = archivo.mimetype.startsWith("image/")
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) 
    }
    else {
        cb({ok: false})
    }
}


const Http_Error = (res:any,httpCode:Number,object:any)=>{
    return  new Promise((resolve,reject)=>{
        let respuestaRes = res.status(httpCode).json({
            error: object.mensaje,
            mensaje: object.descripcion
        })
        resolve(respuestaRes)

    })
}


const limpiarObjetoError =  (): any => {
    return {error: null,mensaje: '',code: 0, descripcion:''}
}



function enviarImagenes(id: string, lugar: string ,imagenes: any[]) {
    return new Promise((resolve, reject) => {

        const FormImagen = [];
        
        for(let imagen of imagenes){
        
            FormImagen.push(FS.createReadStream(imagen.path))
        }
        
        var formData = {
            id: `${id}`,
            direccion: lugar,
            archivos: FormImagen
        };

        REQUEST.post({url:`${URL_SERVIDOR_IMAGES}/upload/saveBlog`, formData: formData},async (err: any, httpResponse: any, body: any) => {
       
           if (err) return reject({ok: false})
            let data = JSON.parse(body)
            resolve({ 
                datos: data.imagen
            })
        });
    })

}

/***

Eliminar imagenes del otro servidor

*/
function RemoverImagenesServidor(Imagenes: any[]) {
    return new Promise(async (resolve, reject) => {
        var options = {
            method: 'POST',
            uri: `${URL_SERVIDOR_IMAGES}/upload/deleteImages`,
            body: {
                imagenes: JSON.stringify(Imagenes)
            },
            json: true // Automatically stringifies the body to JSON
        };
         
        try {
            let data = await RP(options)
        } catch (error) {
            
        } finally {
            resolve()
        }
    })
}



function  eliminarImagenes(imagenes: any[]){
    return new Promise( async (resolve, reject) =>{
        let Imgerror = []
        let intento = 1

      do{
        for(let imagen of imagenes){
            try {
                await FS.unlinkSync(imagen.path)
            } catch (error) {
                Imgerror.push(imagen)                                
            }
        }
        
        if(Imgerror.length > 0) {
            imagenes = Imgerror
            if(intento <= 2 ) Imgerror = []
            intento+= 1 ;
        }else{
            break;
        }

      }while(intento <= 3) 

      if(Imgerror.length > 0) {
          // TODO: Guardar errores
      }
        resolve()
    })
    
}


const validarCamposUnicos = (async (modelo:any,campos:any,ID?:any)=>{
    if(ID) campos._id={$nin:ID}

    await limpiarVariables()
    
    try {
        datosValidos.data = await modelo.findOne(campos)
        if(isNullOrUndefined(datosValidos.data))  datosValidos.estado = false
   } catch (error) {
       datosValidos.estado = false
       datosValidos.error= error
   }
   
    return datosValidos
})

/*Valida ID existente 
                Parámetros 
 Modelo     :  La de la coleccion 
 ID         :  ID del documento
*/
const validarID = (async (modelo:any,ID:any,condicion:any,camposVisible:any={})=>{
    let datosValidos = {
        estado:true,
        error:null,
        data:null
    }
    
    condicion._id = ID
    try{
        datosValidos.data =  await modelo.findOne(condicion,camposVisible)
        if(isNullOrUndefined(datosValidos.data)){
            datosValidos.estado = false
        }  
    }catch(error){
        datosValidos.error=error
        datosValidos.estado = false
    }
    return datosValidos
})  

const limpiarVariables = async ()=>{
     
    datosValidos.estado = true
    datosValidos.error = null
    datosValidos.data = null
    
}


const Funciones = {
    Http_Error,
    validarID,
    limpiarObjetoError,
    validarCamposUnicos,
    enviarImagenes,
    sanitizarImagen,
    eliminarImagenes,
    RemoverImagenesServidor
}


export default Funciones