/**
 * Vista del Módulo de Reportes
 * Maneja la visualización de los reportes finales
 */

class ReportesView {
    constructor() {
        this.reporteSection = document.getElementById('reporteSection');
        this.tablaProductosBody = document.getElementById('tablaProductosBody');
        this.tablaClientesBody = document.getElementById('tablaClientesBody');
        this.resumenOperativo = document.getElementById('resumenOperativo');
        this.resumenFinanciero = document.getElementById('resumenFinanciero');
    }

    /**
     * Muestra la sección de reportes
     */
    mostrar() {
        this.reporteSection.style.display = 'block';
        this.reporteSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Oculta la sección de reportes
     */
    ocultar() {
        this.reporteSection.style.display = 'none';
    }

    /**
     * Renderiza el reporte de productos
     */
    renderizarReporteProductos(productos) {
        this.tablaProductosBody.innerHTML = '';

        productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${producto.cliente}</strong></td>
                <td>${producto.destino}</td>
                <td>${producto.distancia}</td>
                <td>${producto.producto}</td>
                <td>${producto.unidades}</td>
                <td>${producto.volumenUnitario.toFixed(2)}</td>
                <td>${producto.volumenTotal.toFixed(2)}</td>
                <td>${producto.pesoUnitario.toFixed(1)}</td>
                <td>${producto.pesoTotal.toFixed(1)}</td>
                <td>$ ${producto.precioUnitario.toLocaleString()}</td>
                <td>$ ${producto.valorTotal.toLocaleString()}</td>
                <td><strong>$ ${producto.fleteAsignado.toLocaleString()}</strong></td>
                <td style="color: ${producto.porcentajeFleteVenta > 15 ? 'red' : 'green'}; font-weight: bold;">
                    ${producto.porcentajeFleteVenta.toFixed(2)}%
                </td>
            `;
            this.tablaProductosBody.appendChild(tr);
        });
    }

    /**
     * Renderiza el reporte de clientes
     */
    renderizarReporteClientes(clientes) {
        this.tablaClientesBody.innerHTML = '';

        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${cliente.nombre}</strong></td>
                <td>${cliente.destino}</td>
                <td>${cliente.distancia}</td>
                <td>${cliente.volumenTotal.toFixed(2)}</td>
                <td>${cliente.pesoTotal.toFixed(1)}</td>
                <td>${cliente.factorPonderacion.toFixed(2)}</td>
                <td><strong>${cliente.participacionFlete.toFixed(2)}%</strong></td>
                <td>$ ${cliente.valorTotal.toLocaleString()}</td>
                <td><strong>$ ${cliente.fleteTotal.toLocaleString()}</strong></td>
                <td style="color: ${cliente.porcentajeFleteVenta > 15 ? 'red' : 'green'}; font-weight: bold;">
                    ${cliente.porcentajeFleteVenta.toFixed(2)}%
                </td>
            `;
            this.tablaClientesBody.appendChild(tr);
        });
    }

    /**
     * Renderiza el análisis mixto
     */
    renderizarAnalisisMixto(analisis) {
        // Renderizar dimensión operativa
        let htmlOperativo = '<div style="font-size: 0.85em; line-height: 1.8;">';
        htmlOperativo += `<p style="margin: 5px 0;"><strong>Método:</strong> Flete asignado por <strong>${analisis.operativo.metodo}</strong></p>`;
        htmlOperativo += `<p style="margin: 5px 0;"><strong>Volumen Total:</strong> ${analisis.operativo.volumenTotal.toFixed(2)} m³</p>`;
        htmlOperativo += `<p style="margin: 5px 0;"><strong>Flete Total:</strong> $ ${analisis.operativo.fleteTotal.toLocaleString()}</p>`;
        htmlOperativo += `<p style="margin: 5px 0;"><strong>Objetivo:</strong> Distribución equitativa según ocupación y distancia</p>`;
        
        htmlOperativo += '<hr style="margin: 12px 0; border: none; border-top: 1px solid #bfdbfe;">';
        htmlOperativo += '<p style="margin: 8px 0 5px 0; font-weight: 600; color: #1e40af;">Top Clientes (Operativo):</p>';
        analisis.operativo.topClientes.forEach((c, i) => {
            htmlOperativo += `<p style="margin: 3px 0; font-size: 0.8em;">${i+1}. ${c.nombre}: ${c.porcentaje.toFixed(1)}% del flete</p>`;
        });
        htmlOperativo += '</div>';
        this.resumenOperativo.innerHTML = htmlOperativo;

        // Renderizar dimensión financiera
        let htmlFinanciero = '<div style="font-size: 0.85em; line-height: 1.8;">';
        htmlFinanciero += `<p style="margin: 5px 0;"><strong>Método:</strong> Análisis futuro por <strong>${analisis.financiero.metodo}</strong></p>`;
        htmlFinanciero += `<p style="margin: 5px 0;"><strong>Peso Total:</strong> ${analisis.financiero.pesoTotal.toFixed(1)} kg</p>`;
        htmlFinanciero += `<p style="margin: 5px 0;"><strong>Estado:</strong> <span style="color: #dc2626;">${analisis.financiero.estado}</span></p>`;
        htmlFinanciero += `<p style="margin: 5px 0;"><strong>Objetivo:</strong> Rentabilidad por costo de producción (peso/valor)</p>`;
        
        htmlFinanciero += '<hr style="margin: 12px 0; border: none; border-top: 1px solid #bbf7d0;">';
        htmlFinanciero += '<p style="margin: 8px 0 5px 0; font-weight: 600; color: #166534;">Top Clientes (Financiero):</p>';
        analisis.financiero.topClientes.forEach((c, i) => {
            htmlFinanciero += `<p style="margin: 3px 0; font-size: 0.8em;">${i+1}. ${c.nombre}: ${c.peso.toFixed(1)} kg (${c.porcentaje.toFixed(1)}%)</p>`;
        });
        htmlFinanciero += '<p style="margin: 10px 0 5px 0; padding: 8px; background: #fef3c7; border-radius: 4px; font-size: 0.8em; color: #92400e;">⚠️ La dimensión financiera requiere integración con SAP para costos reales por peso</p>';
        htmlFinanciero += '</div>';
        this.resumenFinanciero.innerHTML = htmlFinanciero;
    }
}
