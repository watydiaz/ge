/**
 * Modelo de Ruta
 * Gestiona los datos y lógica de negocio de las rutas de transporte
 * Tarifas 2025
 */

class RutaModel {
        /**
         * Obtiene una ruta por su ID (asíncrono, para compatibilidad con controladores)
         */
        async obtenerRutaPorId(id) {
            // Si tuvieras BD, aquí iría la consulta asíncrona
            // Por ahora usa el fallback sincrónico
            return this.obtenerRutaPorIdSync(id);
        }
    constructor(db = null) {
        this.db = db; // DatabaseAdapter (IndexedDB)
        this.rutasCache = null; // Cache local
        // Rutas y tarifas completas (tabla del usuario)
        this.rutasFallback = [
            {id:1, codigo:'RUTA 01', nombre:'URBANO (SIBATE a Calle 26) (1 a 6 Clientes)', tarifa_25m3:272967, tarifa_37m3:318462, tarifa_45m3:333626, destinos:[]},
            {id:2, codigo:'RUTA 02', nombre:'URBANO NORTE SUBA (Calle 26/ a calle 200) (1 a 6 Clientes)', tarifa_25m3:333626, tarifa_37m3:363956, tarifa_45m3:394286, destinos:[]},
            {id:3, codigo:'RUTA 03', nombre:'PAQUETERA (ENTREGA CLIENTE) (8 a 12 Clientes)', tarifa_25m3:480220, tarifa_37m3:492857, tarifa_45m3:505495, destinos:[]},
            {id:4, codigo:'RUTA 04', nombre:'PLATAFORMA ALKOSTO (PAGA DESCARGUE)', tarifa_25m3:514341, tarifa_37m3:528242, tarifa_45m3:552253, destinos:[]},
            {id:5, codigo:'RUTA 05', nombre:'PLATAFORMA SODIMAC EL ZOL', tarifa_25m3:568681, tarifa_37m3:568681, tarifa_45m3:568681, destinos:[]},
            {id:6, codigo:'RUTA 06', nombre:'FUNZA - MOSQUERA - MADRID / (incluye entregas en Bogotá)', tarifa_25m3:435989, tarifa_37m3:465055, tarifa_45m3:494121, destinos:[]},
            {id:7, codigo:'RUTA 07', nombre:'MOSQUERA - MADRID - FACATATIVA', tarifa_25m3:514341, tarifa_37m3:528242, tarifa_45m3:528242, destinos:[]},
            {id:8, codigo:'RUTA 08', nombre:'ALBAN - SASAIMA - VILLETA - GUADUAS - HONDA', tarifa_25m3:970659, tarifa_37m3:997253, tarifa_45m3:997253, destinos:[]},
            {id:9, codigo:'RUTA 09', nombre:'SIBERIA - TENJO - EL ROSAL', tarifa_25m3:421456, tarifa_37m3:450522, tarifa_45m3:450522, destinos:[]},
            {id:10, codigo:'RUTA 10', nombre:'SAN FRANCISCO - LA VEGA - SUPATA - NOCAIMA - VILLETA', tarifa_25m3:970659, tarifa_37m3:997253, tarifa_45m3:997253, destinos:[]},
            {id:11, codigo:'RUTA 11', nombre:'PTO SALGAR - LA DORADA - HONDA - MARIQUITA - ARMERO - LIBANO', tarifa_25m3:1692308, tarifa_37m3:1692936, tarifa_45m3:1752530, destinos:[]},
            {id:12, codigo:'RUTA 12', nombre:'MARIQUITA - FRESNO - MANZANARES - MANIZALEZ', tarifa_25m3:1813187, tarifa_37m3:1882813, tarifa_45m3:1956791, destinos:[]},
            {id:13, codigo:'RUTA 13', nombre:'COTA - CHIA - CAJICA - ZIPAQUIRA O SUBACHOQUE', tarifa_25m3:491978, tarifa_37m3:505275, tarifa_45m3:505275, destinos:[]},
            {id:14, codigo:'RUTA 14', nombre:'SOPO - TOCANCIPA - GACHANCIPA - CHOCONTA', tarifa_25m3:543956, tarifa_37m3:543956, tarifa_45m3:543956, destinos:[]},
            {id:15, codigo:'RUTA 15', nombre:'UBATE - CHIQUINQUIRA', tarifa_25m3:725275, tarifa_37m3:725275, tarifa_45m3:725275, destinos:[]},
            {id:16, codigo:'RUTA 16', nombre:'SOPO - GUASCA - LA CALERA', tarifa_25m3:664835, tarifa_37m3:664835, tarifa_45m3:664835, destinos:[]},
            {id:17, codigo:'RUTA 17', nombre:'PUENTE NACIONAL - BARBOSA', tarifa_25m3:967033, tarifa_37m3:1027473, tarifa_45m3:1027473, destinos:[]},
            {id:18, codigo:'RUTA 18', nombre:'TUNJA - PAIPA - DUITAMA - SOGAMOSO O MONIQUIRA', tarifa_25m3:1223297, tarifa_37m3:1245538, tarifa_45m3:1245538, destinos:[]},
            {id:19, codigo:'RUTA 19', nombre:'VILLA DE LEYVA - RAQUIRA', tarifa_25m3:1340791, tarifa_37m3:1362308, tarifa_45m3:1362308, destinos:[]},
            {id:20, codigo:'RUTA 20', nombre:'TUNJA - DUITAMA - SOGAMOSO - SOATA', tarifa_25m3:1390110, tarifa_37m3:1668132, tarifa_45m3:1668132, destinos:[]},
            {id:21, codigo:'RUTA 21', nombre:'SOGAMOSO - SOATA - CAPITANEJO', tarifa_25m3:1668132, tarifa_37m3:1876648, tarifa_45m3:1876648, destinos:[]},
            {id:22, codigo:'RUTA 22', nombre:'GARAGOA - MONTEREY - AGUAZUL - YOPAL', tarifa_25m3:2017582, tarifa_37m3:2136264, tarifa_45m3:2136264, destinos:[]},
            {id:23, codigo:'RUTA 23', nombre:'YOPAL - MANI - PORE - PAZ DE ARIPORO', tarifa_25m3:2136264, tarifa_37m3:2254945, tarifa_45m3:2254945, destinos:[]},
            {id:24, codigo:'RUTA 24', nombre:'VILLAVICENCIO', tarifa_25m3:1251099, tarifa_37m3:1390110, tarifa_45m3:1390110, destinos:[]},
            {id:25, codigo:'RUTA 25', nombre:'VILLAVICENCIO - RESTREPO - CUMARAL - VILLANUEVA', tarifa_25m3:1598626, tarifa_37m3:1807143, tarifa_45m3:1807143, destinos:[]},
            {id:26, codigo:'RUTA 26', nombre:'VILLAVICENCIO - ACACIAS - CASTILLA - SAN CARLOS DE GUAROA', tarifa_25m3:1598626, tarifa_37m3:1807143, tarifa_45m3:1807143, destinos:[]},
            {id:27, codigo:'RUTA 27', nombre:'VILLAVICENCIO - SAN MARTIN - GRANADA - SAN JUAN DE ARAMA', tarifa_25m3:1807143, tarifa_37m3:1807143, tarifa_45m3:1807143, destinos:[]},
            {id:28, codigo:'RUTA 28', nombre:'VILLAVICENCIO - GRANADA- SAN JOSE DE GUAVIARE', tarifa_25m3:2136264, tarifa_37m3:2254945, tarifa_45m3:2254945, destinos:[]},
            {id:29, codigo:'RUTA 29', nombre:'VILLAVICENCIO - PUERTO LOPEZ - PUERTO GAITAN', tarifa_25m3:1807143, tarifa_37m3:1807143, tarifa_45m3:1946154, destinos:[]},
            {id:30, codigo:'RUTA 30', nombre:'SILVANIA - FUSAGASUGA', tarifa_25m3:514341, tarifa_37m3:528242, tarifa_45m3:528242, destinos:[]},
            {id:31, codigo:'RUTA 31', nombre:'LA MESA - APULO - ANAPOIMA - TOCAIMA - AGUA DE DIOS - RICAURTE', tarifa_25m3:1014780, tarifa_37m3:1014780, tarifa_45m3:1014780, destinos:[]},
            {id:32, codigo:'RUTA 32', nombre:'GIRARDOT - MELGAR - ESPINAL- IBAGUE', tarifa_25m3:1251099, tarifa_37m3:1329670, tarifa_45m3:1329670, destinos:[]},
            {id:33, codigo:'RUTA 33', nombre:'IBAGUE - ARMENIA', tarifa_25m3:1682033, tarifa_37m3:1682033, tarifa_45m3:1682033, destinos:[]},
            {id:34, codigo:'RUTA 34', nombre:'CALI - PUERTO TEJADA', tarifa_25m3:1840385, tarifa_37m3:1967308, tarifa_45m3:2094231, destinos:[]},
            {id:35, codigo:'RUTA 35', nombre:'NEIVA', tarifa_25m3:1662088, tarifa_37m3:1662088, tarifa_45m3:1662088, destinos:[]},
            {id:36, codigo:'RUTA 36', nombre:'NEIVA - ORTEGA - CHAPARRAL - GUAMO', tarifa_25m3:1876648, tarifa_37m3:1876648, tarifa_45m3:1876648, destinos:[]},
            {id:37, codigo:'RUTA 37', nombre:'NEIVA - GARZON', tarifa_25m3:1904360, tarifa_37m3:2038470, tarifa_45m3:2038470, destinos:[]},
            {id:38, codigo:'RUTA 38', nombre:'NEIVA - GARZON - PITALITO', tarifa_25m3:2118462, tarifa_37m3:2243077, tarifa_45m3:2243077, destinos:[]},
            {id:39, codigo:'RUTA 39', nombre:'NEIVA - GARZON - LA PLATA - PITALITO', tarifa_25m3:2219341, tarifa_37m3:2349890, tarifa_45m3:2349890, destinos:[]},
            {id:40, codigo:'RUTA 40', nombre:'NEIVA - GARZON - PITALITO - FLORENCIA', tarifa_25m3:2480440, tarifa_37m3:2492308, tarifa_45m3:2492308, destinos:[]},
            {id:41, codigo:'RUTA 41', nombre:'NEIVA - GARZON - PITALITO - FLORENCIA - EL DONCELLO', tarifa_25m3:2610989, tarifa_37m3:2666769, tarifa_45m3:2689319, destinos:[]},
            {id:42, codigo:'RUTA 42', nombre:'PITALITO - FLORENCIA - CARTAGENA DEL CHAIRA', tarifa_25m3:2967033, tarifa_37m3:2967033, tarifa_45m3:2967033, destinos:[]},
            {id:43, codigo:'RUTA 43', nombre:'DUITAMA - CAPITANEJO - MALAGA', tarifa_25m3:1538462, tarifa_37m3:1703297, tarifa_45m3:1758242, destinos:[]},
            {id:44, codigo:'RUTA 44', nombre:'TUNJA - DUITAMA - SAN GIL - BUCARAMANGA', tarifa_25m3:1648352, tarifa_37m3:1703297, tarifa_45m3:1758242, destinos:[]},
            {id:45, codigo:'RUTA 45', nombre:'BUCARAMANGA - SAN GIL - FLORIDABLANCA', tarifa_25m3:1483516, tarifa_37m3:1538462, tarifa_45m3:1593407, destinos:[]},
            {id:46, codigo:'RUTA 46', nombre:'CUCUTA', tarifa_25m3:2197802, tarifa_37m3:2307692, tarifa_45m3:2417582, destinos:[]},
            {id:47, codigo:'RUTA 47', nombre:'BUCARAMANGA - CUCUTA', tarifa_25m3:2417582, tarifa_37m3:2527473, tarifa_45m3:2637363, destinos:[]},
            {id:48, codigo:'RUTA 48', nombre:'VALLEDUPAR', tarifa_25m3:2307692, tarifa_37m3:2417582, tarifa_45m3:2527473, destinos:[]},
            {id:49, codigo:'RUTA 49', nombre:'BARRANQUILLA', tarifa_25m3:3021978, tarifa_37m3:3131868, tarifa_45m3:3956044, destinos:[]},
            {id:50, codigo:'RUTA 50', nombre:'SANTA MARTA', tarifa_25m3:2747253, tarifa_37m3:2857143, tarifa_45m3:3681319, destinos:[]},
            {id:51, codigo:'RUTA 51', nombre:'CARTAGENA', tarifa_25m3:3076923, tarifa_37m3:3186813, tarifa_45m3:4065934, destinos:[]},
            {id:52, codigo:'RUTA 52', nombre:'URIBIA - MAICAO - RIOHACHA', tarifa_25m3:2989011, tarifa_37m3:3087912, tarifa_45m3:3934066, destinos:[]},
            {id:53, codigo:'RUTA 53', nombre:'VILLAVICENCIO - LEJANIAS - VISTAHERMOSA', tarifa_25m3:1714286, tarifa_37m3:1747253, tarifa_45m3:1802198, destinos:[]},
            {id:54, codigo:'RUTA 54', nombre:'EL DONCELLLO - SAN VICENTE DEL CAGUAN', tarifa_25m3:null, tarifa_37m3:null, tarifa_45m3:1978022, destinos:[]},
            {id:55, codigo:'SOACHA - GUARNE (ANT)', nombre:'SOACHA - GUARNE (ANT)', tarifa_25m3:1593407, tarifa_37m3:1703297, tarifa_45m3:1813187, destinos:[]},
            {id:56, codigo:'SOACHA - PEREIRA', nombre:'SOACHA - PEREIRA', tarifa_25m3:1483516, tarifa_37m3:1593407, tarifa_45m3:1758242, destinos:[]},
            {id:57, codigo:'MANIZALES - SOACHA', nombre:'MANIZALES - SOACHA', tarifa_25m3:0, tarifa_37m3:0, tarifa_45m3:0, destinos:[]}
        ];
    }

    /**
     * Calcula la distancia total de una ruta
     * @param {number} rutaId
     * @returns {number} distancia total en km
     */
    calcularDistanciaTotal(rutaId) {
        const ruta = this.obtenerRutaPorIdSync(rutaId);
        if (!ruta || !ruta.destinos || ruta.destinos.length < 2) return 0;
        const destinos = ruta.destinos;
        return destinos[destinos.length - 1].distancia - destinos[0].distancia;
    }

    /**
     * Calcula la distancia parcial hasta un destino intermedio o fraccionario
     * @param {number} rutaId
     * @param {string} destinoNombre - nombre del destino o punto intermedio
     * @param {number} fraccion - valor entre 0 y 1 para mitad, cuarto, etc. (opcional)
     */
    calcularDistanciaParcial(rutaId, destinoNombre, fraccion = null) {
        const ruta = this.obtenerRutaPorIdSync(rutaId);
        if (!ruta || !ruta.destinos) return 0;
        const destinos = ruta.destinos;
        if (fraccion !== null) {
            // Distancia fraccionaria (ej: mitad de la ruta)
            const total = this.calcularDistanciaTotal(rutaId);
            return total * fraccion;
        }
        // Buscar el destino por nombre
        const destino = destinos.find(d => d.nombre === destinoNombre);
        if (!destino) return 0;
        // Distancia desde el inicio hasta ese destino
        return destino.distancia - destinos[0].distancia;
    }

    /**
     * Asigna un pedido a un destino específico dentro de la ruta
     * @param {Object} pedido - { id, clienteId, productos: [], destinoNombre }
     * @param {number} rutaId
     * @returns {Object} pedido con info de distancia
     */
    asignarPedidoADestino(pedido, rutaId) {
        const distancia = this.calcularDistanciaParcial(rutaId, pedido.destinoNombre);
        return { ...pedido, distanciaAsignada: distancia };
    }

    /**
     * Calcula los costos para un cliente según distancia, peso y volumen
     * @param {Object[]} pedidos - array de pedidos del cliente (cada uno con productos, destino, etc)
     * @param {number} rutaId
     * @param {number} tarifaBase - tarifa de la ruta según tipo de camión
     * @returns {Object} costos: { totalDistancia, totalPeso, totalVolumen, costoPorDistancia, costoPorPeso, costoPorVolumen }
     */
    calcularCostosPorCliente(pedidos, rutaId, tarifaBase) {
        // Sumar distancias, peso y volumen de todos los pedidos
        let totalDistancia = 0, totalPeso = 0, totalVolumen = 0;
        pedidos.forEach(pedido => {
            const distancia = this.calcularDistanciaParcial(rutaId, pedido.destinoNombre);
            totalDistancia += distancia;
            pedido.productos.forEach(prod => {
                totalPeso += prod.peso || 0;
                totalVolumen += prod.volumen || 0;
            });
        });
        // Cálculo simple: proporcionalidad
        // Costo por distancia: proporcional a la distancia recorrida respecto al total de la ruta
        const distanciaRuta = this.calcularDistanciaTotal(rutaId);
        const costoPorDistancia = distanciaRuta > 0 ? (totalDistancia / distanciaRuta) * tarifaBase : 0;
        // Costo por peso y volumen: proporcional al total de cada uno respecto al total de todos los pedidos (esto requiere datos globales)
        // Aquí solo se retorna el total, el cálculo global se hace en el controlador
        return {
            totalDistancia,
            totalPeso,
            totalVolumen,
            costoPorDistancia,
            costoPorPeso: totalPeso, // El cálculo real se hace fuera
            costoPorVolumen: totalVolumen // El cálculo real se hace fuera
        };
    }

    /**
     * Obtiene todas las rutas disponibles
     * Prioriza BD, sino usa datos hardcodeados
     */
    async obtenerRutas() {
        // Si hay BD, usar datos de BD (no implementado aquí)
        // Fallback: usar rutasFallback
        return this.rutasFallback;
    }

    /**
     * Calcula la distancia total de una ruta
     * @param {number} rutaId
     * @returns {number} distancia total en km
     */
    calcularDistanciaTotal(rutaId) {
        const ruta = this.obtenerRutaPorIdSync(rutaId);
        if (!ruta || !ruta.destinos || ruta.destinos.length < 2) return 0;
        const destinos = ruta.destinos;
        return destinos[destinos.length - 1].distancia - destinos[0].distancia;
    }

    /**
     * Calcula la distancia parcial hasta un destino intermedio o fraccionario
     * @param {number} rutaId
     * @param {string} destinoNombre - nombre del destino o punto intermedio
     * @param {number} fraccion - valor entre 0 y 1 para mitad, cuarto, etc. (opcional)
     */
    calcularDistanciaParcial(rutaId, destinoNombre, fraccion = null) {
        const ruta = this.obtenerRutaPorIdSync(rutaId);
        if (!ruta || !ruta.destinos) return 0;
        const destinos = ruta.destinos;
        if (fraccion !== null) {
            // Distancia fraccionaria (ej: mitad de la ruta)
            const total = this.calcularDistanciaTotal(rutaId);
            return total * fraccion;
        }
        // Buscar el destino por nombre
        const destino = destinos.find(d => d.nombre === destinoNombre);
        if (!destino) return 0;
        // Distancia desde el inicio hasta ese destino
        return destino.distancia - destinos[0].distancia;
    }

    /**
     * Asigna un pedido a un destino específico dentro de la ruta
     * @param {Object} pedido - { id, clienteId, productos: [], destinoNombre }
     * @param {number} rutaId
     * @returns {Object} pedido con info de distancia
     */
    asignarPedidoADestino(pedido, rutaId) {
        const distancia = this.calcularDistanciaParcial(rutaId, pedido.destinoNombre);
        return { ...pedido, distanciaAsignada: distancia };
    }

    /**
     * Calcula los costos para un cliente según distancia, peso y volumen
     * @param {Object[]} pedidos - array de pedidos del cliente (cada uno con productos, destino, etc)
     * @param {number} rutaId
     * @param {number} tarifaBase - tarifa de la ruta según tipo de camión
     * @returns {Object} costos: { totalDistancia, totalPeso, totalVolumen, costoPorDistancia, costoPorPeso, costoPorVolumen }
     */
    calcularCostosPorCliente(pedidos, rutaId, tarifaBase) {
        // Sumar distancias, peso y volumen de todos los pedidos
        let totalDistancia = 0, totalPeso = 0, totalVolumen = 0;
        pedidos.forEach(pedido => {
            const distancia = this.calcularDistanciaParcial(rutaId, pedido.destinoNombre);
            totalDistancia += distancia;
            pedido.productos.forEach(prod => {
                totalPeso += prod.peso || 0;
                totalVolumen += prod.volumen || 0;
            });
        });
        // Cálculo simple: proporcionalidad
        // Costo por distancia: proporcional a la distancia recorrida respecto al total de la ruta
        const distanciaRuta = this.calcularDistanciaTotal(rutaId);
        const costoPorDistancia = distanciaRuta > 0 ? (totalDistancia / distanciaRuta) * tarifaBase : 0;
        // Costo por peso y volumen: proporcional al total de cada uno respecto al total de todos los pedidos (esto requiere datos globales)
        // Aquí solo se retorna el total, el cálculo global se hace en el controlador
        return {
            totalDistancia,
            totalPeso,
            totalVolumen,
            costoPorDistancia,
            costoPorPeso: totalPeso, // El cálculo real se hace fuera
            costoPorVolumen: totalVolumen // El cálculo real se hace fuera
        };
    }

    /**
     * Obtiene todas las rutas disponibles
     * Prioriza BD, sino usa datos hardcodeados
     */
    async obtenerRutas() {
        // Si hay BD, usar datos de BD (no implementado aquí)
        // Fallback: usar rutasFallback
        return this.rutasFallback;
    }

    /**
     * Obtiene todas las rutas disponibles (sincrónico)
     * @returns {Array} array de rutas
     */
    obtenerRutasSync() {
        if (this.rutasCache) {
            return this.rutasCache;
        }
        return this.rutasFallback;
    }

    /**
     * Obtiene una ruta por su ID (sincrónico)
     * @param {number} id
     * @returns {Object} ruta
     */
    obtenerRutaPorIdSync(id) {
        const rutas = this.obtenerRutasSync();
        return rutas.find(ruta => ruta.id === parseInt(id));
    }

    /**
     * Obtiene la tarifa de forma síncrona (desde cache)
     */
    obtenerTarifaSync(rutaId, tipoCamion) {
        const ruta = this.obtenerRutaPorIdSync(rutaId);
        if (!ruta) {
            throw new Error('Ruta no encontrada');
        }

        // Convertir a número si viene como string
        const capacidad = parseInt(tipoCamion);

        switch(capacidad) {
            case 25: 
                return ruta.tarifa_25m3;
            case 37: 
                return ruta.tarifa_37m3;
            case 45: 
                return ruta.tarifa_45m3;
            default: 
                throw new Error(`Tipo de camión no válido: ${tipoCamion}`);
        }
    }

    /**
     * Obtiene el nombre de una ruta
     */
    async obtenerNombreRuta(rutaId) {
        const ruta = await this.obtenerRutaPorId(rutaId);
        return ruta ? ruta.nombre : null;
    }

    /**
     * Carga inicial: obtiene rutas de BD y las cachea
     */
    async cargarRutas() {
        const rutas = await this.obtenerRutas();
        console.log(`✅ RutaModel cargado: ${rutas.length} rutas disponibles`);
        return rutas;
    }

    /**
     * Obtiene la distancia (no implementado aún, retorna valor por defecto)
     */
    obtenerDistanciaMaxima(rutaId) {
        // Por ahora retorna distancia estándar
        // Se implementará cuando se agreguen destinos
        return 500; // km
    }
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RutaModel;
}
