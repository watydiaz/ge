// Servicio para consultar distancias reales usando OpenRouteService
// Requiere instalar axios: npm install axios

const axios = require('axios');

class ORSDistanceService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
    }

    /**
     * Obtiene la distancia en km entre dos ubicaciones (direcciones o coordenadas)
     * @param {Array} from [long, lat] o string dirección
     * @param {Array} to [long, lat] o string dirección
     * @returns {Promise<number>} Distancia en kilómetros
     */
    async getDistance(from, to) {
        // Si recibe strings, deberías geocodificar antes (no implementado aquí)
        if (!Array.isArray(from) || !Array.isArray(to)) {
            throw new Error('Se requieren coordenadas [long, lat] para ambos puntos');
        }
        const url = `${this.baseUrl}?api_key=${this.apiKey}`;
        const body = {
            coordinates: [from, to]
        };
        try {
            const response = await axios.post(url, body, {
                headers: { 'Content-Type': 'application/json' }
            });
            const distanciaMetros = response.data.features[0].properties.summary.distance;
            return distanciaMetros / 1000; // km
        } catch (error) {
            console.error('Error consultando ORS:', error.response?.data || error.message);
            throw error;
        }
    }
}

module.exports = ORSDistanceService;
