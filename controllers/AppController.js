/**
 * Controlador Principal de la Aplicación
 * Coordina las interacciones entre Modelos y Vistas
 */

class AppController {
    constructor() {
        // Inicializar Modelos
        this.rutaModel = new RutaModel();
        this.camionModel = new CamionModel();
        this.despachoModel = new DespachoModel();
        this.calculoModel = new CalculoModel(this.rutaModel, this.camionModel);

        // Inicializar Vistas
        this.configuracionView = new ConfiguracionViajeView();
        this.clientesView = new ClientesView();
        this.resumenView = new ResumenView();
        this.reportesView = new ReportesView();

        // Estado del cálculo
        this.ultimoCalculo = null;
    }

    /**
     * Inicializa la aplicación
     */
    inicializar() {
        this.configuracionView.renderizarRutas(this.rutaModel.obtenerRutas());
        this.configuracionView.establecerFechaActual();
        this.actualizarResumen();
    }

    /**
     * Maneja el cambio de ruta
     */
    cargarRuta() {
        const rutaId = this.configuracionView.obtenerRutaSeleccionada();

        if (!rutaId) {
            this.configuracionView.renderizarInfoRuta(null);
            this.configuracionView.renderizarDestinos([]);
            this.despachoModel.establecerRuta(null);
            return;
        }

        const ruta = this.rutaModel.obtenerRutaPorId(rutaId);
        this.despachoModel.establecerRuta(ruta);

        this.configuracionView.renderizarInfoRuta(ruta);
        this.configuracionView.renderizarDestinos(ruta.destinos);

        this.actualizarResumen();
    }

    /**
     * Valida y actualiza la capacidad del camión
     */
    validarCapacidadCamion() {
        const tipoCamion = this.configuracionView.obtenerTipoCamionSeleccionado();

        if (!tipoCamion) {
            this.clientesView.ocultarAlertaCapacidad();
            this.actualizarResumen();
            return;
        }

        this.despachoModel.establecerTipoCamion(tipoCamion);

        const volumenTotal = this.despachoModel.calcularVolumenTotal();
        const capacidadReal = this.camionModel.calcularCapacidadReal(tipoCamion);
        const porcentajeOcupacion = this.camionModel.calcularOcupacion(tipoCamion, volumenTotal);

        if (volumenTotal > capacidadReal) {
            const mensaje = `<strong>ADVERTENCIA:</strong> El volumen actual (${volumenTotal.toFixed(2)} m³) excede la capacidad del camión seleccionado (${capacidadReal.toFixed(2)} m³). No se pueden agregar más clientes.`;
            this.clientesView.mostrarAlertaCapacidad('danger', mensaje);
        } else if (porcentajeOcupacion > 90) {
            const mensaje = `<strong>ATENCIÓN:</strong> El camión está al ${porcentajeOcupacion.toFixed(1)}% de su capacidad. Espacio restante: ${(capacidadReal - volumenTotal).toFixed(2)} m³`;
            this.clientesView.mostrarAlertaCapacidad('warning', mensaje);
        } else {
            this.clientesView.ocultarAlertaCapacidad();
        }

        this.actualizarResumen();
    }

    /**
     * Agrega un nuevo destino a la ruta actual
     */
    agregarDestinoARuta() {
        if (!this.despachoModel.ruta) {
            alert('Primero seleccione una ruta');
            return;
        }

        const nombreDestino = document.getElementById('nuevoDestino').value.trim();
        const kilometros = parseInt(document.getElementById('nuevoDestinoKm').value);

        if (!nombreDestino) {
            alert('Ingrese el nombre del destino');
            return;
        }

        if (!kilometros || kilometros <= 0) {
            alert('Ingrese una distancia válida en kilómetros');
            return;
        }

        try {
            this.rutaModel.agregarDestino(this.despachoModel.ruta.id, {
                nombre: nombreDestino,
                distancia: kilometros
            });

            // Actualizar la ruta en el modelo de despacho
            const rutaActualizada = this.rutaModel.obtenerRutaPorId(this.despachoModel.ruta.id);
            this.despachoModel.establecerRuta(rutaActualizada);

            // Actualizar vistas
            this.configuracionView.renderizarInfoRuta(rutaActualizada);
            this.configuracionView.renderizarDestinos(rutaActualizada.destinos);
            this.configuracionView.limpiarFormularioDestino();
            this.configuracionView.mostrarConfirmacionDestino(nombreDestino);
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Agrega un nuevo cliente
     */
    agregarCliente() {
        const nombreCliente = document.getElementById('nombreCliente').value.trim();
        const destinoData = document.getElementById('destinoCliente').value;

        if (!nombreCliente) {
            alert('Por favor ingrese el nombre del cliente');
            return;
        }

        if (!destinoData) {
            alert('Por favor seleccione el destino del cliente');
            return;
        }

        const tipoCamion = this.configuracionView.obtenerTipoCamionSeleccionado();
        if (!tipoCamion) {
            alert('Por favor seleccione primero el tipo de camión en la sección de Configuración del Viaje');
            return;
        }

        const destino = JSON.parse(destinoData);
        const ordenCompra = document.getElementById('ordenCompraCliente').value.trim();

        const cliente = this.despachoModel.agregarCliente({
            nombre: nombreCliente,
            destino: destino,
            ordenCompra: ordenCompra
        });

        this.clientesView.renderizarCliente(cliente);

        // Limpiar formulario
        document.getElementById('nombreCliente').value = '';
        document.getElementById('destinoCliente').value = '';
        document.getElementById('ordenCompraCliente').value = '';
    }

    /**
     * Elimina un cliente
     */
    eliminarCliente(clienteId) {
        if (!confirm('¿Está seguro de eliminar este cliente y todos sus productos?')) {
            return;
        }

        this.despachoModel.eliminarCliente(clienteId);
        this.clientesView.eliminarCliente(clienteId);
        this.actualizarResumen();
    }

    /**
     * Agrega un producto a un cliente
     */
    agregarProducto(clienteId) {
        const datos = this.clientesView.obtenerDatosProducto(clienteId);

        if (!datos.nombre || !datos.volumenUnitario || !datos.pesoUnitario || !datos.unidades || !datos.precioUnitario) {
            alert('Por favor complete todos los campos del producto');
            return;
        }

        // Validar capacidad antes de agregar
        const tipoCamion = this.configuracionView.obtenerTipoCamionSeleccionado();
        if (tipoCamion) {
            const volumenActual = this.despachoModel.calcularVolumenTotal();
            const nuevoVolumen = datos.volumenUnitario * datos.unidades;
            const volumenConNuevo = volumenActual + nuevoVolumen;
            const capacidadReal = this.camionModel.calcularCapacidadReal(tipoCamion);

            if (volumenConNuevo > capacidadReal) {
                alert(`No se puede agregar el producto. El volumen total (${volumenConNuevo.toFixed(2)} m³) excedería la capacidad del camión (${capacidadReal.toFixed(2)} m³)`);
                return;
            }
        }

        try {
            const producto = this.despachoModel.agregarProducto(clienteId, datos);
            this.clientesView.renderizarProducto(clienteId, producto);
            this.clientesView.limpiarFormularioProducto(clienteId);
            this.actualizarResumen();
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Elimina un producto
     */
    eliminarProducto(clienteId, productoId) {
        try {
            this.despachoModel.eliminarProducto(clienteId, productoId);
            this.clientesView.eliminarProducto(productoId);
            this.actualizarResumen();
        } catch (error) {
            alert(error.message);
        }
    }

    /**
     * Actualiza el resumen del despacho
     */
    actualizarResumen() {
        const resumen = this.despachoModel.obtenerResumen();
        const tipoCamion = this.configuracionView.obtenerTipoCamionSeleccionado();

        let datosResumen = {
            volumenTotal: resumen.volumenTotal,
            valorTotal: resumen.valorTotal,
            tipoCamion: null,
            ocupacion: null,
            fleteTotal: null
        };

        if (tipoCamion) {
            const camion = this.camionModel.obtenerPorCapacidad(tipoCamion);
            const ocupacion = this.camionModel.calcularOcupacion(tipoCamion, resumen.volumenTotal);

            datosResumen.tipoCamion = camion.nombre;
            datosResumen.ocupacion = `${ocupacion.toFixed(1)}%`;

            if (this.despachoModel.ruta) {
                const fleteTotal = this.rutaModel.obtenerTarifa(this.despachoModel.ruta.id, tipoCamion);
                datosResumen.fleteTotal = fleteTotal;
            }
        }

        this.resumenView.actualizarResumen(datosResumen);
        this.resumenView.renderizarDetalleClientes(this.despachoModel.clientes);

        // Validar capacidad si hay camión seleccionado
        if (tipoCamion) {
            this.validarCapacidadCamion();
        }
    }

    /**
     * Calcula el despacho final
     */
    calcularDespacho() {
        // Validar despacho
        const validacion = this.despachoModel.validarDespacho();
        if (!validacion.valido) {
            alert(validacion.errores.join('\n'));
            return;
        }

        // Actualizar datos del despacho
        this.despachoModel.establecerFecha(this.configuracionView.obtenerFecha());
        this.despachoModel.establecerObservaciones(this.configuracionView.obtenerObservaciones());

        // Validar capacidad final
        const volumenTotal = this.despachoModel.calcularVolumenTotal();
        const capacidadReal = this.camionModel.calcularCapacidadReal(this.despachoModel.tipoCamionSeleccionado);

        if (volumenTotal > capacidadReal) {
            alert(`El volumen total (${volumenTotal.toFixed(2)} m³) excede la capacidad del camión seleccionado (${capacidadReal.toFixed(2)} m³)`);
            return;
        }

        try {
            // Realizar cálculo
            this.ultimoCalculo = this.calculoModel.calcularFleteDespacho(this.despachoModel);

            // Generar reportes
            this.generarReportes();

            // Mostrar sección de reportes
            this.reportesView.mostrar();
        } catch (error) {
            alert('Error al calcular el despacho: ' + error.message);
        }
    }

    /**
     * Genera los reportes del despacho
     */
    generarReportes() {
        // Reporte de productos
        const productos = this.calculoModel.generarReporteProductos(this.despachoModel);
        this.reportesView.renderizarReporteProductos(productos);

        // Reporte de clientes
        const clientes = this.calculoModel.generarReporteClientes(this.despachoModel);
        this.reportesView.renderizarReporteClientes(clientes);

        // Análisis mixto
        const analisis = this.calculoModel.generarAnalisisMixto(this.despachoModel, this.ultimoCalculo);
        this.reportesView.renderizarAnalisisMixto(analisis);
    }

    /**
     * Exporta el reporte a archivo de texto
     */
    exportarReporte() {
        if (!this.ultimoCalculo) {
            alert('Primero debe calcular el despacho');
            return;
        }

        const camion = this.camionModel.obtenerPorCapacidad(this.despachoModel.tipoCamionSeleccionado);
        const contenido = this.calculoModel.generarReporteTexto(this.despachoModel, this.ultimoCalculo, camion);

        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Despacho_${this.despachoModel.ruta.nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        alert('Reporte exportado exitosamente');
    }

    /**
     * Crea un nuevo despacho (resetea la aplicación)
     */
    nuevoDespacho() {
        if (!confirm('¿Está seguro de crear un nuevo despacho? Se perderán los datos actuales.')) {
            return;
        }

        this.despachoModel.reset();
        this.ultimoCalculo = null;

        // Limpiar vistas
        this.clientesView.limpiar();
        this.reportesView.ocultar();
        this.clientesView.ocultarAlertaCapacidad();

        // Reinicializar
        this.inicializar();

        // Limpiar formularios
        document.getElementById('ruta').value = '';
        document.getElementById('tipoCamionSeleccionado').value = '';
        document.getElementById('observaciones').value = '';
        document.getElementById('nombreCliente').value = '';
        document.getElementById('ordenCompraCliente').value = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
