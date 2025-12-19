/**
 * Vista del Módulo de Resumen
 * Maneja la visualización del resumen del despacho
 */

class ResumenView {
    constructor() {
        this.volumenTotalSpan = document.getElementById('volumenTotal');
        this.valorTotalSpan = document.getElementById('valorTotalProductos');
        this.tipoCamionSpan = document.getElementById('tipoCamion');
        this.ocupacionSpan = document.getElementById('ocupacionReal');
        this.fleteTotalSpan = document.getElementById('fleteTotal');
        this.detalleClientesContainer = document.getElementById('detalleClientesContainer');
    }

    /**
     * Actualiza el resumen general
     */
    actualizarResumen(datos) {
        this.volumenTotalSpan.textContent = `${datos.volumenTotal.toFixed(2)} m³`;
        this.valorTotalSpan.textContent = `$ ${datos.valorTotal.toLocaleString()}`;
        this.tipoCamionSpan.textContent = datos.tipoCamion || '-';
        this.ocupacionSpan.textContent = datos.ocupacion || '-';
        this.fleteTotalSpan.textContent = datos.fleteTotal ? `$ ${datos.fleteTotal.toLocaleString()}` : '$ 0';
    }

    /**
     * Renderiza el detalle de clientes
     */
    renderizarDetalleClientes(clientes) {
        if (!clientes || clientes.length === 0) {
            this.detalleClientesContainer.innerHTML = '<p style="color: #64748b; font-size: 0.875em; text-align: center; padding: 20px;">No hay clientes agregados</p>';
            return;
        }

        this.detalleClientesContainer.innerHTML = '';

        clientes.forEach(cliente => {
            let volumenCliente = 0;
            let pesoCliente = 0;
            let valorCliente = 0;
            let cantidadProductos = 0;

            cliente.productos.forEach(producto => {
                volumenCliente += producto.volumenTotal;
                pesoCliente += producto.pesoTotal;
                valorCliente += producto.valorTotal;
                cantidadProductos += producto.unidades;
            });

            const clienteCard = document.createElement('div');
            clienteCard.style.cssText = 'background: #f8fafc; padding: 12px 16px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #2563eb; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: center;';

            clienteCard.innerHTML = `
                <div>
                    <strong style="color: #1a3a52; font-size: 0.9em;">${cliente.nombre}</strong>
                    <div style="color: #64748b; font-size: 0.8em; margin-top: 2px;">${cliente.destino.nombre} (${cliente.destino.distancia} km)</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Productos</div>
                    <div style="color: #1a3a52; font-weight: 600; font-size: 0.9em;">${cliente.productos.length} tipo(s)</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Unidades</div>
                    <div style="color: #1a3a52; font-weight: 600; font-size: 0.9em;">${cantidadProductos}</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Volumen</div>
                    <div style="color: #2563eb; font-weight: 600; font-size: 0.9em;">${volumenCliente.toFixed(2)} m³</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Peso</div>
                    <div style="color: #8b5cf6; font-weight: 600; font-size: 0.9em;">${pesoCliente.toFixed(1)} kg</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Valor</div>
                    <div style="color: #10b981; font-weight: 600; font-size: 0.9em;">$ ${valorCliente.toLocaleString()}</div>
                </div>
            `;

            this.detalleClientesContainer.appendChild(clienteCard);
        });
    }
}
