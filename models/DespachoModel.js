/**
 * Modelo de Despacho
 * Gestiona el estado y lógica de negocio del despacho
 */

class DespachoModel {
    constructor() {
        this.reset();
    }

    /**
     * Resetea el despacho a su estado inicial
     */
    reset() {
        this.ruta = null;
        this.fecha = null;
        this.observaciones = "";
        this.clientes = [];
        this.contadorClientes = 0;
        this.tipoCamionSeleccionado = null;
    }

    /**
     * Establece la ruta del despacho
     */
    establecerRuta(ruta) {
        this.ruta = ruta;
    }

    /**
     * Establece la fecha del despacho
     */
    establecerFecha(fecha) {
        this.fecha = fecha;
    }

    /**
     * Establece las observaciones del despacho
     */
    establecerObservaciones(observaciones) {
        this.observaciones = observaciones;
    }

    /**
     * Establece el tipo de camión seleccionado
     */
    establecerTipoCamion(capacidad) {
        this.tipoCamionSeleccionado = capacidad;
    }

    /**
     * Agrega un nuevo cliente al despacho
     */
    agregarCliente(datos) {
        this.contadorClientes++;
        const clienteId = `cliente_${this.contadorClientes}`;

        const cliente = {
            id: clienteId,
            nombre: datos.nombre,
            destino: datos.destino,
            ordenCompra: datos.ordenCompra || 'N/A',
            productos: []
        };

        this.clientes.push(cliente);
        return cliente;
    }

    /**
     * Elimina un cliente del despacho
     */
    eliminarCliente(clienteId) {
        this.clientes = this.clientes.filter(c => c.id !== clienteId);
    }

    /**
     * Obtiene un cliente por su ID
     */
    obtenerCliente(clienteId) {
        return this.clientes.find(c => c.id === clienteId);
    }

    /**
     * Agrega un producto a un cliente
     */
    agregarProducto(clienteId, datos) {
        const cliente = this.obtenerCliente(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        const productoId = `${clienteId}_prod_${cliente.productos.length + 1}`;

        const producto = {
            id: productoId,
            nombre: datos.nombre,
            volumenUnitario: datos.volumenUnitario,
            pesoUnitario: datos.pesoUnitario,
            unidades: datos.unidades,
            precioUnitario: datos.precioUnitario,
            volumenTotal: datos.volumenUnitario * datos.unidades,
            pesoTotal: datos.pesoUnitario * datos.unidades,
            valorTotal: datos.precioUnitario * datos.unidades
        };

        cliente.productos.push(producto);
        return producto;
    }

    /**
     * Elimina un producto de un cliente
     */
    eliminarProducto(clienteId, productoId) {
        const cliente = this.obtenerCliente(clienteId);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        cliente.productos = cliente.productos.filter(p => p.id !== productoId);
    }

    /**
     * Calcula el volumen total del despacho
     */
    calcularVolumenTotal() {
        let total = 0;
        this.clientes.forEach(cliente => {
            cliente.productos.forEach(producto => {
                total += producto.volumenTotal;
            });
        });
        return total;
    }

    /**
     * Calcula el peso total del despacho
     */
    calcularPesoTotal() {
        let total = 0;
        this.clientes.forEach(cliente => {
            cliente.productos.forEach(producto => {
                total += producto.pesoTotal;
            });
        });
        return total;
    }

    /**
     * Calcula el valor total del despacho
     */
    calcularValorTotal() {
        let total = 0;
        this.clientes.forEach(cliente => {
            cliente.productos.forEach(producto => {
                total += producto.valorTotal;
            });
        });
        return total;
    }

    /**
     * Valida que el despacho esté listo para calcular
     */
    validarDespacho() {
        const errores = [];

        if (!this.ruta) {
            errores.push('Debe seleccionar una ruta');
        }

        if (!this.tipoCamionSeleccionado) {
            errores.push('Debe seleccionar un tipo de camión');
        }

        if (this.clientes.length === 0) {
            errores.push('Debe agregar al menos un cliente');
        }

        let tieneProductos = false;
        this.clientes.forEach(cliente => {
            if (cliente.productos.length > 0) {
                tieneProductos = true;
            }
        });

        if (!tieneProductos) {
            errores.push('Debe agregar productos a los clientes');
        }

        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    /**
     * Obtiene datos resumidos del despacho
     */
    obtenerResumen() {
        return {
            volumenTotal: this.calcularVolumenTotal(),
            pesoTotal: this.calcularPesoTotal(),
            valorTotal: this.calcularValorTotal(),
            numeroClientes: this.clientes.length,
            numeroProductos: this.clientes.reduce((sum, c) => sum + c.productos.length, 0)
        };
    }
}
