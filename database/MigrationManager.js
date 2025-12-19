/**
 * Sistema de Migraciones
 * Maneja la evolución del esquema de base de datos
 */

class MigrationManager {
    constructor(db) {
        this.db = db;
        this.migrations = [];
        this.currentVersion = 0;
    }

    /**
     * Registra una nueva migración
     */
    register(migration) {
        this.migrations.push(migration);
        this.migrations.sort((a, b) => a.version - b.version);
    }

    /**
     * Ejecuta las migraciones pendientes
     */
    async migrate() {
        console.log('🔄 Iniciando migraciones...');

        try {
            this.currentVersion = await this.getCurrentVersion();
            console.log(`📊 Versión actual de BD: ${this.currentVersion}`);

            const pending = this.migrations.filter(m => m.version > this.currentVersion);

            if (pending.length === 0) {
                console.log('✅ Base de datos actualizada');
                return { success: true, executed: 0 };
            }

            console.log(`📦 Migraciones pendientes: ${pending.length}`);

            for (const migration of pending) {
                await this.executeMigration(migration);
            }

            console.log('✅ Todas las migraciones ejecutadas correctamente');
            return { success: true, executed: pending.length };

        } catch (error) {
            console.error('❌ Error en migración:', error);
            throw error;
        }
    }

    /**
     * Ejecuta una migración individual
     */
    async executeMigration(migration) {
        console.log(`⚙️ Ejecutando migración ${migration.version}: ${migration.name}`);

        try {
            await migration.up(this.db);
            await this.setVersion(migration.version);
            console.log(`✓ Migración ${migration.version} completada`);
        } catch (error) {
            console.error(`✗ Error en migración ${migration.version}:`, error);
            throw error;
        }
    }

    /**
     * Revierte la última migración
     */
    async rollback() {
        console.log('🔙 Revirtiendo última migración...');

        try {
            this.currentVersion = await this.getCurrentVersion();

            const lastMigration = this.migrations.find(m => m.version === this.currentVersion);

            if (!lastMigration) {
                console.log('⚠️ No hay migraciones para revertir');
                return { success: false, message: 'No migrations to rollback' };
            }

            console.log(`⚙️ Revirtiendo migración ${lastMigration.version}: ${lastMigration.name}`);
            
            if (lastMigration.down) {
                await lastMigration.down(this.db);
            }

            const previousVersion = this.migrations
                .filter(m => m.version < this.currentVersion)
                .sort((a, b) => b.version - a.version)[0]?.version || 0;

            await this.setVersion(previousVersion);
            console.log(`✅ Migración revertida. Versión actual: ${previousVersion}`);

            return { success: true, version: previousVersion };

        } catch (error) {
            console.error('❌ Error al revertir migración:', error);
            throw error;
        }
    }

    /**
     * Obtiene la versión actual de la BD
     */
    async getCurrentVersion() {
        // Implementación depende del tipo de BD (IndexedDB vs SQL)
        return this.db.getVersion ? await this.db.getVersion() : 0;
    }

    /**
     * Establece la versión de la BD
     */
    async setVersion(version) {
        if (this.db.setVersion) {
            await this.db.setVersion(version);
        }
    }

    /**
     * Lista todas las migraciones registradas
     */
    list() {
        console.table(this.migrations.map(m => ({
            Version: m.version,
            Name: m.name,
            Description: m.description || '-'
        })));
    }

    /**
     * Muestra el estado de las migraciones
     */
    async status() {
        this.currentVersion = await this.getCurrentVersion();
        
        const status = this.migrations.map(m => ({
            Version: m.version,
            Name: m.name,
            Status: m.version <= this.currentVersion ? '✅ Ejecutada' : '⏳ Pendiente'
        }));

        console.table(status);
        return status;
    }
}
