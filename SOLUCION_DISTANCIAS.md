# Solución: Cálculo de Flete por Distancia a Puntos Intermedios

## Problema
Necesitas calcular el flete cuando los pedidos no van todos hasta el final de la ruta, sino a puntos intermedios dentro de ella.

**Ejemplo:**
- **Ruta FUNZA-MOSQUERA-MADRID** (30 km total)
  - Cliente A → Funza (18 km)
  - Cliente B → Mosquera (22 km)
  - Cliente C → Madrid (30 km, final de ruta)

## Solución Implementada

### 1. **Estructura de Destinos en Rutas**
Cada ruta ahora tiene un array de destinos con sus distancias:

```javascript
{
    id: 6,
    codigo: 'RUTA 06',
    nombre: 'FUNZA - MOSQUERA - MADRID',
    tarifa_25m3: 435.989,
    destinos: [
        { nombre: 'Bogotá', distancia: 0 },
        { nombre: 'Funza', distancia: 18 },
        { nombre: 'Mosquera', distancia: 22 },
        { nombre: 'Madrid', distancia: 30 }
    ]
}
```

### 2. **Fórmula de Cálculo Ponderado**

**Antes:** Distribución solo por volumen
```
Flete Pedido = (Volumen Pedido / Volumen Total) × Flete Total
```

**Ahora:** Distribución ponderada por volumen × distancia
```
Ponderación = Volumen × Distancia
Flete Pedido = (Ponderación Pedido / Suma Ponderaciones) × Flete Total
```

### 3. **Ejemplo Práctico**

**Datos del viaje:**
- Ruta: FUNZA-MOSQUERA-MADRID
- Camión: 25 m³
- Flete Total: $435.989

**Pedidos:**

| Cliente | Producto | Cantidad | Vol. Unit. | Vol. Total | Destino | Distancia |
|---------|----------|----------|------------|------------|---------|-----------|
| Cliente A | Colchón | 10 | 0.532 m³ | 5.32 m³ | Funza | 18 km |
| Cliente B | Colchón | 8 | 0.904 m³ | 7.23 m³ | Mosquera | 22 km |
| Cliente C | Laminado | 50 | 0.160 m³ | 8.00 m³ | Madrid | 30 km |

**Cálculo:**

1. **Ponderación (Vol × Dist):**
   - Cliente A: 5.32 × 18 = 95.76
   - Cliente B: 7.23 × 22 = 159.06
   - Cliente C: 8.00 × 30 = 240.00
   - **Suma Total:** 494.82

2. **Distribución del Flete:**
   - Cliente A: (95.76 / 494.82) × $435,989 = **$84,322** (19.3%)
   - Cliente B: (159.06 / 494.82) × $435,989 = **$140,138** (32.1%)
   - Cliente C: (240.00 / 494.82) × $435,989 = **$211,529** (48.5%)

### 4. **Ventajas de Este Método**

✅ **Justo:** Quien va más lejos paga más
✅ **Proporcional:** También considera el espacio ocupado
✅ **Flexible:** Funciona con cualquier número de destinos
✅ **Transparente:** Muestra la ponderación en la tabla de resultados

### 5. **Características Implementadas**

- ✅ Selector dinámico de destinos por ruta
- ✅ Visualización de distancia al seleccionar destino
- ✅ Cálculo automático ponderado
- ✅ Tabla de resultados muestra: Destino, Distancia, Ponderación, Flete Asignado
- ✅ Fallback a distribución simple si no hay distancias

### 6. **Uso en la Interfaz**

1. **Seleccionar Ruta** → Se cargan los destinos disponibles
2. **Agregar Pedido:**
   - Seleccionar producto y cliente
   - **Seleccionar destino** (nuevo campo)
   - Ver distancia automáticamente
   - Agregar pedido

3. **Calcular Despacho:**
   - Sistema calcula ponderación (Vol × Dist)
   - Distribuye flete proporcionalmente
   - Muestra desglose detallado

### 7. **Rutas con Destinos Configurados**

Ya configuradas con destinos intermedios:
- **RUTA 01:** URBANO (Sibate → Calle 26) - 4 destinos
- **RUTA 02:** URBANO NORTE (Calle 26 → Calle 200) - 5 destinos
- **RUTA 06:** FUNZA-MOSQUERA-MADRID - 4 destinos

Las demás rutas usan destino único por defecto.

## Próximos Pasos (Opcional)

1. **Agregar más destinos** a las 56 rutas según tu conocimiento del negocio
2. **Crear destinos dinámicos** para rutas especiales
3. **Reportes** que muestren análisis por destino
4. **Optimización** de rutas multi-destino
