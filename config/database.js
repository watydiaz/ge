/**
 * Configuración de Base de Datos
 * Soporta IndexedDB (local) y MySQL (producción)
 */

const DatabaseConfig = {
    // Configuración para desarrollo (IndexedDB - navegador)
    local: {
        name: 'geLogisticaDB',
        version: 1,
        stores: {
            rutas: { keyPath: 'id', autoIncrement: true },
            destinos: { keyPath: 'id', autoIncrement: true },
            camiones: { keyPath: 'id', autoIncrement: true },
            tarifas: { keyPath: 'id', autoIncrement: true },
            despachos: { keyPath: 'id', autoIncrement: true },
            clientes: { keyPath: 'id', autoIncrement: true },
            productos: { keyPath: 'id', autoIncrement: true },
            calculos: { keyPath: 'id', autoIncrement: true },
            migraciones: { keyPath: 'version', autoIncrement: false }
        }
    },

    // Configuración para producción (MySQL/PostgreSQL)
    production: {
        host: 'localhost',
        port: 3306,
        database: 'ge_logistica',
        user: 'root',
        password: '',
        charset: 'utf8mb4'
    },

    // Modo actual (cambiar según entorno)
    mode: 'local', // 'local' o 'production'

    // Versión del esquema
    schemaVersion: '1.0.0'
};
