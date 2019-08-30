// ====================== Vehiculos ====================
    const VEHICULO = require('../Routers/vehiculos/vehiculo')

    // ======== Vehiculos publicados ===========
        const VEHICULO_DEALER = require('../Routers/vehiculos/dealer/vehiculo_dealer')
        const VEHICULO_RENTA = require('../Routers/vehiculos/renta/vehiculo_renta')
        
// ====================== Paginas ====================
    const PAGINA = require('../Routers/paginas/pagina')






const RUTAS = {
    VEHICULO,
    VEHICULO_DEALER,
    VEHICULO_RENTA,
    PAGINA
}


export default RUTAS

