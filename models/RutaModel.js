/**
 * Modelo de Ruta
 * Gestiona los datos y lógica de negocio de las rutas de transporte
 * Tarifas 2025
 */

class RutaModel {
    constructor(db = null) {
        this.db = db; // DatabaseAdapter (IndexedDB)
        this.rutasCache = null; // Cache local
        // Solo 6 rutas iniciales (Fallback si no hay BD)
        this.rutasFallback = [
            { 
                id: 1, 
                codigo: 'RUTA 01', 
                nombre: 'URBANO (SIBATE a Calle 26) (1 a 6 Clientes)', 
                tarifa_25m3: 272.967, 
                tarifa_37m3: 318.462, 
                tarifa_45m3: 333.626,
                destinos: [
                    { nombre: 'Sibate (Inicio)', distancia: 0 },
                    { nombre: 'Soacha', distancia: 15 },
                    { nombre: 'Autopista Sur Km 5', distancia: 25 },
                    { nombre: 'Calle 26 (Final)', distancia: 35 }
                ]
            },
            { 
                id: 2, 
                codigo: 'RUTA 02', 
                nombre: 'URBANO NORTE SUBA (Calle 26/ a calle 200) (1 a 6 Clientes)', 
                tarifa_25m3: 333.626, 
                tarifa_37m3: 363.956, 
                tarifa_45m3: 394.286,
                destinos: [
                    { nombre: 'Calle 26 (Inicio)', distancia: 0 },
                    { nombre: 'Calle 80', distancia: 12 },
                    { nombre: 'Calle 127', distancia: 20 },
                    { nombre: 'Calle 170', distancia: 28 },
                    { nombre: 'Calle 200 (Final)', distancia: 35 }
                ]
            },
            { id: 3, codigo: 'RUTA 03', nombre: 'PAQUETERA (ENTREGA CLIENTE) (8 a 12 Clientes)', tarifa_25m3: 480.220, tarifa_37m3: 492.857, tarifa_45m3: 505.495, destinos: [{ nombre: 'Zona Urbana', distancia: 25 }] },
            { id: 4, codigo: 'RUTA 04', nombre: 'PLATAFORMA ALKOSTO (PAGA DESCARGUE)', tarifa_25m3: 514.341, tarifa_37m3: 528.242, tarifa_45m3: 552.253, destinos: [{ nombre: 'Plataforma Alkosto', distancia: 30 }] },
            { id: 5, codigo: 'RUTA 05', nombre: 'PLATAFORMA SODIMAC EL ZOL', tarifa_25m3: 568.681, tarifa_37m3: 568.681, tarifa_45m3: 568.681, destinos: [{ nombre: 'Sodimac El Zol', distancia: 35 }] },
            { id: 6, codigo: 'RUTA 06', nombre: 'FUNZA - MOSQUERA - MADRID / (incluye entregas en Bogotá)', tarifa_25m3: 435.989, tarifa_37m3: 465.055, tarifa_45m3: 494.121, destinos: [ { nombre: 'Bogotá', distancia: 0 }, { nombre: 'Funza', distancia: 18 }, { nombre: 'Mosquera', distancia: 22 }, { nombre: 'Madrid', distancia: 30 } ] }
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
