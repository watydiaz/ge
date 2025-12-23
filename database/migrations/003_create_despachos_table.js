/**
 * Migración 003: Crear tabla de despachos
 * Versión: 3
 * Fecha: 2024-12-19
 */

const Migration_003_CreateDespachosTable = {
    version: 3,
    name: 'CreateDespachosTable',
    description: 'Crea la tabla de despachos con relaciones a rutas y camiones',

    async up(db) {
        console.log('📦 Creando tabla despachos...');
        
        // En IndexedDB la tabla ya existe por config
        // Aquí solo dejamos la estructura lista
        
        console.log('✓ Tabla despachos lista');
    },

    async down(db) {
        console.log('🔙 Eliminando tabla despachos...');
        await db.clear('despachos');
        console.log('✓ Tabla despachos eliminada');
    }
};

const Migration_003_SQL = `
CREATE TABLE despachos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL COMMENT 'FK a rutas',
    camion_id INT NOT NULL COMMENT 'FK a camiones',
    fecha DATE NOT NULL,
    observaciones TEXT,
    volumen_total DECIMAL(10,2) COMMENT 'Volumen total del despacho',
    costo_total DECIMAL(10,2) COMMENT 'Costo total calculado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE RESTRICT,
    FOREIGN KEY (camion_id) REFERENCES camiones(id) ON DELETE RESTRICT,
    
    INDEX idx_ruta (ruta_id),
    INDEX idx_camion (camion_id),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const migration_003 = Migration_003_CreateDespachosTable;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Migration_003_CreateDespachosTable, Migration_003_SQL, migration_003 };
}
