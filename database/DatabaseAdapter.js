/**
 * Adaptador de Base de Datos para IndexedDB
 * Proporciona una interfaz unificada para operaciones de BD
 */

class DatabaseAdapter {
    constructor(config) {
        this.config = config;
        this.db = null;
        this.isConnected = false;
    }

    /**
     * Conecta a la base de datos
     */
    async connect() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.name, this.config.version);

            request.onerror = () => {
                console.error('❌ Error al conectar con IndexedDB');
                reject(request.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                this.isConnected = true;
                console.log('✅ Conectado a IndexedDB');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                console.log('🔄 Actualizando estructura de IndexedDB...');
                const db = event.target.result;

                // Crear object stores si no existen
                Object.entries(this.config.stores).forEach(([storeName, options]) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, options);
                        console.log(`✓ Object store creado: ${storeName}`);

                        // Crear índices según la tabla
                        this.createIndexes(store, storeName);
                    }
                });
            };
        });
    }

    /**
     * Crea índices para una tabla
     */
    createIndexes(store, storeName) {
        const indexes = {
            rutas: [
                { name: 'nombre', keyPath: 'nombre', unique: false }
            ],
            destinos: [
                { name: 'rutaId', keyPath: 'rutaId', unique: false },
                { name: 'nombre', keyPath: 'nombre', unique: false }
            ],
            tarifas: [
                { name: 'rutaId', keyPath: 'rutaId', unique: false }
            ],
            despachos: [
                { name: 'fecha', keyPath: 'fecha', unique: false },
                { name: 'rutaId', keyPath: 'rutaId', unique: false },
                { name: 'estado', keyPath: 'estado', unique: false }
            ],
            clientes: [
                { name: 'despachoId', keyPath: 'despachoId', unique: false },
                { name: 'nombre', keyPath: 'nombre', unique: false }
            ],
            productos: [
                { name: 'clienteId', keyPath: 'clienteId', unique: false },
                { name: 'despachoId', keyPath: 'despachoId', unique: false }
            ],
            calculos: [
                { name: 'despachoId', keyPath: 'despachoId', unique: false },
                { name: 'fecha', keyPath: 'fecha', unique: false }
            ]
        };

        if (indexes[storeName]) {
            indexes[storeName].forEach(index => {
                if (!store.indexNames.contains(index.name)) {
                    store.createIndex(index.name, index.keyPath, { unique: index.unique });
                }
            });
        }
    }

    /**
     * Inserta un registro
     */
    async insert(table, data) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            const request = store.add(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtiene un registro por ID
     */
    async find(table, id) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Obtiene todos los registros de una tabla
     */
    async findAll(table) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Busca registros por índice
     */
    async findBy(table, indexName, value) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const index = store.index(indexName);
            const request = index.getAll(value);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Actualiza un registro
     */
    async update(table, data) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Elimina un registro
     */
    async delete(table, id) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Elimina todos los registros de una tabla
     */
    async clear(table) {
        if (!this.isConnected) await this.connect();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            const request = store.clear();

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Ejecuta una consulta personalizada
     */
    async query(table, filter) {
        const all = await this.findAll(table);
        return all.filter(filter);
    }

    /**
     * Obtiene la versión actual de la BD
     */
    async getVersion() {
        const migrations = await this.findAll('migraciones').catch(() => []);
        const versions = migrations.map(m => m.version).sort((a, b) => b - a);
        return versions[0] || 0;
    }

    /**
     * Establece la versión de la BD
     */
    async setVersion(version) {
        await this.insert('migraciones', {
            version: version,
            executedAt: new Date().toISOString()
        });
    }

    /**
     * Cierra la conexión
     */
    close() {
        if (this.db) {
            this.db.close();
            this.isConnected = false;
            console.log('🔌 Conexión a IndexedDB cerrada');
        }
    }
}
