/**
 * Controlador Principal de la Aplicación
 * Coordina las interacciones entre Modelos y Vistas
 */

class AppController {
    constructor() {
        // Base de datos (opcional - se conecta después)
        this.db = null;

        // Inicializar Modelos (sin BD por ahora)
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
     * Conecta a la base de datos IndexedDB
     */
    async conectarBaseDatos() {
        try {
            const dbConfig = DatabaseConfig.local;
            this.db = new DatabaseAdapter(dbConfig);
            await this.db.connect();

            // Reconectar modelos con BD
            this.rutaModel = new RutaModel(this.db);
            this.calculoModel = new CalculoModel(this.rutaModel, this.camionModel);

            console.log('✅ Conectado a base de datos IndexedDB');
            return true;
        } catch (error) {
            console.warn('⚠️ No se pudo conectar a BD, usando datos hardcodeados:', error.message);
            return false;
        }
    }

    /**
     * Inicializa la aplicación
     */
    async inicializar() {
        // Intentar conectar a BD
        await this.conectarBaseDatos();

        // Cargar rutas (de BD o fallback)
        const rutas = await this.rutaModel.obtenerRutas();
        
        this.configuracionView.renderizarRutas(rutas);
        this.configuracionView.establecerFechaActual();
        this.actualizarResumen();

        console.log(`📍 Sistema inicializado con ${rutas.length} rutas`);
    }

    /**
     * Maneja el cambio de ruta
     */
    async cargarRuta() {
        const rutaId = this.configuracionView.obtenerRutaSeleccionada();

        if (!rutaId) {
            this.configuracionView.renderizarInfoRuta(null);
            this.configuracionView.renderizarDestinos([]);
            this.despachoModel.establecerRuta(null);
            return;
        }

        const ruta = await this.rutaModel.obtenerRutaPorId(rutaId);
        this.despachoModel.establecerRuta(ruta);

        this.configuracionView.renderizarInfoRuta(ruta);
        this.configuracionView.renderizarDestinos(ruta.destinos || []);

        this.actualizarResumen();
    }

    /**
     * Valida y actualiza la capacidad del camión
     */
    validarCapacidadCamion() {
        const tipoCamion = this.configuracionView.obtenerTipoCamionSeleccionado();

        if (!tipoCamion) {
            document.getElementById('alertaCapacidad').style.display = 'none';
            document.getElementById('porcentajeOcupacion').textContent = '0%';
            this.actualizarResumen();
            return;
        }

        this.despachoModel.establecerTipoCamion(tipoCamion);

        const volumenTotal = this.despachoModel.calcularVolumenTotal();
        const capacidadCamion = this.despachoModel.capacidadCamion;
        const porcentaje = this.despachoModel.obtenerPorcentajeOcupacion();

        // Actualizar indicador de ocupación
        document.getElementById('porcentajeOcupacion').textContent = `${porcentaje.toFixed(1)}%`;

        if (volumenTotal > capacidadCamion) {
            const mensaje = `<strong>⚠️ SOBRECARGA:</strong> El volumen actual (${volumenTotal.toFixed(2)} m³) excede la capacidad del camión (${capacidadCamion} m³)`;
            document.getElementById('alertaCapacidad').innerHTML = mensaje;
            document.getElementById('alertaCapacidad').className = 'alert alert-danger';
            document.getElementById('alertaCapacidad').style.display = 'block';
        } else if (porcentaje > 90) {
            const espacio = capacidadCamion - volumenTotal;
            const mensaje = `<strong>⚠️ ATENCIÓN:</strong> Camión al ${porcentaje.toFixed(1)}% de capacidad. Espacio: ${espacio.toFixed(2)} m³`;
            document.getElementById('alertaCapacidad').innerHTML = mensaje;
            document.getElementById('alertaCapacidad').className = 'alert alert-warning';
            document.getElementById('alertaCapacidad').style.display = 'block';
        } else {
            document.getElementById('alertaCapacidad').style.display = 'none';
        }

        this.actualizarResumen();
    }

    /**
     * Agrega un nuevo pedido al despacho
     */
    agregarPedido() {
        // Validar que haya camión seleccionado
        const tipoCamion = this.configuracionView.obtenerTipoCamionSeleccionado();
        if (!tipoCamion) {
            alert('⚠️ Primero seleccione el tipo de camión');
            return;
        }

        // Obtener datos del formulario
        const producto = document.getElementById('nombreProducto').value.trim();
        const cliente = document.getElementById('clientePedido').value.trim();
        const ordenCompra = document.getElementById('ordenCompra').value.trim();
        const cantidad = parseInt(document.getElementById('cantidadProducto').value);
        const volumenUnitario = parseFloat(document.getElementById('volumenUnitario').value);
        const pesoUnitario = parseFloat(document.getElementById('pesoUnitario').value);
        const precioUnitario = parseFloat(document.getElementById('precioUnitario').value) || 0;

        // Obtener destino y distancia
        const selectDestino = document.getElementById('destinoCliente');
        let destino = 'Destino Final';
        let distancia = 0;
        
        if (selectDestino.value) {
            try {
                const destinoData = JSON.parse(selectDestino.value);
                destino = destinoData.nombre;
                distancia = destinoData.distancia;
            } catch(e) {
                console.warn('Error parseando destino:', e);
            }
        }

        // Validar campos requeridos
        if (!producto) {
            alert('⚠️ Ingrese el nombre del producto');
            return;
        }
        if (!cantidad || cantidad <= 0) {
            alert('⚠️ Ingrese una cantidad válida');
            return;
        }
        if (!volumenUnitario || volumenUnitario <= 0) {
            alert('⚠️ Ingrese el volumen unitario');
            return;
        }
        if (!pesoUnitario || pesoUnitario <= 0) {
            alert('⚠️ Ingrese el peso unitario');
            return;
        }

        // Verificar capacidad disponible
        const volumenNuevo = volumenUnitario * cantidad;
        const verificacion = this.despachoModel.verificarCapacidad(volumenNuevo);

        if (!verificacion.hayCapacidad) {
            alert(`❌ No hay capacidad suficiente\n\n` +
                  `Volumen del pedido: ${volumenNuevo.toFixed(2)} m³\n` +
                  `Espacio disponible: ${verificacion.espacioDisponible.toFixed(2)} m³\n` +
                  `Capacidad del camión: ${verificacion.capacidadCamion} m³`);
            return;
        }

        // Agregar pedido CON destino y distancia
        const pedido = this.despachoModel.agregarPedido({
            producto,
            cliente: cliente || 'Cliente General',
            ordenCompra: ordenCompra || `OC-${this.despachoModel.contadorPedidos}`,
            cantidad,
            volumenUnitario,
            pesoUnitario,
            precioUnitario,
            destino,
            distancia
        });

        // Renderizar pedido en la vista
        this.renderizarPedido(pedido);

        // Limpiar formulario
        document.getElementById('nombreProducto').value = '';
        document.getElementById('clientePedido').value = '';
        document.getElementById('ordenCompra').value = '';
        document.getElementById('cantidadProducto').value = '';
        document.getElementById('volumenUnitario').value = '';
        document.getElementById('pesoUnitario').value = '';
        document.getElementById('precioUnitario').value = '';
        document.getElementById('volumenTotalPrevio').value = '0.00 m³';

        // Actualizar resumen
        this.validarCapacidadCamion();
        this.actualizarResumen();

        // Mostrar sección de pedidos
        document.getElementById('listaPedidos').style.display = 'block';
    }

    /**
     * Renderiza un pedido en el DOM
     */
    renderizarPedido(pedido) {
        const container = document.getElementById('pedidosContainer');

        const pedidoDiv = document.createElement('div');
        pedidoDiv.id = pedido.id;
        pedidoDiv.style.cssText = 'background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; margin-bottom: 10px;';
        
        pedidoDiv.innerHTML = `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr auto; gap: 10px; align-items: center; font-size: 0.9em;">
                <div>
                    <strong style="color: #1e293b;">${pedido.producto}</strong><br>
                    <small style="color: #64748b;">${pedido.cliente} • ${pedido.ordenCompra}</small>
                </div>
                <div>
                    <strong style="color: #0891b2;">📍 ${pedido.destino || 'Final'}</strong><br>
                    <small style="color: #64748b;">${pedido.distancia || 0} km</small>
                </div>
                <div><strong>${pedido.cantidad}</strong> uds</div>
                <div>${pedido.volumenUnitario.toFixed(3)} m³/ud</div>
                <div style="color: #0891b2; font-weight: 600;">${pedido.volumenTotal.toFixed(3)} m³</div>
                <div>${pedido.pesoUnitario.toFixed(1)} kg/ud</div>
                <div style="font-weight: 600;">$ ${pedido.valorTotal.toLocaleString()}</div>
                <button onclick="eliminarPedido('${pedido.id}')" class="btn-danger" style="padding: 6px 12px; font-size: 0.85em;">
                    🗑️
                </button>
            </div>
        `;

        container.appendChild(pedidoDiv);
    }

    /**
     * Elimina un pedido
     */
    eliminarPedido(pedidoId) {
        if (!confirm('¿Eliminar este pedido?')) {
            return;
        }

        this.despachoModel.eliminarPedido(pedidoId);
        
        const elemento = document.getElementById(pedidoId);
        if (elemento) {
            elemento.remove();
        }

        // Ocultar sección si no hay pedidos
        if (this.despachoModel.pedidos.length === 0) {
            document.getElementById('listaPedidos').style.display = 'none';
        }

        this.validarCapacidadCamion();
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
    /**
     * Actualiza el resumen del despacho
     */
    actualizarResumen() {
        const resumen = this.despachoModel.obtenerResumen();

        // Actualizar volumen total
        document.getElementById('volumenTotal').textContent = `${resumen.volumenTotal.toFixed(2)} m³`;

        // Actualizar tipo de camión y ocupación
        if (resumen.tipoCamion) {
            document.getElementById('tipoCamion').textContent = `${resumen.tipoCamion} m³`;
            document.getElementById('ocupacionReal').textContent = `${resumen.porcentajeOcupacion.toFixed(1)}% (${resumen.volumenTotal.toFixed(2)}/${resumen.capacidadCamion} m³)`;
            
            // Cambiar color según ocupación
            const ocupacionElem = document.getElementById('ocupacionReal');
            if (resumen.porcentajeOcupacion > 100) {
                ocupacionElem.style.color = '#dc2626'; // Rojo
            } else if (resumen.porcentajeOcupacion > 90) {
                ocupacionElem.style.color = '#f59e0b'; // Amarillo
            } else {
                ocupacionElem.style.color = '#059669'; // Verde
            }
        } else {
            document.getElementById('tipoCamion').textContent = '-';
            document.getElementById('ocupacionReal').textContent = '-';
        }

        // Actualizar flete total
        if (this.despachoModel.ruta && this.despachoModel.tipoCamionSeleccionado) {
            try {
                const flete = this.rutaModel.obtenerTarifaSync(
                    this.despachoModel.rutaId,
                    this.despachoModel.tipoCamionSeleccionado
                );
                // El flete está en miles de pesos
                const fleteEnPesos = flete * 1000;
                document.getElementById('fleteTotal').textContent = `$ ${fleteEnPesos.toLocaleString('es-CO', {maximumFractionDigits: 0})}`;
                document.getElementById('fleteTotal').style.color = '#059669';
                document.getElementById('fleteTotal').style.fontWeight = 'bold';
            } catch(error) {
                console.error('Error obteniendo tarifa:', error);
                document.getElementById('fleteTotal').textContent = '$ 0';
            }
        } else {
            document.getElementById('fleteTotal').textContent = '$ 0';
        }

        // Actualizar valor total de productos
        document.getElementById('valorTotalProductos').textContent = `$ ${resumen.valorTotal.toLocaleString()}`;
    }

    /**
     * Calcula el despacho final y distribuye el flete
     */
    async calcularDespacho() {
        // Validar despacho
        const validacion = this.despachoModel.validarDespacho();
        if (!validacion.valido) {
            alert('⚠️ Errores en el despacho:\n\n' + validacion.errores.join('\n'));
            return;
        }

        // Actualizar datos del despacho
        this.despachoModel.establecerFecha(this.configuracionView.obtenerFecha());
        this.despachoModel.establecerObservaciones(this.configuracionView.obtenerObservaciones());

        try {
            // Calcular flete y distribución
            this.ultimoCalculo = await this.calculoModel.calcularFleteDespacho(this.despachoModel);

            console.log('📊 Cálculo completado:', this.ultimoCalculo);

            // Mostrar resultados
            this.mostrarResultadosCalculo();

        } catch (error) {
            alert('❌ Error al calcular el despacho:\n' + error.message);
            console.error(error);
        }
    }

    /**
     * Muestra los resultados del cálculo en pantalla
     */
    mostrarResultadosCalculo() {
        const calc = this.ultimoCalculo;

        // Actualizar resumen general
        document.getElementById('volumenTotal').textContent = `${calc.volumenTotal.toFixed(2)} m³`;
        document.getElementById('tipoCamion').textContent = `${calc.tipoCamion} m³`;
        document.getElementById('ocupacionReal').textContent = `${calc.porcentajeOcupacion.toFixed(1)}% (${calc.volumenTotal.toFixed(2)}/${calc.capacidadCamion} m³)`;
        document.getElementById('fleteTotal').textContent = `$ ${calc.fleteTotal.toLocaleString()}`;
        document.getElementById('fleteTotal').style.color = '#059669';
        document.getElementById('fleteTotal').style.fontSize = '1.3em';
        document.getElementById('fleteTotal').style.fontWeight = 'bold';
        document.getElementById('valorTotalProductos').textContent = `$ ${calc.valorTotal.toLocaleString()}`;

        // Mostrar desglose por pedido
        this.mostrarDesglosePorPedido(calc);

        // Scroll a resultados
        setTimeout(() => {
            document.querySelector('#detalleClientes').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    /**
     * Muestra el desglose detallado del flete por cada pedido
     */
    mostrarDesglosePorPedido(calc) {
        const container = document.getElementById('detalleClientesContainer');
        container.innerHTML = '';

        // Crear tabla de desglose
        const tabla = document.createElement('div');
        tabla.style.cssText = 'overflow-x: auto; margin-top: 15px;';
        
        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; background: white;">
                <thead>
                    <tr style="background: #1e293b; color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #cbd5e1;">Producto</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #cbd5e1;">Cliente</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #cbd5e1;">📍 Destino</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Distancia (km)</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Cant.</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Vol. Total</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">% Carga</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Pond. (Vol×Dist)</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Flete Asignado</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Flete/Unidad</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">Valor Total</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #cbd5e1;">% Flete/Venta</th>
                    </tr>
                </thead>
                <tbody>
        `;

        calc.pedidos.forEach(pedido => {
            const colorParticipacion = pedido.participacionVolumen > 50 ? '#d1fae5' : 
                                      pedido.participacionVolumen > 25 ? '#fef3c7' : '#ffffff';
            const colorFlete = pedido.porcentajeFleteVenta > 15 ? '#fee2e2' : 
                              pedido.porcentajeFleteVenta > 10 ? '#fef3c7' : '#d1fae5';
            
            html += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${pedido.producto}</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0;">${pedido.cliente}</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600; color: #0891b2;"><strong>${pedido.destino || 'Final'}</strong></td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${pedido.distancia || 0} km</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">${pedido.cantidad}</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">${pedido.volumenTotal.toFixed(3)} m³</td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; background-color: ${colorParticipacion}; font-weight: 600;">
                        ${pedido.participacionVolumen.toFixed(1)}%
                    </td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; color: #7c3aed; font-weight: 600;">
                        ${(pedido.ponderacion || 0).toFixed(2)}
                    </td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #059669;">
                        $${pedido.fleteAsignado.toLocaleString('es-CO', {minimumFractionDigits: 0})}
                    </td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">
                        $${pedido.fletePorUnidad.toLocaleString('es-CO', {minimumFractionDigits: 0})}
                    </td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right;">
                        $${pedido.valorTotal.toLocaleString('es-CO')}
                    </td>
                    <td style="padding: 10px; border: 1px solid #e2e8f0; text-align: right; background-color: ${colorFlete}; font-weight: 600;">
                        ${pedido.porcentajeFleteVenta.toFixed(2)}%
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        tabla.innerHTML = html;
        container.appendChild(tabla);
    }

    /**
     * Agrega un nuevo destino a la ruta actual
     */
    agregarDestinoARuta() {
        const rutaId = this.configuracionView.obtenerRutaSeleccionada();
        if (!rutaId) {
            alert('⚠️ Primero seleccione una ruta');
            return;
        }

        const nombreDestino = document.getElementById('nuevoDestino').value.trim();
        const distanciaKm = parseFloat(document.getElementById('nuevoDestinoKm').value);

        if (!nombreDestino || !distanciaKm) {
            alert('⚠️ Complete el nombre y la distancia del destino');
            return;
        }

        const ruta = this.despachoModel.ruta;
        if (!ruta) {
            alert('⚠️ Error: Ruta no cargada');
            return;
        }

        // Agregar destino a la ruta
        if (!ruta.destinos) {
            ruta.destinos = [];
        }

        ruta.destinos.push({
            nombre: nombreDestino,
            distancia: distanciaKm,
            porDefecto: false
        });

        // Actualizar vista
        this.configuracionView.renderizarInfoRuta(ruta);
        this.configuracionView.renderizarDestinos(ruta.destinos);
        this.configuracionView.mostrarConfirmacionDestino(nombreDestino);
        this.configuracionView.limpiarFormularioDestino();
    }
}
