 
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 9500;
export const HOST = process.env.SERVER_PORT || "http://localhost:4200"

// Prefijo hacer peticiones al backend
export const PREFIJO_SERVER = process.env.PREFIJO_SERVER || 'Ruta_Images';
export const SUFIJO_SERVER = process.env.SUFIJO_SERVER || 'No_Entrar';


export const PREFIJO = process.env.PREFIJO || 'P-M';
export const SUFIJO = process.env.SUFIJO || 'BITERLAB';

export const URI_MONGO = process.env.URI_MONGO || 'mongodb+srv://intermediario:1234@cluster0-aobp0.mongodb.net/test2';

export const URL_SERVIDOR_IMAGES = process.env.URL_SERVIDOR_IMAGES || 'https://dev.pilotpro.info'
export const URL_BACKEND = "http://localhost:5100"