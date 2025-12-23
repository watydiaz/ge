/**
 * Migración 002: Crear tabla de tipos de camiones
 * Versión: 2
 * Fecha: 2024-12-19
 */

const Migration_002_CreateCamionesTable = {
    version: 2,
    name: 'CreateCamionesTable',
    description: 'Crea la tabla de tipos de camiones',

    /**
     * Ejecuta la migración
     */
    async up(db) {
        console.log('📦 Creando tabla camiones...');
        
        const camiones = [
            { id: 1, tipo: '25m³', capacidad: 25, eficiencia: 0.80, activo: true },
            { id: 2, tipo: '37m³', capacidad: 37, eficiencia: 0.80, activo: true },
            { id: 3, tipo: '45m³', capacidad: 45, eficiencia: 0.80, activo: true }
        ];

        for (const camion of camiones) {
            await db.insert('camiones', camion);
        }

        console.log(`✓ ${camiones.length} tipos de camiones creados`);
    },

    /**
     * Revierte la migración
     */
    async down(db) {
        console.log('🔙 Eliminando tabla camiones...');
        await db.clear('camiones');
        console.log('✓ Tabla camiones eliminada');
    }
};

// SQL para producción
const Migration_002_SQL = `
CREATE TABLE camiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL UNIQUE COMMENT 'Tipo de camión (25m³, 37m³, 45m³)',
    capacidad INT NOT NULL COMMENT 'Capacidad en metros cúbicos',
    eficiencia DECIMAL(3,2) DEFAULT 0.80 COMMENT 'Eficiencia (80% = 0.80)',
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tipo (tipo),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO camiones (id, tipo, capacidad, eficiencia, activo) VALUES
(1, '25m³', 25, 0.80, TRUE),
(2, '37m³', 37, 0.80, TRUE),
(3, '45m³', 45, 0.80, TRUE);
`;

const migration_002 = Migration_002_CreateCamionesTable;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Migration_002_CreateCamionesTable, Migration_002_SQL, migration_002 };
}
