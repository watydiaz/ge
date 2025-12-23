/**
 * Script de Inicialización de Base de Datos
 * Ejecuta las migraciones y carga los datos iniciales
 */

// Importar configuración y adaptadores
// (En entorno browser, estos se cargarían desde el HTML)

async function inicializarBaseDeDatos() {
    console.log('🚀 Iniciando sistema de base de datos...');
    
    try {
        // 1. Crear conexión a IndexedDB
        const dbConfig = DatabaseConfig.local;
        const db = new DatabaseAdapter(dbConfig);
        await db.connect();
        console.log('✅ Conexión establecida');

        // 2. Configurar sistema de migraciones
        const migrationManager = new MigrationManager(db);

        // 3. Registrar migraciones
        const migrations = await cargarMigraciones();
        migrations.forEach(migration => {
            migrationManager.register(migration);
        });
        console.log(`📦 ${migrations.length} migraciones registradas`);

        // 4. Ejecutar migraciones
        const result = await migrationManager.migrate();
        console.log(`✅ ${result.executed} migraciones ejecutadas`);

        // 5. Verificar estado
        await migrationManager.status();

        console.log('🎉 Base de datos inicializada correctamente');
        return { success: true, db };

    } catch (error) {
        console.error('❌ Error al inicializar BD:', error);
        throw error;
    }
}

/**
 * Carga todas las migraciones desde la carpeta migrations/
 */
async function cargarMigraciones() {
    // En un entorno real, estas se cargarían dinámicamente
    // Por ahora, se deben importar manualmente en el HTML
    const migrations = [];

    // Las migraciones se deben cargar desde:
    // - database/migrations/001_create_rutas_table.js
    // - database/migrations/002_create_camiones_table.js
    // - database/migrations/003_create_despachos_table.js
    // - database/migrations/004_create_clientes_table.js
    // - database/migrations/005_create_productos_table.js

    console.log('⚠️ NOTA: Las migraciones deben cargarse manualmente en index.html');
    console.log('   Agregar <script> tags antes de este archivo');

    return migrations;
}

/**
 * Verifica si la BD ya está inicializada
 */
async function verificarEstadoBD() {
    try {
        const dbConfig = DatabaseConfig.local;
        const db = new DatabaseAdapter(dbConfig);
        await db.connect();

        const version = await db.getVersion();
        console.log(`📊 Versión actual de BD: ${version}`);

        const rutas = await db.getAll('rutas');
        console.log(`📍 Rutas en BD: ${rutas.length}`);

        return {
            initialized: rutas.length > 0,
            version,
            records: rutas.length
        };

    } catch (error) {
        console.log('⚠️ BD no inicializada');
        return { initialized: false };
    }
}

// Exportar para uso en consola o scripts
if (typeof window !== 'undefined') {
    window.inicializarBaseDeDatos = inicializarBaseDeDatos;
    window.verificarEstadoBD = verificarEstadoBD;
}
