    /**
     * Obtiene la tarifa de flete según la ruta y el tipo de camión seleccionado
     */
    obtenerTarifa() {
        if (!this.ruta || !this.tipoCamionSeleccionado) return 0;
        // RutaModel debe estar disponible globalmente o inyectarse
        if (typeof RutaModel === 'function') {
            // Instancia temporal para obtener tarifa
            const rutaModel = new RutaModel();
            return rutaModel.obtenerTarifaPorTipoCamion(this.ruta.id, this.tipoCamionSeleccionado) || 0;
        }
        // Si la instancia está en this.rutaModel, usarla
        if (this.rutaModel && typeof this.rutaModel.obtenerTarifaPorTipoCamion === 'function') {
            return this.rutaModel.obtenerTarifaPorTipoCamion(this.ruta.id, this.tipoCamionSeleccionado) || 0;
        }
        return 0;
    }
/**
 * Modelo de Despacho
 * Gestiona el estado y lógica de negocio del despacho
 * Funciona como calculadora de fletes
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
        this.rutaId = null;
        this.fecha = null;
        this.observaciones = "";
        this.pedidos = []; // Lista de pedidos/productos
        this.contadorPedidos = 0;
        this.tipoCamionSeleccionado = null;
        this.capacidadCamion = 0; // m³
    }

    /**
     * Establece la ruta del despacho
     */
    establecerRuta(ruta) {
        this.ruta = ruta;
        this.rutaId = ruta ? ruta.id : null;
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
        this.capacidadCamion = parseFloat(capacidad);
    }

    /**
     * Agrega un nuevo pedido/producto al despacho
     */
    agregarPedido(datos) {
        this.contadorPedidos++;
        const pedidoId = `pedido_${this.contadorPedidos}`;

        // Calcular totales
        const volumenTotal = datos.volumenUnitario * datos.cantidad;
        const pesoTotal = datos.pesoUnitario * datos.cantidad;
        const valorTotal = (datos.precioUnitario || 0) * datos.cantidad;

        const pedido = {
            id: pedidoId,
            // Datos del cliente/destino
            cliente: datos.cliente || 'Cliente General',
            destino: datos.destino || 'Destino Final',
            distancia: datos.distancia || 0,
            ordenCompra: datos.ordenCompra || `OC-${this.contadorPedidos}`,
            
            // Datos del producto
            producto: datos.producto,
            cantidad: datos.cantidad,
            
            // Dimensiones unitarias
            volumenUnitario: datos.volumenUnitario, // m³
            pesoUnitario: datos.pesoUnitario, // kg
            precioUnitario: datos.precioUnitario || 0,
            
            // Totales calculados
            volumenTotal,
            pesoTotal,
            valorTotal,
            
            // Metadata
            fechaAgregado: new Date().toISOString()
        };

        this.pedidos.push(pedido);
        return pedido;
    }

    /**
     * Elimina un pedido del despacho
     */
    eliminarPedido(pedidoId) {
        this.pedidos = this.pedidos.filter(p => p.id !== pedidoId);
    }

    /**
     * Obtiene un pedido por su ID
     */
    obtenerPedido(pedidoId) {
        return this.pedidos.find(p => p.id === pedidoId);
    }

    /**
     * Calcula el volumen total ocupado
     */
    calcularVolumenTotal() {
        return this.pedidos.reduce((total, p) => total + p.volumenTotal, 0);
    }

    /**
     * Calcula el peso total
     */
    calcularPesoTotal() {
        return this.pedidos.reduce((total, p) => total + p.pesoTotal, 0);
    }

    /**
     * Calcula el valor total de la carga
     */
    calcularValorTotal() {
        return this.pedidos.reduce((total, p) => total + p.valorTotal, 0);
    }

    /**
     * Verifica si hay capacidad disponible para un nuevo pedido
     */
    verificarCapacidad(volumenNuevo) {
        const volumenActual = this.calcularVolumenTotal();
        const volumenFinal = volumenActual + volumenNuevo;
        
        return {
            hayCapacidad: volumenFinal <= this.capacidadCamion,
            volumenActual,
            volumenNuevo,
            volumenFinal,
            capacidadCamion: this.capacidadCamion,
            espacioDisponible: this.capacidadCamion - volumenActual,
            porcentajeUso: (volumenFinal / this.capacidadCamion) * 100
        };
    }

    /**
     * Obtiene el porcentaje de ocupación del camión
     */
    obtenerPorcentajeOcupacion() {
        if (!this.capacidadCamion) return 0;
        return (this.calcularVolumenTotal() / this.capacidadCamion) * 100;
    }

    /**
     * Valida si el despacho está listo para calcular
     */
    validarDespacho() {
        const errores = [];

        if (!this.ruta) {
            errores.push('Debe seleccionar una ruta');
        }

        if (!this.tipoCamionSeleccionado) {
            errores.push('Debe seleccionar un tipo de camión');
        }

        if (this.pedidos.length === 0) {
            errores.push('Debe agregar al menos un pedido/producto');
        }

        const volumenTotal = this.calcularVolumenTotal();
        if (volumenTotal > this.capacidadCamion) {
            errores.push(`El volumen total (${volumenTotal.toFixed(2)} m³) excede la capacidad del camión (${this.capacidadCamion} m³)`);
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }

    /**
     * Obtiene todos los pedidos
     */
    obtenerPedidos() {
        return this.pedidos;
    }

    /**
     * Obtiene resumen del despacho
     */
    obtenerResumen() {
        return {
            ruta: this.ruta,
            fecha: this.fecha,
            tipoCamion: this.tipoCamionSeleccionado,
            capacidadCamion: this.capacidadCamion,
            cantidadPedidos: this.pedidos.length,
            volumenTotal: this.calcularVolumenTotal(),
            pesoTotal: this.calcularPesoTotal(),
            valorTotal: this.calcularValorTotal(),
            porcentajeOcupacion: this.obtenerPorcentajeOcupacion(),
            observaciones: this.observaciones
        };
    }
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DespachoModel;
}
