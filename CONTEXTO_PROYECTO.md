# 🚚 GE Logística - Contexto del Proyecto

## 📋 Información General

**Sistema**: Cotización de Fletes con Modelo Mixto  
**Cliente**: GE Logística S.A.S. / Grupo Espumados  
**Versión**: 2.0 MVC  
**Fecha**: Diciembre 2024

---

## 🎯 Objetivo del Sistema

Sistema profesional para calcular y cotizar fletes utilizando un **modelo mixto** que combina:
- **Dimensión Operativa**: Volumen de carga
- **Dimensión Financiera**: Distancia recorrida

**Fórmula**: `Costo = Volumen × Distancia × Tarifa`

---

## 📁 Estructura del Proyecto (MVC Tradicional)

```
geLogistica/
│
├── index.html                 # Punto de entrada
│
├── models/                    # 4 Modelos (Lógica de Negocio)
│   ├── RutaModel.js          # Gestión de rutas y destinos
│   ├── CamionModel.js        # Tipos de camiones y capacidades
│   ├── DespachoModel.js      # Estado del despacho
│   └── CalculoModel.js       # Cálculos de flete
│
├── views/                     # 4 Vistas (Interfaz de Usuario)
│   ├── ConfiguracionViajeView.js
│   ├── ClientesView.js
│   ├── ResumenView.js
│   └── ReportesView.js
│
├── controllers/               # 1 Controlador (Coordinación)
│   └── AppController.js      # Controlador principal (250+ líneas)
│
├── assets/
│   ├── css/styles.css        # Estilos
│   └── js/app.js             # Inicialización
│
├── database/                  # Sistema de BD (ver DATABASE.md)
│   ├── DatabaseAdapter.js
│   ├── MigrationManager.js
│   ├── migrations/
│   ├── seeders/
│   └── schema/
│
└── config/
    └── database.js
```

---

## 🏗️ Arquitectura MVC

### **Modelos** (No acceden al DOM)
```javascript
// RutaModel.js - Gestión de rutas
- RUTAS: Array con 5 rutas predefinidas
- obtenerRutas()
- obtenerDestinosPorRuta(rutaId)
- obtenerTarifa(rutaId, destinoId, tipoCamion)

// CamionModel.js - Tipos de camiones
- CAMIONES: [25m³, 37m³, 45m³]
- Eficiencia: 80%
- calcularCapacidadReal(tipo)

// DespachoModel.js - Estado del despacho
- Gestión de clientes y productos
- Validaciones de capacidad
- Estado completo del despacho

// CalculoModel.js - Cálculos
- calcularCosto(volumen, distancia, tarifa)
- calcularVolumenTotal()
- validarCapacidad()
```

### **Vistas** (No tienen lógica de negocio)
```javascript
// ConfiguracionViajeView.js - Configuración inicial
// ClientesView.js - Gestión dinámica de clientes/productos
// ResumenView.js - Resumen en tiempo real
// ReportesView.js - Reportes finales
```

### **Controlador** (Coordinación)
```javascript
// AppController.js - Orquestador central
- Conecta todos los modelos y vistas
- Maneja eventos del usuario
- Actualiza el estado de la aplicación
```

---

## 🔄 Flujo de Trabajo

```
1. Usuario selecciona ruta → AppController → RutaModel
2. Usuario selecciona camión → AppController → CamionModel
3. Usuario agrega cliente → AppController → DespachoModel
4. Usuario agrega producto → DespachoModel valida capacidad
5. Usuario calcula → CalculoModel genera reportes
6. Vista muestra resultados
```

---

## 💾 Datos Principales

### Rutas Disponibles (5)
1. Bogotá - Medellín
2. Bogotá - Cali
3. Bogotá - Barranquilla
4. Bogotá - Cartagena
5. Bogotá - Bucaramanga

### Tipos de Camiones (3)
- 25 m³ (Eficiencia 80% = 20 m³ reales)
- 37 m³ (Eficiencia 80% = 29.6 m³ reales)
- 45 m³ (Eficiencia 80% = 36 m³ reales)

### Destinos por Ruta
Cada ruta tiene múltiples destinos con:
- Distancia en km
- Tarifa por m³

---

## 🎨 Características Implementadas

✅ **Modelo Mixto**: Volumen × Distancia  
✅ **Múltiples clientes**: Varios destinatarios por despacho  
✅ **Validación automática**: Control de capacidad en tiempo real  
✅ **Reportes detallados**: Por producto, por cliente, mixto  
✅ **Exportación**: Descarga de reportes en formato texto  
✅ **Arquitectura MVC**: Código organizado y mantenible

---

## 🔧 Funcionalidades Principales

### 1. Configuración de Viaje
- Selección de ruta
- Selección de tipo de camión
- Fecha del despacho
- Observaciones

### 2. Gestión de Clientes
- Agregar múltiples clientes
- Asignar destino a cada cliente
- Agregar productos por cliente
- Validación de capacidad

### 3. Cálculos Automáticos
- Volumen total por cliente
- Volumen total del despacho
- Costo por producto
- Costo total

### 4. Reportes
- **Por Producto**: Agrupa todos los productos del despacho
- **Por Cliente**: Detalla cada cliente con sus productos
- **Mixto**: Combina análisis operativo y financiero

---

## 🚀 Inicialización

```javascript
// assets/js/app.js
import { AppController } from '../../controllers/AppController.js';

const appController = new AppController();

// Exponer funciones globales para HTML
window.agregarCliente = () => appController.agregarCliente();
window.calcularDespacho = () => appController.calcularDespacho();
// etc...

console.log('✓ Aplicación GE Logística inicializada correctamente (Arquitectura MVC)');
```

---

## 📊 Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript Vanilla ES6
- **Patrón**: MVC (Model-View-Controller)
- **Base de Datos**: IndexedDB (local) / MySQL (producción) - Infraestructura lista
- **Sin frameworks**: Código nativo, sin dependencias externas

---

## 🔐 Reglas de Arquitectura

### ✅ Hacer:
- Modelos solo gestionan datos y lógica
- Vistas solo manejan presentación
- Controlador coordina entre modelos y vistas
- Una responsabilidad por archivo

### ❌ No Hacer:
- Modelos NO acceden al DOM
- Vistas NO contienen lógica de negocio
- NO saltarse el controlador
- NO mezclar responsabilidades

---

## 🗄️ Base de Datos

Ver [DATABASE.md](DATABASE.md) para:
- Sistema de migraciones
- Diseño de esquema
- Guías de implementación

**Estado**: Infraestructura completa, diseño pendiente

---

## 📈 Evolución del Proyecto

### V1.0 - Monolítica
- Un solo archivo `script.js` (904 líneas)
- Código mezclado
- Difícil de mantener

### V2.0 - MVC (Actual)
- 12 archivos especializados
- Separación de responsabilidades
- Fácil de escalar y mantener
- Sistema de BD preparado

---

## 🎯 Casos de Uso Principales

### Caso 1: Despacho Simple
```
Ruta: Bogotá - Medellín
Camión: 25m³
Cliente: Almacén Central
Destino: Medellín (415 km)
Productos: 
  - Colchones: 50 und × 0.15 m³ = 7.5 m³
  - Almohadas: 100 und × 0.02 m³ = 2 m³
Total: 9.5 m³
Capacidad disponible: 20 m³
Estado: ✅ OK
```

### Caso 2: Despacho Múltiple
```
Ruta: Bogotá - Cali
Camión: 45m³
Clientes:
  1. Cliente A → Cali (461 km) → 15 m³
  2. Cliente B → Buga (392 km) → 12 m³
  3. Cliente C → Tuluá (320 km) → 8 m³
Total: 35 m³
Capacidad disponible: 36 m³
Estado: ✅ OK
```

---

## 🔄 Próximas Fases

### FASE 1: Base de Datos (Actual)
- ✅ Infraestructura de migraciones lista
- 📋 Diseño de esquema (en proceso)
- ⏳ Crear migraciones
- 🌱 Crear seeders

### FASE 2: Integración BD
- Conectar modelos con DatabaseAdapter
- Persistencia de despachos
- Historial de operaciones

### FASE 3: Mejoras
- Integración con SAP
- Dashboard con estadísticas
- Autenticación y usuarios
- API REST

---

## 💡 Notas Importantes

1. **El archivo `script.js`** es la versión antigua (monolítica)
   - Se mantiene solo como referencia
   - NO se usa en producción
   - La app usa la estructura MVC

2. **Arquitectura extensible**
   - Fácil agregar nuevos modelos
   - Fácil agregar nuevas vistas
   - Migración a frameworks posible (React, Vue, Angular)

3. **Código limpio**
   - Comentarios descriptivos
   - Nombres semánticos
   - Funciones cortas y específicas

---

## 📞 Contacto

**GE Logística S.A.S.**  
Grupo Espumados  
Sistema interno de cotización de fletes

---

**Última actualización**: 19 de diciembre de 2024
