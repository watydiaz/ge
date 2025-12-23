// Ejemplo de inicialización y prueba de distancia real
// Requiere: npm install axios

const RutaModel = require('./models/RutaModel');

// Instancia del modelo (sin BD para ejemplo)
const rutaModel = new RutaModel();

// Pega aquí tu API key de ORS
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjNmNThiNmE1MTBmODRiNTdhMjM1ZWU4YmY4NDllNGEzIiwiaCI6Im11cm11cjY0In0=';

// Inicializa el servicio de distancias reales
rutaModel.setORSDistanceService(ORS_API_KEY);

// Ejemplo: coordenadas de Soacha y Villavicencio
const soacha = [-74.2144, 4.5793]; // [long, lat]
const villavicencio = [-73.6352, 4.1533]; // [long, lat]

async function testDistancia() {
    try {
        const distanciaKm = await rutaModel.obtenerDistanciaReal(soacha, villavicencio);
        console.log(`Distancia real Soacha - Villavicencio: ${distanciaKm.toFixed(2)} km`);
    } catch (err) {
        console.error('Error consultando distancia:', err.message);
    }
}

// Ejecuta la prueba
if (require.main === module) {
    testDistancia();
}
