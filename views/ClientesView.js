/**
 * Vista del Módulo de Gestión de Clientes
 * Maneja la renderización de clientes y productos
 */

class ClientesView {
    constructor() {
        this.clientesContainer = document.getElementById('clientesContainer');
        this.alertaCapacidad = document.getElementById('alertaCapacidad');
    }

    /**
     * Renderiza un nuevo cliente en el DOM
     */
    renderizarCliente(cliente) {
        const clienteDiv = document.createElement('div');
        clienteDiv.className = 'cliente-item';
        clienteDiv.id = cliente.id;
        
        clienteDiv.innerHTML = `
            <div class="cliente-header">
                <div>
                    <h3>${cliente.nombre} <span style="font-size: 0.8em; color: #64748b; font-weight: normal;">[${cliente.ordenCompra}]</span></h3>
                    <small style="color: #7f8c8d;">${cliente.destino.nombre} - ${cliente.destino.distancia} km</small>
                </div>
                <button onclick="appController.eliminarCliente('${cliente.id}')" class="btn-danger">Eliminar</button>
            </div>
            
            <div class="producto-form">
                <input type="text" placeholder="Nombre Producto" id="${cliente.id}_nombreProducto">
                <input type="number" placeholder="Vol. (m³)" step="0.01" id="${cliente.id}_volumenUnitario">
                <input type="number" placeholder="Peso (kg)" step="0.1" id="${cliente.id}_pesoUnitario">
                <input type="number" placeholder="Unidades" id="${cliente.id}_unidades">
                <input type="number" placeholder="Precio Unit." id="${cliente.id}_precioUnitario">
                <button onclick="appController.agregarProducto('${cliente.id}')" class="btn-secondary">+ Agregar</button>
            </div>
            
            <div id="${cliente.id}_productos"></div>
        `;
        
        this.clientesContainer.appendChild(clienteDiv);
    }

    /**
     * Elimina un cliente del DOM
     */
    eliminarCliente(clienteId) {
        const elemento = document.getElementById(clienteId);
        if (elemento) {
            elemento.remove();
        }
    }

    /**
     * Renderiza un producto dentro de un cliente
     */
    renderizarProducto(clienteId, producto) {
        const container = document.getElementById(`${clienteId}_productos`);
        
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto-item';
        productoDiv.id = producto.id;
        
        productoDiv.innerHTML = `
            <span><strong>${producto.nombre}</strong></span>
            <span>${producto.unidades} uds</span>
            <span>${producto.volumenUnitario.toFixed(2)} m³/ud</span>
            <span>${producto.volumenTotal.toFixed(2)} m³ total</span>
            <span>${producto.pesoUnitario.toFixed(1)} kg/ud</span>
            <span>${producto.pesoTotal.toFixed(1)} kg total</span>
            <span>$ ${producto.valorTotal.toLocaleString()}</span>
            <button onclick="appController.eliminarProducto('${clienteId}', '${producto.id}')" class="btn-danger" style="padding: 5px 10px;">Eliminar</button>
        `;
        
        container.appendChild(productoDiv);
    }

    /**
     * Elimina un producto del DOM
     */
    eliminarProducto(productoId) {
        const elemento = document.getElementById(productoId);
        if (elemento) {
            elemento.remove();
        }
    }

    /**
     * Limpia el formulario de producto de un cliente
     */
    limpiarFormularioProducto(clienteId) {
        document.getElementById(`${clienteId}_nombreProducto`).value = '';
        document.getElementById(`${clienteId}_volumenUnitario`).value = '';
        document.getElementById(`${clienteId}_pesoUnitario`).value = '';
        document.getElementById(`${clienteId}_unidades`).value = '';
        document.getElementById(`${clienteId}_precioUnitario`).value = '';
    }

    /**
     * Obtiene los datos del formulario de producto
     */
    obtenerDatosProducto(clienteId) {
        return {
            nombre: document.getElementById(`${clienteId}_nombreProducto`).value.trim(),
            volumenUnitario: parseFloat(document.getElementById(`${clienteId}_volumenUnitario`).value),
            pesoUnitario: parseFloat(document.getElementById(`${clienteId}_pesoUnitario`).value),
            unidades: parseInt(document.getElementById(`${clienteId}_unidades`).value),
            precioUnitario: parseFloat(document.getElementById(`${clienteId}_precioUnitario`).value)
        };
    }

    /**
     * Limpia el contenedor de clientes
     */
    limpiar() {
        this.clientesContainer.innerHTML = '';
    }

    /**
     * Muestra alerta de capacidad del camión
     */
    mostrarAlertaCapacidad(tipo, mensaje) {
        this.alertaCapacidad.innerHTML = mensaje;
        this.alertaCapacidad.className = `alert alert-${tipo}`;
        this.alertaCapacidad.style.display = 'block';
    }

    /**
     * Oculta la alerta de capacidad
     */
    ocultarAlertaCapacidad() {
        this.alertaCapacidad.style.display = 'none';
    }
}
