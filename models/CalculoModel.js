/**
 * Modelo de Cálculo
 * Maneja toda la lógica de negocio para el cálculo de fletes
 */

class CalculoModel {
    constructor(rutaModel, camionModel) {
        this.rutaModel = rutaModel;
        this.camionModel = camionModel;
    }

    /**
     * Calcula la distribución del flete entre clientes y productos
     * Usa el método proporcional: Volumen × Distancia
     */
    calcularFleteDespacho(despacho) {
        if (!despacho.ruta || !despacho.tipoCamionSeleccionado) {
            throw new Error('Faltan datos del despacho');
        }

        const fleteTotal = this.rutaModel.obtenerTarifa(
            despacho.ruta.id, 
            despacho.tipoCamionSeleccionado
        );

        const volumenTotal = despacho.calcularVolumenTotal();

        // Calcular factores de ponderación para cada cliente
        let totalFactorPonderado = 0;

        despacho.clientes.forEach(cliente => {
            let volumenCliente = 0;
            cliente.productos.forEach(producto => {
                volumenCliente += producto.volumenTotal;
            });

            // Factor de ponderación = Volumen × Distancia
            cliente.factorPonderacion = volumenCliente * cliente.destino.distancia;
            totalFactorPonderado += cliente.factorPonderacion;
        });

        // Asignar flete proporcionalmente
        despacho.clientes.forEach(cliente => {
            let volumenCliente = 0;
            cliente.productos.forEach(producto => {
                volumenCliente += producto.volumenTotal;
            });

            // Participación del cliente en el flete total
            cliente.participacionFlete = (cliente.factorPonderacion / totalFactorPonderado) * 100;
            cliente.fleteAsignado = (cliente.factorPonderacion / totalFactorPonderado) * fleteTotal;

            // Distribuir el flete del cliente entre sus productos
            cliente.productos.forEach(producto => {
                producto.participacionVolumen = (producto.volumenTotal / volumenTotal) * 100;
                producto.participacionVolumenCliente = (producto.volumenTotal / volumenCliente) * 100;

                // Flete proporcional al volumen dentro del cliente
                producto.fleteAsignado = (producto.volumenTotal / volumenCliente) * cliente.fleteAsignado;
                producto.porcentajeFleteVenta = (producto.fleteAsignado / producto.valorTotal) * 100;
            });
        });

        return {
            fleteTotal: fleteTotal,
            totalFactorPonderado: totalFactorPonderado,
            volumenTotal: volumenTotal,
            despacho: despacho
        };
    }

    /**
     * Genera análisis mixto (operativo y financiero)
     */
    generarAnalisisMixto(despacho, resultadoCalculo) {
        const volumenTotal = despacho.calcularVolumenTotal();
        const pesoTotal = despacho.calcularPesoTotal();
        const fleteTotal = resultadoCalculo.fleteTotal;

        // Análisis operativo (por volumen y distancia)
        const clientesOperativos = despacho.clientes.map(c => {
            let vol = 0;
            c.productos.forEach(p => vol += p.volumenTotal);
            return {
                nombre: c.nombre,
                valor: vol,
                porcentaje: c.participacionFlete || 0
            };
        }).sort((a, b) => b.porcentaje - a.porcentaje);

        // Análisis financiero (por peso)
        const clientesFinancieros = despacho.clientes.map(c => {
            let peso = 0;
            c.productos.forEach(p => peso += p.pesoTotal);
            return {
                nombre: c.nombre,
                peso: peso,
                porcentaje: (peso / pesoTotal * 100)
            };
        }).sort((a, b) => b.peso - a.peso);

        return {
            operativo: {
                metodo: 'Volumen × Distancia',
                volumenTotal: volumenTotal,
                fleteTotal: fleteTotal,
                topClientes: clientesOperativos.slice(0, 3)
            },
            financiero: {
                metodo: 'Peso × Costo SAP',
                pesoTotal: pesoTotal,
                topClientes: clientesFinancieros.slice(0, 3),
                estado: 'Pendiente integración SAP'
            }
        };
    }

    /**
     * Genera datos para el reporte de productos
     */
    generarReporteProductos(despacho) {
        const productos = [];

        despacho.clientes.forEach(cliente => {
            cliente.productos.forEach(producto => {
                productos.push({
                    cliente: cliente.nombre,
                    destino: cliente.destino.nombre,
                    distancia: cliente.destino.distancia,
                    producto: producto.nombre,
                    unidades: producto.unidades,
                    volumenUnitario: producto.volumenUnitario,
                    volumenTotal: producto.volumenTotal,
                    pesoUnitario: producto.pesoUnitario,
                    pesoTotal: producto.pesoTotal,
                    precioUnitario: producto.precioUnitario,
                    valorTotal: producto.valorTotal,
                    fleteAsignado: producto.fleteAsignado,
                    porcentajeFleteVenta: producto.porcentajeFleteVenta
                });
            });
        });

        return productos;
    }

    /**
     * Genera datos para el reporte de clientes
     */
    generarReporteClientes(despacho) {
        return despacho.clientes.map(cliente => {
            let volumenTotal = 0;
            let pesoTotal = 0;
            let valorTotal = 0;
            let fleteTotal = 0;

            cliente.productos.forEach(producto => {
                volumenTotal += producto.volumenTotal;
                pesoTotal += producto.pesoTotal;
                valorTotal += producto.valorTotal;
                fleteTotal += producto.fleteAsignado;
            });

            const porcentajeFleteVenta = (fleteTotal / valorTotal) * 100;

            return {
                nombre: cliente.nombre,
                destino: cliente.destino.nombre,
                distancia: cliente.destino.distancia,
                volumenTotal: volumenTotal,
                pesoTotal: pesoTotal,
                factorPonderacion: cliente.factorPonderacion,
                participacionFlete: cliente.participacionFlete,
                valorTotal: valorTotal,
                fleteTotal: fleteTotal,
                porcentajeFleteVenta: porcentajeFleteVenta
            };
        });
    }

    /**
     * Genera reporte completo en formato texto
     */
    generarReporteTexto(despacho, resultadoCalculo, camion) {
        let contenido = "=".repeat(80) + "\n";
        contenido += "REPORTE DE DESPACHO - GE LOGÍSTICA S.A.S.\n";
        contenido += "=".repeat(80) + "\n\n";
        
        contenido += `Fecha: ${despacho.fecha}\n`;
        contenido += `Ruta: ${despacho.ruta.nombre}\n`;
        contenido += `Observaciones: ${despacho.observaciones}\n\n`;

        contenido += `Volumen Total: ${resultadoCalculo.volumenTotal.toFixed(2)} m³\n`;
        contenido += `Tipo Camión: ${camion.nombre}\n`;
        const ocupacion = this.camionModel.calcularOcupacion(camion.capacidad, resultadoCalculo.volumenTotal);
        contenido += `Ocupación: ${ocupacion.toFixed(1)}%\n`;
        contenido += `Flete Total: $ ${resultadoCalculo.fleteTotal.toLocaleString()}\n\n`;

        contenido += "=".repeat(80) + "\n";
        contenido += "DETALLE POR PRODUCTO\n";
        contenido += "=".repeat(80) + "\n\n";

        despacho.clientes.forEach(cliente => {
            contenido += `\nCliente: ${cliente.nombre}\n`;
            contenido += "-".repeat(80) + "\n";
            
            cliente.productos.forEach(producto => {
                contenido += `  Producto: ${producto.nombre}\n`;
                contenido += `  Unidades: ${producto.unidades}\n`;
                contenido += `  Volumen Total: ${producto.volumenTotal.toFixed(2)} m³\n`;
                contenido += `  Participación: ${producto.participacionVolumen.toFixed(2)}%\n`;
                contenido += `  Valor Total: $ ${producto.valorTotal.toLocaleString()}\n`;
                contenido += `  Flete Asignado: $ ${producto.fleteAsignado.toLocaleString()}\n`;
                contenido += `  % Flete/Venta: ${producto.porcentajeFleteVenta.toFixed(2)}%\n\n`;
            });
        });

        return contenido;
    }
}
