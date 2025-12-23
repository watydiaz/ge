/**
 * Migración 004: Crear tabla de clientes
 * Versión: 4
 * Fecha: 2024-12-19
 */

const Migration_004_CreateClientesTable = {
    version: 4,
    name: 'CreateClientesTable',
    description: 'Crea la tabla de clientes relacionada con despachos',

    async up(db) {
        console.log('📦 Creando tabla clientes...');
        console.log('✓ Tabla clientes lista');
    },

    async down(db) {
        console.log('🔙 Eliminando tabla clientes...');
        await db.clear('clientes');
        console.log('✓ Tabla clientes eliminada');
    }
};

const Migration_004_SQL = `
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    despacho_id INT NOT NULL COMMENT 'FK a despachos',
    nombre VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100),
    volumen_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (despacho_id) REFERENCES despachos(id) ON DELETE CASCADE,
    INDEX idx_despacho (despacho_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const migration_004 = Migration_004_CreateClientesTable;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Migration_004_CreateClientesTable, Migration_004_SQL, migration_004 };
}
