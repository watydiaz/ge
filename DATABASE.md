# 🗄️ Sistema de Base de Datos y Migraciones

## 📋 Estado Actual

✅ **Infraestructura completa implementada**  
✅ **Diseño de esquema finalizado** (Opción 1 - Tabla simple)  
✅ **Migraciones creadas**: 5 archivos listos  
⏳ **Pendiente**: Ejecutar migraciones y probar  

### Archivos creados:
- `database/migrations/001_create_rutas_table.js` (57 rutas + tarifas 2025)
- `database/migrations/002_create_camiones_table.js` (3 tipos)
- `database/migrations/003_create_despachos_table.js`
- `database/migrations/004_create_clientes_table.js`
- `database/migrations/005_create_productos_table.js`

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

## 📐 Diseño de Esquema Implementado

### Estructura Final (Opción 1 - Tabla Simple)

Se implementó la estructura simple con tarifas integradas en la tabla rutas para máxima eficiencia.

#### 1. **rutas** (57 registros - Tarifas 2025)
```sql
CREATE TABLE rutas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,     -- 'RUTA 01', 'RUTA 02', etc.
    nombre VARCHAR(255) NOT NULL,           -- Descripción de la ruta
    tarifa_25m3 DECIMAL(10,3) NOT NULL,     -- Precio para camión 25m³
    tarifa_37m3 DECIMAL(10,3) NOT NULL,     -- Precio para camión 37m³
    tarifa_45m3 DECIMAL(10,3) NOT NULL,     -- Precio para camión 45m³
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    
    INDEX idx_codigo (codigo),
    INDEX idx_activa (activa)
);
```

**Ejemplo de datos**:
```javascript
{
    id: 1,
    codigo: 'RUTA 01',
    nombre: 'URBANO (SIBATE a Calle 26) (1 a 6 Clientes)',
    tarifa_25m3: 272.967,
    tarifa_37m3: 318.462,
    tarifa_45m3: 333.626,
    activa: true
}
```

#### 2. **camiones** (3 registros)
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

#### 2. **camiones** (3 registros)
```sql
CREATE TABLE camiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) UNIQUE NOT NULL,       -- '25m³', '37m³', '45m³'
    capacidad INT NOT NULL,                 -- 25, 37, 45
    eficiencia DECIMAL(3,2) DEFAULT 0.80,   -- 80% eficiencia
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **despachos**
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

#### 4. **clientes**
```sql
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    despacho_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100),
    volumen_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (despacho_id) REFERENCES despachos(id) ON DELETE CASCADE
);
```

#### 5. **productos**
```sql
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    volumen DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);
```

---

## 🔗 Diagrama de Relaciones Implementado

```
rutas (57) ──────┐
  tarifa_25m3    │
  tarifa_37m3    │
  tarifa_45m3    │
                 │
camiones (3) ────┤
                 │
                 ├──< despachos (1:N)
                 │      │
                 │      ├──< clientes (1:N)
                 │      │      │
                 │      │      └──< productos (1:N)
                 │      │
                 └──────┘
```

**Ventajas de esta estructura**:
- ✅ Tarifas directamente en tabla rutas (sin joins)
- ✅ Consultas más rápidas
- ✅ Refleja exactamente las tarifas 2025
- ✅ Simple y eficiente

---

## 📦 Migraciones Implementadas

Se crearon 5 migraciones listas para ejecutar:

1. **001_create_rutas_table.js** - 57 rutas con tarifas 2025
2. **002_create_camiones_table.js** - 3 tipos de camiones
3. **003_create_despachos_table.js** - Tabla de despachos
4. **004_create_clientes_table.js** - Tabla de clientes
5. **005_create_productos_table.js** - Tabla de productos

---

## 🚀 Cómo Ejecutar las Migraciones

### Paso 1: Inicializar BD

```javascript
// En consola del navegador o app.js
import { DatabaseAdapter } from './database/DatabaseAdapter.js';
import { MigrationManager } from './database/MigrationManager.js';
import { DatabaseConfig } from './config/database.js';

const config = DatabaseConfig.local;
const db = new DatabaseAdapter(config);
await db.connect();
```

### Paso 2: Registrar Migraciones

```javascript
import { Migration_001_CreateRutasTable } from './database/migrations/001_create_rutas_table.js';
import { Migration_002_CreateCamionesTable } from './database/migrations/002_create_camiones_table.js';
import { Migration_003_CreateDespachosTable } from './database/migrations/003_create_despachos_table.js';
import { Migration_004_CreateClientesTable } from './database/migrations/004_create_clientes_table.js';
import { Migration_005_CreateProductosTable } from './database/migrations/005_create_productos_table.js';

const migrationManager = new MigrationManager(db);

migrationManager.register(Migration_001_CreateRutasTable);
migrationManager.register(Migration_002_CreateCamionesTable);
migrationManager.register(Migration_003_CreateDespachosTable);
migrationManager.register(Migration_004_CreateClientesTable);
migrationManager.register(Migration_005_CreateProductosTable);
```

### Paso 3: Ejecutar

```javascript
// Ver estado
await migrationManager.status();

// Ejecutar todas
await migrationManager.migrate();

// Verificar datos
const rutas = await db.findAll('rutas');
console.log(`✓ ${rutas.length} rutas cargadas`);
```

---

## 💡 Uso en los Modelos

### RutaModel actualizado

```javascript
// models/RutaModel.js
class RutaModel {
    constructor(db) {
        this.db = db; // DatabaseAdapter
    }
    
    async obtenerTarifa(rutaId, tipoCamion) {
        const ruta = await this.db.find('rutas', rutaId);
        
        switch(tipoCamion) {
            case '25m³': return ruta.tarifa_25m3;
            case '37m³': return ruta.tarifa_37m3;
            case '45m³': return ruta.tarifa_45m3;
        }
    }
    
    async obtenerRutas() {
        return await this.db.findAll('rutas');
    }
}
```

### CamionModel actualizado

```javascript
class CamionModel {
    constructor(db) {
        this.db = db;
    }
    
    async obtenerCamiones() {
        return await this.db.findAll('camiones');
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
