import { Router, Request,Response } from 'express';
import Funciones from '../../Global/funciones'
import { isNullOrUndefined } from 'util';
import { URL_BACKEND, PREFIJO_SERVER, SUFIJO_SERVER } from '../../Global/enviroment';

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
            let err = { mensaje: 'Ha sucedido un error al registrar pagina', descripcion: 'Ha sucedido un error al registrar pagina'}
            return  Funciones.Http_Error(res ,500 ,err)
        }
        
        error_mensaje = await Funciones.limpiarObjetoError()
        let Files: any = [];
        
        let Pagina: any
        let Sucursal: any
        const BODY = req.body
        const FilesReq = req.files
        
        try {
            Pagina = JSON.parse(BODY.pagina)
            Sucursal = JSON.parse(BODY.sucursal)
        } catch (error) {
            let err = { mensaje: 'Ha sucedido un error al registrar pagina', descripcion: 'Ha sucedido un error al registrar pagina'}
            if(!isNullOrUndefined(FilesReq) &&  FilesReq.length > 0) await Funciones.eliminarImagenes(FilesReq)
            return Funciones.Http_Error(res,500,err)
        }


        if(FilesReq.length > 1){
            for(let x = 0; x == 0; x++) {
                Files.push(FilesReq[x])
            }

            const imgEliminar = [];
            for(let x = 1; x < FilesReq.length; x++ ){
                imgEliminar.push(FilesReq[x])
            }

            await Funciones.eliminarImagenes(imgEliminar)
        } else {
            Files = FilesReq
        }

        const UserID = req.params.user
    
        const validarCamposUnicos = {
            'Pagina.empresa.nombre_empresa': Pagina.empresa.nombre_empresa,
            certificado: true,
            estado: {$lte: 3},
            estadoAdmin: {$lte: 1}
        }
        

        const validacionEstado =  {
            estado: 1
        }
        
        try {
            const validarIdUsuario = await Funciones.validarID(USUARIO, UserID, validacionEstado)
            if(!isNullOrUndefined(validarIdUsuario.error))  (error_mensaje.code = 500, error_mensaje.mensaje =  'No se pudo registrar esta pagina',error_mensaje.descripcion = 'Ha sucedido un error al registrar pagina')
            
            if(!validarIdUsuario.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'Este usuario no existe', error_mensaje.descripcion = 'Este usuario no existe en la plataforma')
            if(error_mensaje.mensaje !== '') throw error_mensaje    
            
        } catch (error) {
            if(!isNullOrUndefined(FilesReq) &&  FilesReq.length > 0) await Funciones.eliminarImagenes(Files)

            return Funciones.Http_Error(res,error.code, error )
        }

 
        try {
            const validarData: any = Funciones.validarCamposUnicos(PAGINA, validarCamposUnicos )
            if(!isNullOrUndefined(validarData.error))  (error_mensaje.code = 500, error_mensaje.mensaje =  'No se pudo registrar esta pagina',error_mensaje.descripcion = 'Ha sucedido un error al registrar pagina')

            if(validarData.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'El nombre de la pagina esta utilizado', error_mensaje.descripcion = 'El nombre esta siendo utilizado por una pagina certificada')
            if(error_mensaje.mensaje !== '') throw error_mensaje
        } catch (error) {
            if(!isNullOrUndefined(FilesReq) &&  FilesReq.length > 0) await Funciones.eliminarImagenes(Files)
            await Funciones.eliminarImagenes(Files)

            return Funciones.Http_Error(res,error.code, error )
        }
        
        
        try {
            const validarIdTipoPag = await Funciones.validarID(TIPOEMPRESA, Pagina.id_tipo_empresa, validacionEstado)
            if(!isNullOrUndefined(validarIdTipoPag.error))  (error_mensaje.code = 500, error_mensaje.mensaje =  'No se pudo registrar esta pagina',error_mensaje.descripcion = 'Ha sucedido un error al registrar pagina')

            if(!validarIdTipoPag.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'Este tipo de empresa no existe', error_mensaje.descripcion = 'Este tipo de empresa no existe en la plataforma')
            if(error_mensaje.mensaje !== '') throw error_mensaje    
        } catch (error) {
            if(!isNullOrUndefined(FilesReq) &&  FilesReq.length > 0) await Funciones.eliminarImagenes(Files)
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
            } finally {
                await Funciones.eliminarImagenes(Files)
            }
        }

        try {
            var options = {
                method: 'POST',
                uri: `${URL_BACKEND}/${PREFIJO_SERVER}-Pag-Images-${SUFIJO_SERVER}/reg-pag`,
                body: {
                    pagina: JSON.stringify(pagina),
                    sucursal: JSON.stringify(Sucursal)
                },
                json: true
            };
            let datos = await RP(options)
            res.json({
              mensaje: datos.mensaje,
              data: datos.data
            })
            
        } catch (error) {
            const error_mnsj = {
                mensaje: 'No se pudo registrar esta pagina',
                descripcion:'Ha sucedido un error al registrar pagina'
            }
            if(!isNullOrUndefined(Images)) await Funciones.RemoverImagenesServidor(Images)
            return Funciones.Http_Error(res, 500, error_mnsj)
        }
        
    
    })
})


// <-==============================================->
//               Modificar pagina
// <-==============================================->


ROUTER.put('/udp-pag/:userID/:pageID', (req: Request, res: Response)=>{

    Upload(req, res, async (error: any) => {
         
        if(error){
            let err = { mensaje: 'No se pudo modificar esta pagina', descripcion: 'Ha sucedido un error al modificar la pagina'}
            return  Funciones.Http_Error(res, 500, err)
        }
        error_mensaje = await Funciones.limpiarObjetoError()
        let BODY: any
        const PaginaID = req.params.pageID
        const UserID = req.params.userID
        let Files: any = []
        const FilesReq = req.files
        try {
            BODY = JSON.parse(req.body.pagina)
        } catch (error) {
            let err = { mensaje: 'No se pudo modificar esta pagina', descripcion: 'Ha sucedido un error al modificar la pagina'}
            if(!isNullOrUndefined(FilesReq) && FilesReq.length > 0) await Funciones.eliminarImagenes(FilesReq)
            return  Funciones.Http_Error(res, 500, err)
        }

        if(FilesReq.length > 1){
            for(let x = 0; x == 0; x++) {
                Files.push(FilesReq[x])
            }

            const imgEliminar = [];
            for(let x = 1; x < FilesReq.length; x++ ){
                imgEliminar.push(FilesReq[x])
            }

            await Funciones.eliminarImagenes(imgEliminar)

        } else {
            Files = FilesReq
        }

        let ValidarID: any
        try {
            ValidarID = await Funciones.validarID(PAGINA, PaginaID, {id_usuario: UserID,estado: {$lte: 3}, estadoAdmin: {$lte: 1} })

            if(!isNullOrUndefined(ValidarID.error))  (error_mensaje.code = 500,  error_mensaje.mensaje = 'No se pudo modificar esta pagina', error_mensaje.descripcion = 'Ha sucedido un error al modificar la pagina')
            if(!ValidarID.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'No existe esta pagina', error_mensaje.descripcion = 'La pagina que intenta modificar no existe en la plataforma')
            if(error_mensaje.mensaje !== '') throw error_mensaje
        } catch (error) {
            if(!isNullOrUndefined(FilesReq) && FilesReq.length > 0) await Funciones.eliminarImagenes(FilesReq)
            return Funciones.Http_Error(res,error.code, error )
        }

        const pagina: any = ValidarID.data
        const validarCamposUnicos = {
            'empresa.nombre_empresa': BODY.empresa.nombre_empresa,
            certificado: true,
            estado: {$lte: 3},
            estadoAdmin: {$lte: 1}
        }
        try {
            const ValidarCampos = await Funciones.validarCamposUnicos(PAGINA, validarCamposUnicos )
            if(!isNullOrUndefined(ValidarCampos.error))  (error_mensaje.code = 500,  error_mensaje.mensaje = 'No se pudo modificar esta pagina', error_mensaje.descripcion = 'Ha sucedido un error al modificar la pagina')
            if(ValidarCampos.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'El nombre de la pagina esta utilizado', error_mensaje.descripcion = 'El nombre esta siendo utilizado por una pagina certificada')
            if(error_mensaje.mensaje !== '') throw error_mensaje
        } catch (error) {
            if(!isNullOrUndefined(FilesReq) && FilesReq.length > 0) await Funciones.eliminarImagenes(FilesReq)
            return Funciones.Http_Error(res,error.code, error )
        }
        

        let Images: any
        if(Files.length > 0) {
            try {
                const ResImages: any = await Funciones.enviarImagenes(pagina._id, `Pagina/user-${pagina.id_usuario}` , Files)
                Images = ResImages.datos
                BODY.empresa.logo = Images[0].img
                BODY.empresa.thumb = Images[0].thumb
                
            } catch (error) {

                const errorImage = {
                    mensaje: 'No se pudo modificar esta pagina',
                    descripcion:'Ha sucedido un error al modificar la pagina'
                }
                return Funciones.Http_Error(res, 500 ,errorImage)
            } finally {
                await Funciones.eliminarImagenes(Files)
            }
        }
        try {
            
            var options = {
                method: 'PUT',
                uri: `${URL_BACKEND}/${PREFIJO_SERVER}-Pag-Images-${SUFIJO_SERVER}/udp-pag/${PaginaID}`,
                body: {
                    pagina: JSON.stringify(BODY)
                },
                json: true
            };

            let datos = await RP(options)

            res.json({
              mensaje: datos.mensaje,
              data: datos.data
            })
        } catch (error) {
            const error_mnsj = {
                mensaje: 'No se pudo modificar esta pagina',
                descripcion:'Ha sucedido un error al modificar la pagina'
            }
            if (Files.length > 0) {
                await Funciones.RemoverImagenesServidor(Images)
            }
            return Funciones.Http_Error(res, 500, error_mnsj)
        }
    })
})


// <-==============================================================->
//               Modificar imagen de portada de pagina
// <-==============================================================->
ROUTER.put('/upd-page-portada/:page/:user', async (req: Request, res: Response) =>{ 
    error_mensaje = await Funciones.limpiarObjetoError()

    Upload(req, res,async  (error: any) => {
    
        const FilesReq = req.files
        if(error){
            let err = {mensaje: 'No se pudo cambiar imagen de portada esta pagina', descripcion:'Ha sucedido un error al cambiar la imagen de portada'}
            return  Funciones.Http_Error(res, 500, err)
        }
        
        
        if(isNullOrUndefined(FilesReq)  || FilesReq.length === 0){
            let err = {mensaje: 'No se pudo cambiar imagen de portada esta pagina', descripcion:'Ha sucedido un error al cambiar la imagen de portada'}
            return  Funciones.Http_Error(res, 500, err)
        }

        const PageID = req.params.page
        const UserID = req.params.user

        let ValidarID: any
        try {
            ValidarID = await Funciones.validarID(PAGINA, PageID ,{id_usuario: UserID, estado: {$lte: 3}, estadoAdmin: {$lte: 1 }})
            if(!isNullOrUndefined(ValidarID.error))  (error_mensaje.code = 500, error_mensaje.mensaje =  'No se pudo cambiar imagen de portada esta pagina', error_mensaje.descripcion = 'Ha sucedido un error al cambiar la imagen de portada')
            if(!ValidarID.data) (error_mensaje.code = 404,error_mensaje.mensaje = 'No existe esta pagina', error_mensaje.descripcion = 'La pagina que intenta modificar no existe en la plataforma')
            if(error_mensaje.mensaje !== '') throw error_mensaje
            
        } catch (error) {
            await Funciones.eliminarImagenes(FilesReq)
            return  Funciones.Http_Error(res, 500, error)
        }
            
        let pagina: any = ValidarID.data

        let Files: any = []
        if(FilesReq > 1){
            for(let x = 0; x == 0; x++) {
                Files.push(FilesReq[x])
            }

            const imgEliminar = [];
            for(let x = 1; x < FilesReq; x++ ){
                imgEliminar.push(FilesReq[x])
            }

            await Funciones.eliminarImagenes(imgEliminar)

        } else {
            Files = FilesReq
        }

        let Images: any
        if(Files.length > 0) {
            try {
                 
                const ResImages: any = await Funciones.enviarImagenes(pagina._id, `Pagina/user-${pagina.id_usuario}` , Files)
                Images = ResImages.datos
            } catch (error) {
                const errorImage = {
                    mensaje: 'No se pudo cambiar imagen de portada esta pagina',
                    descripcion:'Ha sucedido un error al cambiar la imagen de portada'
                }
                return Funciones.Http_Error(res, 500, errorImage)
            } finally {
                await Funciones.eliminarImagenes(FilesReq)
            }
        }

            
        try {
            var options = {
                method: 'PUT',
                uri: `${URL_BACKEND}/${PREFIJO_SERVER}-Pag-Images-${SUFIJO_SERVER}/upd-page-portada/${PageID}/${UserID}`,
                body: {
                    portada: JSON.stringify(Images[0])
                },
                json: true
            };

            await RP(options)
            res.status(200).json({
                ok:true,
                mensaje:'Se ha cambiado correctamente',
                img: Images[0].img
            })
        } catch (error) {
            if (Files.length > 0) {
                await Funciones.RemoverImagenesServidor(Images)
            }
            error_mensaje.mensaje = 'No se pudo cambiar imagen de portada esta pagina',
            error_mensaje.descripcion = 'Ha sucedido un error al cambiar la imagen de portada'
            return Funciones.Http_Error(res, 500, error_mensaje)

        }

    })

})


module.exports = ROUTER