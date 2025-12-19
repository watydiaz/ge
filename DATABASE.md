# 🗄️ Sistema de Base de Datos y Migraciones

## 📋 Estado Actual

✅ **Infraestructura completa implementada**  
📋 **Diseño de esquema pendiente de análisis**  
⏳ **Migraciones: 0 creadas (esperando diseño)**  
🌱 **Seeders: Infraestructura lista**

---

## 🏗️ Componentes Implementados

### 1. DatabaseAdapter.js (280+ líneas)
Capa de abstracción para IndexedDB (local) y SQL (producción)

**Métodos disponibles**:
```javascript
await db.connect()                          // Conectar a BD
await db.insert(tabla, datos)               // Insertar registro
await db.find(tabla, id)                    // Buscar por ID
await db.findAll(tabla)                     // Obtener todos
await db.findBy(tabla, indice, valor)       // Buscar por índice
await db.update(tabla, datos)               // Actualizar registro
await db.delete(tabla, id)                  // Eliminar registro
await db.query(tabla, filtro)               // Consulta con filtro
await db.getVersion()                       // Versión de esquema
```

**Configuración**:
```javascript
// Local (IndexedDB)
const config = DatabaseConfig.local;

// Producción (MySQL)
const config = DatabaseConfig.production;

const db = new DatabaseAdapter(config);
await db.connect();
```

---

### 2. MigrationManager.js (150+ líneas)
Sistema de versionado y ejecución de migraciones

**Métodos disponibles**:
```javascript
migrationManager.register(migracion)        // Registrar migración
await migrationManager.migrate()            // Ejecutar pendientes
await migrationManager.rollback()           // Revertir última
await migrationManager.status()             // Ver estado
migrationManager.list()                     // Listar migraciones
```

**Estructura de una migración**:
```javascript
const Migration_001_CreateRutasTable = {
    version: 1,
    name: 'CreateRutasTable',
    description: 'Crea la tabla de rutas',
    
    async up(db) {
        // Código para crear/modificar
        console.log('📦 Creando tabla rutas...');
        
        const rutas = [
            { id: 1, nombre: 'Bogotá - Medellín', activa: true }
        ];
        
        for (const ruta of rutas) {
            await db.insert('rutas', ruta);
        }
        
        console.log('✓ Tabla rutas creada');
    },
    
    async down(db) {
        // Código para revertir
        console.log('🔙 Eliminando tabla rutas...');
        await db.clear('rutas');
        console.log('✓ Tabla rutas eliminada');
    }
};
```

---

### 3. config/database.js
Configuración centralizada de entornos

```javascript
const DatabaseConfig = {
    // Desarrollo local con IndexedDB
    local: {
        name: 'geLogisticaDB',
        version: 1,
        type: 'indexeddb',
        stores: ['rutas', 'destinos', 'camiones', 'tarifas', 
                 'despachos', 'clientes', 'productos', 'migrations']
    },
    
    // Producción con MySQL
    production: {
        host: 'localhost',
        port: 3306,
        database: 'ge_logistica',
        user: 'root',
        password: '',
        type: 'mysql'
    },
    
    mode: 'local' // 'local' o 'production'
};
```

---

## 📂 Estructura de Carpetas

```
database/
├── DatabaseAdapter.js         # Adaptador de BD
├── MigrationManager.js        # Gestor de migraciones
│
├── migrations/                # Migraciones (vacío)
│   └── (crear aquí tus migraciones)
│
├── seeders/                   # Datos iniciales (vacío)
│   └── (crear aquí tus seeders)
│
└── schema/                    # Diseño de BD (propuestas)
    ├── diagrama_ER.md        # Diagrama propuesto
    ├── tablas.md             # Definición de tablas
    └── relaciones.md         # Relaciones entre tablas
```

---

## 📐 Diseño de Esquema Propuesto

### Tablas Principales (Sugeridas)

#### 1. **rutas**
```sql
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);
```

#### 2. **destinos**
```sql
CREATE TABLE destinos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    distancia INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
    INDEX idx_ruta_id (ruta_id)
);
```

#### 3. **camiones**
```sql
CREATE TABLE camiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    capacidad INT NOT NULL,
    eficiencia DECIMAL(3,2) DEFAULT 0.80,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. **tarifas**
```sql
CREATE TABLE tarifas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    destino_id INT NOT NULL,
    camion_id INT NOT NULL,
    tarifa DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ruta_id) REFERENCES rutas(id),
    FOREIGN KEY (destino_id) REFERENCES destinos(id),
    FOREIGN KEY (camion_id) REFERENCES camiones(id),
    
    UNIQUE KEY uk_tarifa (ruta_id, destino_id, camion_id),
    INDEX idx_ruta (ruta_id),
    INDEX idx_destino (destino_id),
    INDEX idx_camion (camion_id)
);
```

#### 5. **despachos**
```sql
CREATE TABLE despachos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruta_id INT NOT NULL,
    camion_id INT NOT NULL,
    fecha DATE NOT NULL,
    observaciones TEXT,
    volumen_total DECIMAL(10,2),
    costo_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ruta_id) REFERENCES rutas(id),
    FOREIGN KEY (camion_id) REFERENCES camiones(id),
    INDEX idx_fecha (fecha)
);
```

#### 6. **clientes**
```sql
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    despacho_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (despacho_id) REFERENCES despachos(id) ON DELETE CASCADE,
    INDEX idx_despacho (despacho_id)
);
```

#### 7. **productos**
```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    volumen DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id)
);
```

---

## 🔗 Diagrama de Relaciones

```
rutas (1) ────< (N) destinos
  │
  ├────< (N) tarifas
  │
  └────< (N) despachos (1) ────< (N) clientes (1) ────< (N) productos

camiones (1) ────< (N) tarifas
         │
         └────< (N) despachos
```

**Cardinalidades**:
- Una ruta tiene muchos destinos (1:N)
- Una ruta tiene muchas tarifas (1:N)
- Un destino tiene muchas tarifas (1:N)
- Un camión tiene muchas tarifas (1:N)
- Un despacho tiene muchos clientes (1:N)
- Un cliente tiene muchos productos (1:N)

---

## 🚀 Cómo Usar el Sistema

### Paso 1: Inicializar Base de Datos

```javascript
// En consola del navegador o en app.js
const config = DatabaseConfig.local;
const db = new DatabaseAdapter(config);
await db.connect();

console.log('✓ BD conectada');
```

### Paso 2: Crear el Gestor de Migraciones

```javascript
const migrationManager = new MigrationManager(db);
```

### Paso 3: Crear y Registrar Migraciones

Crear archivo: `database/migrations/001_create_rutas_table.js`

```javascript
const Migration_001_CreateRutasTable = {
    version: 1,
    name: 'CreateRutasTable',
    description: 'Crea la tabla de rutas',
    
    async up(db) {
        console.log('📦 Creando tabla rutas...');
        // Tu código aquí
    },
    
    async down(db) {
        console.log('🔙 Eliminando tabla rutas...');
        // Tu código aquí
    }
};

// Registrar
migrationManager.register(Migration_001_CreateRutasTable);
```

### Paso 4: Ejecutar Migraciones

```javascript
// Ver estado
await migrationManager.status();

// Ejecutar pendientes
await migrationManager.migrate();

// Si algo sale mal, revertir
await migrationManager.rollback();
```

---

## 📝 Ejemplos de Migraciones

### Ejemplo 1: Crear Tabla
```javascript
async up(db) {
    const rutasIniciales = [
        { id: 1, nombre: 'Bogotá - Medellín', activa: true },
        { id: 2, nombre: 'Bogotá - Cali', activa: true }
    ];
    
    for (const ruta of rutasIniciales) {
        await db.insert('rutas', ruta);
    }
}
```

### Ejemplo 2: Agregar Campo
```javascript
async up(db) {
    const rutas = await db.findAll('rutas');
    for (const ruta of rutas) {
        ruta.descripcion = null; // Nuevo campo
        await db.update('rutas', ruta);
    }
}
```

### Ejemplo 3: Crear Relación
```javascript
async up(db) {
    const destinos = [
        { id: 1, rutaId: 1, nombre: 'Medellín', distancia: 415 },
        { id: 2, rutaId: 1, nombre: 'Envigado', distancia: 425 }
    ];
    
    for (const destino of destinos) {
        await db.insert('destinos', destino);
    }
}
```

---

## 🌱 Seeders (Datos Iniciales)

Crear archivo: `database/seeders/001_seed_rutas.js`

```javascript
const Seeder_RutasIniciales = {
    name: 'RutasIniciales',
    description: 'Rutas principales del sistema',
    table: 'rutas',
    
    async run(db) {
        console.log('🌱 Insertando rutas...');
        
        const rutas = [
            { id: 1, nombre: 'Bogotá - Medellín', activa: true },
            { id: 2, nombre: 'Bogotá - Cali', activa: true },
            { id: 3, nombre: 'Bogotá - Barranquilla', activa: true },
            { id: 4, nombre: 'Bogotá - Cartagena', activa: true },
            { id: 5, nombre: 'Bogotá - Bucaramanga', activa: true }
        ];
        
        for (const ruta of rutas) {
            await db.insert(this.table, ruta);
        }
        
        console.log(`✓ ${rutas.length} rutas insertadas`);
    },
    
    async clear(db) {
        await db.clear(this.table);
    }
};
```

---

## ✅ Buenas Prácticas

### Nomenclatura de Migraciones
```
✅ 001_create_rutas_table.js
✅ 002_create_destinos_table.js
✅ 003_add_descripcion_to_rutas.js

❌ migracion1.js
❌ nueva_tabla.js
```

### Orden de Creación
1. **Tablas principales** (sin FK): rutas, camiones
2. **Tablas dependientes** (con FK): destinos, tarifas
3. **Tablas transaccionales**: despachos, clientes, productos

### Reversibilidad
```javascript
// Siempre incluir down() para revertir
async down(db) {
    await db.clear('tabla');
}
```

---

## 🔄 Integración con Modelos MVC

Una vez creadas las migraciones, integrar con los modelos:

```javascript
// models/RutaModel.js
class RutaModel {
    constructor(db) {
        this.db = db; // DatabaseAdapter
    }
    
    async obtenerRutas() {
        return await this.db.findAll('rutas');
    }
    
    async obtenerRutaPorId(id) {
        return await this.db.find('rutas', id);
    }
    
    async obtenerDestinosPorRuta(rutaId) {
        return await this.db.findBy('destinos', 'rutaId', rutaId);
    }
}
```

---

## 📊 Flujo Completo

```
1. Diseñar esquema → schema/diagrama_ER.md
2. Definir tablas → schema/tablas.md
3. Documentar relaciones → schema/relaciones.md
4. Crear migraciones → migrations/001_xxx.js
5. Registrar migraciones → migrationManager.register()
6. Ejecutar migraciones → migrationManager.migrate()
7. Crear seeders → seeders/001_xxx.js
8. Ejecutar seeders → seeder.run()
9. Integrar modelos → models/*.js con DatabaseAdapter
10. Probar en la aplicación
```

---

## ⚙️ Configuración para Producción

### Cambiar a MySQL

1. **Actualizar config/database.js**:
```javascript
DatabaseConfig.mode = 'production';
```

2. **Ajustar migraciones** para incluir SQL:
```javascript
const Migration_001_SQL = `
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
```

3. **Ejecutar en servidor MySQL**:
```bash
mysql -u root -p ge_logistica < migrations.sql
```

---

## 🎯 Próximos Pasos

1. **Analizar y validar** el diseño propuesto en `schema/`
2. **Crear migraciones** para cada tabla
3. **Ejecutar migraciones** en IndexedDB (local)
4. **Crear seeders** con datos iniciales
5. **Integrar modelos** con DatabaseAdapter
6. **Probar** funcionalidad completa
7. **Migrar a producción** (MySQL)

---

## 📞 Soporte

Ver archivos en `database/schema/` para:
- Propuestas de diseño de tablas
- Relaciones entre entidades
- Índices y constraints sugeridos

---

**Estado**: Infraestructura completa ✅ | Diseño pendiente 📋 | Migraciones: 0  
**Última actualización**: 19 de diciembre de 2024
