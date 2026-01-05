// Archivo de datos hardcodeados para pruebas y desarrollo

// Ejemplo de rutas
export const rutas = [
  { id: 1, nombre: 'Bogotá - Medellín', distancia: 420 },
  { id: 2, nombre: 'Bogotá - Cali', distancia: 470 },
  { id: 3, nombre: 'Bogotá - Barranquilla', distancia: 980 }
];

// Ejemplo de valores por tipo de camión
export const tiposCamion = [
  { id: 1, tipo: 'Camión pequeño', capacidad: 3, costo: 500000 },
  { id: 2, tipo: 'Camión mediano', capacidad: 8, costo: 900000 },
  { id: 3, tipo: 'Camión grande', capacidad: 20, costo: 1800000 }
];

// Ejemplo de productos para un pedido SAP
export const productosEjemploSAP = [
  { codigo: '1001', descripcion: 'Colchón Sencillo', lote: 'L001', unidad: 'UN', cantidad: 2, picking: 2 },
  { codigo: '1002', descripcion: 'Colchón Doble', lote: 'L002', unidad: 'UN', cantidad: 1, picking: 1 },
  { codigo: '1003', descripcion: 'Base Cama', lote: 'L003', unidad: 'UN', cantidad: 1, picking: 1 }
];

// Ejemplo de pedido SAP completo
export const pedidoEjemploSAP = {
  pedido: '729181',
  fecha: '2026-01-05',
  cliente: 'HOYOS HOYOS DAGOBERTO',
  nit: '83028606',
  direccion: 'CR 66 A # 92 BR PRADERA',
  ciudad: 'BOGOTA',
  zona: 'BOGOTA',
  transporte: 'TR-001',
  ruta: 'Bogotá - Medellín',
  observaciones: 'Entrega urgente',
  productos: productosEjemploSAP,
  costoSAP: 'Pendiente de integración'
};
