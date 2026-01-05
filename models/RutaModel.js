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
            {id:8, codigo:'RUTA 08', nombre:'ALBAN - SASAIMA - VILLETA - GUADUAS - HONDA', tarifa_25m3:970659, tarifa_37m3:997253, tarifa_45m3:997253},
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
     * Obtiene la tarifa de flete según tipo de camión para una ruta
     * @param {number} rutaId
     * @param {number} tipoCamion - capacidad en m3 (25, 37, 45)
     * @returns {number} tarifa
     */
    obtenerTarifaPorTipoCamion(rutaId, tipoCamion) {
        const ruta = this.obtenerRutaPorIdSync(rutaId);
        if (!ruta) return 0;
        switch (tipoCamion) {
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
