/**
 * Modelo de Ruta
 * Gestiona los datos y lógica de negocio de las rutas de transporte
 */

class RutaModel {
    constructor() {
        this.rutas = [
            {
                id: 1,
                nombre: "Bogotá - Medellín",
                destinos: [
                    { nombre: "Medellín", distancia: 415, porDefecto: true },
                    { nombre: "Envigado", distancia: 420, porDefecto: true },
                    { nombre: "Itagüí", distancia: 418, porDefecto: true }
                ],
                tarifas: {
                    25: 850000,  // Camión de 25 m³
                    37: 1200000, // Camión de 37 m³
                    45: 1450000  // Camión de 45 m³
                }
            },
            {
                id: 2,
                nombre: "Bogotá - Cali",
                destinos: [
                    { nombre: "Cali", distancia: 510, porDefecto: true },
                    { nombre: "Palmira", distancia: 530, porDefecto: true },
                    { nombre: "Yumbo", distancia: 515, porDefecto: true }
                ],
                tarifas: {
                    25: 950000,
                    37: 1350000,
                    45: 1650000
                }
            },
            {
                id: 3,
                nombre: "Bogotá - Barranquilla",
                destinos: [
                    { nombre: "Barranquilla", distancia: 998, porDefecto: true },
                    { nombre: "Soledad", distancia: 1005, porDefecto: true },
                    { nombre: "Malambo", distancia: 1010, porDefecto: true }
                ],
                tarifas: {
                    25: 1400000,
                    37: 1900000,
                    45: 2300000
                }
            },
            {
                id: 4,
                nombre: "Bogotá - Bucaramanga",
                destinos: [
                    { nombre: "Bucaramanga", distancia: 395, porDefecto: true },
                    { nombre: "Floridablanca", distancia: 400, porDefecto: true },
                    { nombre: "Girón", distancia: 403, porDefecto: true }
                ],
                tarifas: {
                    25: 800000,
                    37: 1150000,
                    45: 1400000
                }
            },
            {
                id: 5,
                nombre: "Medellín - Cali",
                destinos: [
                    { nombre: "Cali", distancia: 450, porDefecto: true },
                    { nombre: "Palmira", distancia: 470, porDefecto: true }
                ],
                tarifas: {
                    25: 900000,
                    37: 1250000,
                    45: 1550000
                }
            }
        ];
    }

    /**
     * Obtiene todas las rutas disponibles
     */
    obtenerRutas() {
        return this.rutas;
    }

    /**
     * Obtiene una ruta por su ID
     */
    obtenerRutaPorId(id) {
        return this.rutas.find(r => r.id === id);
    }

    /**
     * Agrega un nuevo destino a una ruta
     */
    agregarDestino(rutaId, destino) {
        const ruta = this.obtenerRutaPorId(rutaId);
        if (!ruta) {
            throw new Error('Ruta no encontrada');
        }

        // Verificar si el destino ya existe
        const existeDestino = ruta.destinos.find(d => 
            d.nombre.toLowerCase() === destino.nombre.toLowerCase()
        );

        if (existeDestino) {
            throw new Error('Este destino ya existe en la ruta');
        }

        const nuevoDestino = {
            nombre: destino.nombre,
            distancia: destino.distancia,
            porDefecto: false
        };

        ruta.destinos.push(nuevoDestino);
        return nuevoDestino;
    }

    /**
     * Obtiene la tarifa de una ruta para un tipo de camión específico
     */
    obtenerTarifa(rutaId, capacidadCamion) {
        const ruta = this.obtenerRutaPorId(rutaId);
        if (!ruta) {
            throw new Error('Ruta no encontrada');
        }

        return ruta.tarifas[capacidadCamion];
    }

    /**
     * Obtiene la distancia máxima de una ruta
     */
    obtenerDistanciaMaxima(rutaId) {
        const ruta = this.obtenerRutaPorId(rutaId);
        if (!ruta) {
            throw new Error('Ruta no encontrada');
        }

        return Math.max(...ruta.destinos.map(d => d.distancia));
    }
}
