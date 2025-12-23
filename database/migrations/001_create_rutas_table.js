/**
 * Migración 001: Crear tabla de rutas con tarifas 2025
 * Versión: 1
 * Fecha: 2024-12-19
 */

const Migration_001_CreateRutasTable = {
    version: 1,
    name: 'CreateRutasTable',
    description: 'Crea la tabla de rutas con tarifas integradas 2025',

    /**
     * Ejecuta la migración (crear tabla)
     */
    async up(db) {
        console.log('📦 Creando tabla rutas con tarifas 2025...');
        
        // Nota: En IndexedDB, definimos el store
        // En producción MySQL, usar el SQL al final
        
        const rutasData = [
            { id: 1, codigo: 'RUTA 01', nombre: 'URBANO (SIBATE a Calle 26) (1 a 6 Clientes)', tarifa_25m3: 272.967, tarifa_37m3: 318.462, tarifa_45m3: 333.626, activa: true },
            { id: 2, codigo: 'RUTA 02', nombre: 'URBANO NORTE SUBA (Calle 26/ a calle 200) (1 a 6 Clientes)', tarifa_25m3: 333.626, tarifa_37m3: 363.956, tarifa_45m3: 394.286, activa: true },
            { id: 3, codigo: 'RUTA 03', nombre: 'PAQUETERA (ENTREGA CLIENTE) (8 a 12 Clientes)', tarifa_25m3: 480.220, tarifa_37m3: 492.857, tarifa_45m3: 505.495, activa: true },
            { id: 4, codigo: 'RUTA 04', nombre: 'PLATAFORMA ALKOSTO (PAGA DESCARGUE)', tarifa_25m3: 514.341, tarifa_37m3: 528.242, tarifa_45m3: 552.253, activa: true },
            { id: 5, codigo: 'RUTA 05', nombre: 'PLATAFORMA SODIMAC EL ZOL', tarifa_25m3: 568.681, tarifa_37m3: 568.681, tarifa_45m3: 568.681, activa: true },
            { id: 6, codigo: 'RUTA 06', nombre: 'FUNZA - MOSQUERA - MADRID / (incluye entregas en Bogotá)', tarifa_25m3: 435.989, tarifa_37m3: 465.055, tarifa_45m3: 494.121, activa: true },
            { id: 7, codigo: 'RUTA 07', nombre: 'MOSQUERA - MADRID - FACATATIVA', tarifa_25m3: 514.341, tarifa_37m3: 528.242, tarifa_45m3: 528.242, activa: true },
            { id: 8, codigo: 'RUTA 08', nombre: 'ALBAN - SASAIMA - VILLETA - GUADUAS - HONDA', tarifa_25m3: 970.659, tarifa_37m3: 997.253, tarifa_45m3: 997.253, activa: true },
            { id: 9, codigo: 'RUTA 09', nombre: 'SIBERIA - TENJO - EL ROSAL', tarifa_25m3: 421.456, tarifa_37m3: 450.522, tarifa_45m3: 450.522, activa: true },
            { id: 10, codigo: 'RUTA 10', nombre: 'SAN FRANCISCO - LA VEGA - SUPATA - NOCAIMA - VILLETA', tarifa_25m3: 970.659, tarifa_37m3: 997.253, tarifa_45m3: 997.253, activa: true },
            { id: 11, codigo: 'RUTA 11', nombre: 'PTO SALGAR - LA DORADA - HONDA - MARIQUITA - ARMERO - LIBANO', tarifa_25m3: 1692.308, tarifa_37m3: 1692.308, tarifa_45m3: 1752.530, activa: true },
            { id: 12, codigo: 'RUTA 12', nombre: 'MARIQUITA - FRESNO - MANZANARES - MANIZALEZ', tarifa_25m3: 1813.187, tarifa_37m3: 1882.813, tarifa_45m3: 1956.791, activa: true },
            { id: 13, codigo: 'RUTA 13', nombre: 'COTA - CHIA - CAJICA - ZIPAQUIRA O SUBACHOQUE', tarifa_25m3: 491.978, tarifa_37m3: 505.275, tarifa_45m3: 505.275, activa: true },
            { id: 14, codigo: 'RUTA 14', nombre: 'SOPO - TOCANCIPA - GACHANCIPA - CHOCONTA', tarifa_25m3: 543.956, tarifa_37m3: 543.956, tarifa_45m3: 543.956, activa: true },
            { id: 15, codigo: 'RUTA 15', nombre: 'UBATE - CHIQUINQUIRA', tarifa_25m3: 725.275, tarifa_37m3: 725.275, tarifa_45m3: 725.275, activa: true },
            { id: 16, codigo: 'RUTA 16', nombre: 'SOPO - GUASCA - LA CALERA', tarifa_25m3: 664.835, tarifa_37m3: 664.835, tarifa_45m3: 664.835, activa: true },
            { id: 17, codigo: 'RUTA 17', nombre: 'PUENTE NACIONAL - BARBOSA', tarifa_25m3: 967.033, tarifa_37m3: 1027.473, tarifa_45m3: 1027.473, activa: true },
            { id: 18, codigo: 'RUTA 18', nombre: 'TUNJA - PAIPA - DUITAMA - SOGAMOSO O MONIQUIRA', tarifa_25m3: 1223.297, tarifa_37m3: 1245.538, tarifa_45m3: 1245.538, activa: true },
            { id: 19, codigo: 'RUTA 19', nombre: 'VILLA DE LEYVA - RAQUIRA', tarifa_25m3: 1340.791, tarifa_37m3: 1362.308, tarifa_45m3: 1362.308, activa: true },
            { id: 20, codigo: 'RUTA 20', nombre: 'TUNJI - DUITAMA - SOGAMOSO - SOATA', tarifa_25m3: 1390.110, tarifa_37m3: 1668.132, tarifa_45m3: 1668.132, activa: true },
            { id: 21, codigo: 'RUTA 21', nombre: 'SOGAMOSO - SOATA - CAPITANEJO', tarifa_25m3: 1668.132, tarifa_37m3: 1876.648, tarifa_45m3: 1876.648, activa: true },
            { id: 22, codigo: 'RUTA 22', nombre: 'GARAGOA - MONTEREY - AGUAZUL - YOPAL', tarifa_25m3: 2017.582, tarifa_37m3: 2136.264, tarifa_45m3: 2136.264, activa: true },
            { id: 23, codigo: 'RUTA 23', nombre: 'YOPAL - MANI - PORE - PAZ DE ARIPORO', tarifa_25m3: 2136.264, tarifa_37m3: 2254.945, tarifa_45m3: 2254.945, activa: true },
            { id: 24, codigo: 'RUTA 24', nombre: 'VILLAVICENCIO', tarifa_25m3: 1251.099, tarifa_37m3: 1390.110, tarifa_45m3: 1390.110, activa: true },
            { id: 25, codigo: 'RUTA 25', nombre: 'VILLAVICENCIO - RESTREPO - CUMARAL - VILLANUEVA', tarifa_25m3: 1598.626, tarifa_37m3: 1807.143, tarifa_45m3: 1807.143, activa: true },
            { id: 26, codigo: 'RUTA 26', nombre: 'VILLAVICENCIO - ACACIAS - CASTILLA - SAN CARLOS DE GUAROA', tarifa_25m3: 1598.626, tarifa_37m3: 1807.143, tarifa_45m3: 1807.143, activa: true },
            { id: 27, codigo: 'RUTA 27', nombre: 'VILLAVICENCIO - SAN MARTIN - GRANADA - SAN JUAN DE ARAMA', tarifa_25m3: 1807.143, tarifa_37m3: 1807.143, tarifa_45m3: 1807.143, activa: true },
            { id: 28, codigo: 'RUTA 28', nombre: 'VILLAVICENCIO - GRANADA - SAN JOSE DE GUAVIARE', tarifa_25m3: 2136.264, tarifa_37m3: 2254.945, tarifa_45m3: 2254.945, activa: true },
            { id: 29, codigo: 'RUTA 29', nombre: 'VILLAVICENCIO - PUERTO LOPEZ - PUERTO GAITAN', tarifa_25m3: 1807.143, tarifa_37m3: 1807.143, tarifa_45m3: 1946.154, activa: true },
            { id: 30, codigo: 'RUTA 30', nombre: 'SILVANIA - FUSAGASUGA', tarifa_25m3: 514.341, tarifa_37m3: 528.242, tarifa_45m3: 528.242, activa: true },
            { id: 31, codigo: 'RUTA 31', nombre: 'LA MESA - APULO - ANAPOIMA - TOCAIMA - AGUA DE DIOS - RICAURTE', tarifa_25m3: 1014.780, tarifa_37m3: 1014.780, tarifa_45m3: 1014.780, activa: true },
            { id: 32, codigo: 'RUTA 32', nombre: 'GIRARDOT - MELGAR - ESPINAL - IBAGUE', tarifa_25m3: 1251.099, tarifa_37m3: 1329.670, tarifa_45m3: 1329.670, activa: true },
            { id: 33, codigo: 'RUTA 33', nombre: 'IBAGUE - ARMENIA', tarifa_25m3: 1682.033, tarifa_37m3: 1682.033, tarifa_45m3: 1682.033, activa: true },
            { id: 34, codigo: 'RUTA 34', nombre: 'CALI - PUERTO TEJADA', tarifa_25m3: 1840.385, tarifa_37m3: 1967.308, tarifa_45m3: 2094.231, activa: true },
            { id: 35, codigo: 'RUTA 35', nombre: 'NEIVA', tarifa_25m3: 1662.088, tarifa_37m3: 1662.088, tarifa_45m3: 1662.088, activa: true },
            { id: 36, codigo: 'RUTA 36', nombre: 'NEIVA - ORTEGA - CHAPARRAL - GUAMO', tarifa_25m3: 1876.648, tarifa_37m3: 1876.648, tarifa_45m3: 1876.648, activa: true },
            { id: 37, codigo: 'RUTA 37', nombre: 'NEIVA - GARZON', tarifa_25m3: 1904.360, tarifa_37m3: 2038.470, tarifa_45m3: 2038.470, activa: true },
            { id: 38, codigo: 'RUTA 38', nombre: 'NEIVA - GARZON - PITALITO', tarifa_25m3: 2116.462, tarifa_37m3: 2243.077, tarifa_45m3: 2243.077, activa: true },
            { id: 39, codigo: 'RUTA 39', nombre: 'NEIVA - GARZON - LA PLATA - PITALITO', tarifa_25m3: 2219.341, tarifa_37m3: 2349.890, tarifa_45m3: 2349.890, activa: true },
            { id: 40, codigo: 'RUTA 40', nombre: 'NEIVA - GARZON - PITALITO - FLORENCIA', tarifa_25m3: 2489.440, tarifa_37m3: 2492.308, tarifa_45m3: 2492.308, activa: true },
            { id: 41, codigo: 'RUTA 41', nombre: 'NEIVA - GARZON - PITALITO - FLORENCIA - EL DONCELLO', tarifa_25m3: 2610.989, tarifa_37m3: 2666.769, tarifa_45m3: 2689.319, activa: true },
            { id: 42, codigo: 'RUTA 42', nombre: 'PITALITO - FLORENCIA - CARTAGENA DEL CHAIRA', tarifa_25m3: 2967.033, tarifa_37m3: 2967.033, tarifa_45m3: 2967.033, activa: true },
            { id: 43, codigo: 'RUTA 43', nombre: 'DUITAMA - PANTENEJO - MALAGA', tarifa_25m3: 1538.462, tarifa_37m3: 1703.297, tarifa_45m3: 1758.242, activa: true },
            { id: 44, codigo: 'RUTA 44', nombre: 'TUNJA - DUITAMA - SAN GIL - BUCARAMANGA', tarifa_25m3: 1648.352, tarifa_37m3: 1703.297, tarifa_45m3: 1758.242, activa: true },
            { id: 45, codigo: 'RUTA 45', nombre: 'BUCARAMANGA - SAN GIL - FLORIDABLANCA', tarifa_25m3: 1483.516, tarifa_37m3: 1538.462, tarifa_45m3: 1593.407, activa: true },
            { id: 46, codigo: 'RUTA 46', nombre: 'CUCUTA', tarifa_25m3: 2197.802, tarifa_37m3: 2307.692, tarifa_45m3: 2417.582, activa: true },
            { id: 47, codigo: 'RUTA 47', nombre: 'BUCARAMANGA - CUCUTA', tarifa_25m3: 2417.582, tarifa_37m3: 2527.473, tarifa_45m3: 2637.363, activa: true },
            { id: 48, codigo: 'RUTA 48', nombre: 'VALLEDUPAR', tarifa_25m3: 2307.692, tarifa_37m3: 2417.582, tarifa_45m3: 2527.473, activa: true },
            { id: 49, codigo: 'RUTA 49', nombre: 'BARRANQUILLA', tarifa_25m3: 3021.978, tarifa_37m3: 3131.868, tarifa_45m3: 3956.044, activa: true },
            { id: 50, codigo: 'RUTA 50', nombre: 'SANTA MARTA', tarifa_25m3: 2747.253, tarifa_37m3: 2857.143, tarifa_45m3: 3681.319, activa: true },
            { id: 51, codigo: 'RUTA 51', nombre: 'CARTAGENA', tarifa_25m3: 3076.923, tarifa_37m3: 3186.813, tarifa_45m3: 4065.934, activa: true },
            { id: 52, codigo: 'RUTA 52', nombre: 'URIBIA - MAICAO - RIOHACHA', tarifa_25m3: 2989.011, tarifa_37m3: 3087.912, tarifa_45m3: 3934.066, activa: true },
            { id: 53, codigo: 'RUTA 53', nombre: 'VILLAVICENCIO - LEJANIAS - VISTAHERMOSA', tarifa_25m3: 1714.286, tarifa_37m3: 1747.253, tarifa_45m3: 1802.198, activa: true },
            { id: 54, codigo: 'RUTA 54', nombre: 'EL DONCELLO - SAN VICENTE DEL CAGUAN', tarifa_25m3: 3296.703, tarifa_37m3: 3296.703, tarifa_45m3: 3516.484, activa: true },
            { id: 55, codigo: 'ADICIONAL', nombre: 'SOACHA - GUARNE (ANT)', tarifa_25m3: 0, tarifa_37m3: 0, tarifa_45m3: 0, activa: false },
            { id: 56, codigo: 'ADICIONAL', nombre: 'SOACHA - PEREIRA', tarifa_25m3: 1593.407, tarifa_37m3: 1703.297, tarifa_45m3: 1813.187, activa: true },
            { id: 57, codigo: 'ADICIONAL', nombre: 'MANIZALES - SOACHA', tarifa_25m3: 1483.516, tarifa_37m3: 1593.407, tarifa_45m3: 1758.242, activa: true }
        ];

        for (const ruta of rutasData) {
            await db.insert('rutas', ruta);
        }

        console.log(`✓ ${rutasData.length} rutas con tarifas 2025 creadas`);
    },

    /**
     * Revierte la migración (eliminar tabla)
     */
    async down(db) {
        console.log('🔙 Eliminando tabla rutas...');
        await db.clear('rutas');
        console.log('✓ Tabla rutas eliminada');
    }
};

// SQL equivalente para MySQL/PostgreSQL (Producción)
const Migration_001_SQL = `
-- Crear tabla rutas con tarifas integradas
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE COMMENT 'Código de ruta (RUTA 01, RUTA 02, etc.)',
    nombre VARCHAR(255) NOT NULL COMMENT 'Descripción completa de la ruta',
    tarifa_25m3 DECIMAL(10,3) NOT NULL DEFAULT 0 COMMENT 'Tarifa para camión de 25m³',
    tarifa_37m3 DECIMAL(10,3) NOT NULL DEFAULT 0 COMMENT 'Tarifa para camión de 37m³',
    tarifa_45m3 DECIMAL(10,3) NOT NULL DEFAULT 0 COMMENT 'Tarifa para camión de 45m³',
    activa BOOLEAN DEFAULT TRUE COMMENT 'Si la ruta está activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar todas las rutas con tarifas 2025
INSERT INTO rutas (id, codigo, nombre, tarifa_25m3, tarifa_37m3, tarifa_45m3, activa) VALUES
(1, 'RUTA 01', 'URBANO (SIBATE a Calle 26) (1 a 6 Clientes)', 272.967, 318.462, 333.626, TRUE),
(2, 'RUTA 02', 'URBANO NORTE SUBA (Calle 26/ a calle 200) (1 a 6 Clientes)', 333.626, 363.956, 394.286, TRUE),
(3, 'RUTA 03', 'PAQUETERA (ENTREGA CLIENTE) (8 a 12 Clientes)', 480.220, 492.857, 505.495, TRUE),
-- ... (todas las rutas)
(57, 'ADICIONAL', 'MANIZALES - SOACHA', 1483.516, 1593.407, 1758.242, TRUE);
`;

// Exportar para uso en el sistema
const migration_001 = Migration_001_CreateRutasTable;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Migration_001_CreateRutasTable, Migration_001_SQL, migration_001 };
}
