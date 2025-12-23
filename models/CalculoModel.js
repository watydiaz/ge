/**
 * Modelo de Cálculo
 * Maneja toda la lógica de negocio para el cálculo de fletes
 * Distribuye el costo del flete entre pedidos según cubicaje, distancia, etc.
 */

class CalculoModel {
    constructor(rutaModel, camionModel) {
        this.rutaModel = rutaModel;
        this.camionModel = camionModel;
    }

    /**
     * Calcula y distribuye el flete entre todos los pedidos
     * Método proporcional: Volumen ocupado por cada pedido
     */
    async calcularFleteDespacho(despacho) {
        if (!despacho.ruta || !despacho.tipoCamionSeleccionado) {
            throw new Error('Debe seleccionar ruta y tipo de camión');
        }

        if (despacho.pedidos.length === 0) {
            throw new Error('No hay pedidos en el despacho');
        }

        // Obtener tarifa base del flete (ruta + camión)
        const fleteTotalBase = await this.rutaModel.obtenerTarifa(
            despacho.rutaId, 
            despacho.tipoCamionSeleccionado
        );

        // El flete está en miles, convertir a pesos
        const fleteTotal = fleteTotalBase * 1000;

        const volumenTotal = despacho.calcularVolumenTotal();
        const pesoTotal = despacho.calcularPesoTotal();
        const valorTotal = despacho.calcularValorTotal();

        // Calcular suma ponderada (volumen × distancia)
        const sumaPonderada = despacho.pedidos.reduce((sum, p) => 
            sum + (p.volumenTotal * (p.distancia || 0)), 0
        );

        // Calcular flete asignado a cada pedido
        const pedidosConFlete = despacho.pedidos.map(pedido => {
            // Porcentaje de participación en el volumen total
            const participacionVolumen = (pedido.volumenTotal / volumenTotal) * 100;
            
            // Ponderación por volumen × distancia
            const ponderacion = pedido.volumenTotal * (pedido.distancia || 0);
            
            // Flete asignado ponderadamente
            let fleteAsignado;
            if (sumaPonderada > 0) {
                // Distribución ponderada: (Volumen × Distancia) / Suma Total
                fleteAsignado = (ponderacion / sumaPonderada) * fleteTotal;
            } else {
                // Si no hay distancias, distribuir solo por volumen
                fleteAsignado = (pedido.volumenTotal / volumenTotal) * fleteTotal;
            }
            
            // Flete por unidad
            const fletePorUnidad = fleteAsignado / pedido.cantidad;
            
            // Porcentaje del flete vs valor del producto
            const porcentajeFleteVenta = pedido.valorTotal > 0 
                ? (fleteAsignado / pedido.valorTotal) * 100 
                : 0;

            // Costo total (producto + flete)
            const costoTotalConFlete = pedido.valorTotal + fleteAsignado;
            const costoUnitarioConFlete = costoTotalConFlete / pedido.cantidad;

            return {
                ...pedido,
                participacionVolumen,
                ponderacion,
                fleteAsignado,
                fletePorUnidad,
                porcentajeFleteVenta,
                costoTotalConFlete,
                costoUnitarioConFlete
            };
        });

        return {
            // Totales generales
            fleteTotal,
            volumenTotal,
            pesoTotal,
            valorTotal,
            sumaPonderada,
            capacidadCamion: despacho.capacidadCamion,
            porcentajeOcupacion: despacho.obtenerPorcentajeOcupacion(),
            
            // Información de ruta y camión
            ruta: despacho.ruta,
            tipoCamion: despacho.tipoCamionSeleccionado,
            
            // Pedidos con flete calculado
            pedidos: pedidosConFlete,
            cantidadPedidos: pedidosConFlete.length,
            
            // Promedios
            fletePromedioPorM3: fleteTotal / volumenTotal,
            fletePromedioPorKg: pesoTotal > 0 ? fleteTotal / pesoTotal : 0,
            
            // Metadata
            fecha: despacho.fecha || new Date().toISOString().split('T')[0],
            observaciones: despacho.observaciones
        };
    }

    /**
     * Genera análisis por cliente (agrupando pedidos)
     */
    generarAnalisisPorCliente(resultado) {
        const clientesMap = {};

        resultado.pedidos.forEach(pedido => {
            if (!clientesMap[pedido.cliente]) {
                clientesMap[pedido.cliente] = {
                    cliente: pedido.cliente,
                    pedidos: [],
                    volumenTotal: 0,
                    pesoTotal: 0,
                    valorTotal: 0,
                    fleteAsignado: 0,
                    cantidadItems: 0
                };
            }

            const clienteData = clientesMap[pedido.cliente];
            clienteData.pedidos.push(pedido);
            clienteData.volumenTotal += pedido.volumenTotal;
            clienteData.pesoTotal += pedido.pesoTotal;
            clienteData.valorTotal += pedido.valorTotal;
            clienteData.fleteAsignado += pedido.fleteAsignado;
            clienteData.cantidadItems += pedido.cantidad;
        });

        // Convertir a array y calcular porcentajes
        const clientes = Object.values(clientesMap).map(cliente => ({
            ...cliente,
            participacionVolumen: (cliente.volumenTotal / resultado.volumenTotal) * 100,
            participacionFlete: (cliente.fleteAsignado / resultado.fleteTotal) * 100,
            porcentajeFleteVenta: cliente.valorTotal > 0 
                ? (cliente.fleteAsignado / cliente.valorTotal) * 100 
                : 0
        }));

        // Ordenar por flete asignado (mayor a menor)
        return clientes.sort((a, b) => b.fleteAsignado - a.fleteAsignado);
    }

    /**
     * Calcula el costo por m³ efectivo vs capacidad total
     */
    calcularEficiencia(resultado) {
        const espacioDesaprovechado = resultado.capacidadCamion - resultado.volumenTotal;
        const costoEspacioDesaprovechado = (espacioDesaprovechado / resultado.capacidadCamion) * resultado.fleteTotal;

        return {
            espacioUtilizado: resultado.volumenTotal,
            espacioDisponible: resultado.capacidadCamion,
            espacioDesaprovechado,
            porcentajeEficiencia: resultado.porcentajeOcupacion,
            costoEspacioDesaprovechado,
            costoRealPorM3: resultado.fleteTotal / resultado.volumenTotal,
            costoPotencialPorM3: resultado.fleteTotal / resultado.capacidadCamion
        };
    }
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculoModel;
}
