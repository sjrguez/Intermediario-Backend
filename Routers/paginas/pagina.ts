import { Router, Request,Response } from 'express';
import Funciones from '../../Global/funciones'
import { isNullOrUndefined } from 'util';
import { URL_BACKEND } from '../../Global/enviroment';
const ROUTER: Router = Router();


const PAGINA  = require('../../Models/pagina/pagina.model')
const USUARIO = require('../../Models/usuario/usuario.model')
const TIPOEMPRESA = require('../../Models/pagina/tipo_empresa.model')

const Path = require('path')
const Multer = require('multer');
const RP = require('request-promise');


const storage = Multer.diskStorage({
    destination: Path.join(__dirname, '/../../../Temp/Images/Pagina'),
    filename: function (req: any, file: any, cb: any) {        
        // null as first argument means no error
        let random = (Math.random() * (10000 - 100)) + 100
        let archivo =  `${ new Date().getTime()}-${random.toFixed()}-${file.originalname}`.replace(/ /g,"" )  
        cb(null, archivo)
    }
})

const Upload = Multer({
    storage: storage,
    fileFilter: function(req: any, file: any , cb: any) {
        Funciones.sanitizarImagen(file, cb);
    }
}).any()


let error_mensaje={
    error:null,
    mensaje:'',
    descripcion:'',
    code:0
}


ROUTER.post('/reg-pag/:user',async (req: Request, res: Response) => {
    Upload(req, res, async (error: any) =>{
        if(error){
            let err = {code: 500, mensaje: 'Ha sucedido un error al registrar pagina', descripcion: 'Ha sucedido un error al registrar pagina'}
            return  Funciones.Http_Error(res,err.code,err)
        }


        error_mensaje = await Funciones.limpiarObjetoError()

        let Files: any = [];
        
        let Pagina: any
        let Sucursal: any
        const BODY = req.body
        
        try {
            Pagina = JSON.parse(BODY.pagina)
            
            Sucursal = JSON.parse(BODY.sucursal)
        } catch (error) {
            let err = {code: 500, mensaje: 'Ha sucedido un error al registrar pagina', descripcion: 'Ha sucedido un error al registrar pagina'}
            return Funciones.Http_Error(res,err.code,err)
        }

        if(req.files.length > 1){
            for(let x = 0; x == 0; x++) {
                Files.push(req.files[x])
            }

            const imgEliminar = [];
            for(let x = 1; x < req.files.length; x++ ){
                imgEliminar.push(req.files[x])
            }

            await Funciones.eliminarImagenes(imgEliminar)
        } else {
            Files = req.files
        }

        const UserID = req.params.user
    
        const validarCamposUnicos = {
            'Pagina.empresa.nombre_empresa': Pagina.empresa.nombre_empresa,
            certificado: true,
            estado: {$in: [1,2,3]}
        }
        
 
        try {
            const validarData: any = Funciones.validarCamposUnicos(PAGINA, validarCamposUnicos )
            if(!isNullOrUndefined(validarData.error))  (error_mensaje.code = 500)
            if(validarData.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'El nombre de la pagina esta utilizado', error_mensaje.descripcion = 'El nombre esta siendo utilizado por una pagina certificada')
            if(error_mensaje.mensaje !== '') throw error_mensaje
        } catch (error) {
            if(error.code === 500)  error.mensaje = 'No se pudo registrar esta pagina'
            if(error.code === 500)  error.descripcion = 'Ha sucedido un error al registrar pagina'
            await Funciones.eliminarImagenes(Files)

            return Funciones.Http_Error(res,error.code, error )
        }
        
        const validacionEstado =  {
            estado: 1
        }
        
        try {
            const validarIdUsuario = await Funciones.validarID(USUARIO, UserID, validacionEstado)
            if(!validarIdUsuario.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'Este usuario no existe', error_mensaje.descripcion = 'Este usuario no existe en la plataforma')
            if(error_mensaje.mensaje !== '') throw error_mensaje    
        } catch (error) {
            if (error.code === 400) error_mensaje = error
            if(error.code !== 400)  error_mensaje.code = 500
            await Funciones.eliminarImagenes(Files)

            return Funciones.Http_Error(res,error.code, error )
        }
        
        try {
            const validarIdTipoPag = await Funciones.validarID(TIPOEMPRESA, Pagina.id_tipo_empresa, validacionEstado)
            if(!validarIdTipoPag.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'Este tipo de empresa no existe', error_mensaje.descripcion = 'Este tipo de empresa no existe en la plataforma')
            if(error_mensaje.mensaje !== '') throw error_mensaje    
        } catch (error) {
            if (error.code === 400) error_mensaje = error
            if(error.code !== 400)  error_mensaje.code = 500
            await Funciones.eliminarImagenes(Files)
            Funciones.eliminarImagenes(Files)

            return Funciones.Http_Error(res,error.code, error )
        }

        let pagina = new PAGINA({
            id_usuario: UserID,
            id_tipo_empresa: Pagina.id_tipo_empresa,
            'empresa.nombre_empresa': Pagina.empresa.nombre_empresa
        })

        let Images: any


        if(Files.length === 1) {
            try {
                const ResImages: any = await Funciones.enviarImagenes(pagina._id, `Pagina/user-${pagina.id_usuario}` , Files)
                Images = ResImages.datos
                pagina.empresa.logo = Images[0].img
                pagina.empresa.thumb = Images[0].thumb
                pagina.empresa.logo_oscuro = Pagina.empresa.logo_oscuro
            } catch (error) {
                const errorImage = {
                    code:500,
                    mensaje: 'No se pudo registrar esta pagina',
                    descripcion:'Ha sucedido un error al registrar pagina'
                }
                return Funciones.Http_Error(res,errorImage.code,errorImage)
            }
        }

        try {
            var options = {
                method: 'POST',
                uri: `${URL_BACKEND}/upload/deleteImages`,
                body: {
                    pagina: JSON.stringify(pagina),
                    sucursal: JSON.stringify(Sucursal)
                },
                json: true // Automatically stringifies the body to JSON
            };
            let data = await RP(options)
            console.log(data)
            
            
        } catch (error) {
            console.log(error)
            await Funciones.RemoverImagenesServidor(Images)
        }
        
    
    })
})

module.exports = ROUTER