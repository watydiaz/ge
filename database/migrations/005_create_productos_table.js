/**
 * Migración 005: Crear tabla de productos
 * Versión: 5
 * Fecha: 2024-12-19
 */

const Migration_005_CreateProductosTable = {
    version: 5,
    name: 'CreateProductosTable',
    description: 'Crea la tabla de productos relacionada con clientes',

    async up(db) {
        console.log('📦 Creando tabla productos...');
        console.log('✓ Tabla productos lista');
    },

    async down(db) {
        console.log('🔙 Eliminando tabla productos...');
        await db.clear('productos');
        console.log('✓ Tabla productos eliminada');
    }
};

const Migration_005_SQL = `
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL COMMENT 'FK a clientes',
    producto VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    volumen DECIMAL(10,2) NOT NULL COMMENT 'Volumen en m³',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

const migration_005 = Migration_005_CreateProductosTable;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Migration_005_CreateProductosTable, Migration_005_SQL, migration_005 };
}
