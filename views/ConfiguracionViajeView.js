/**
 * Vista del Módulo de Configuración del Viaje
 * Maneja la renderización de la interfaz de configuración
 */

class ConfiguracionViajeView {

        /**
         * Renderiza el select de tipo de camión
         */
        renderizarTiposCamion(tipos) {
            this.selectTipoCamion.innerHTML = '<option value="">-- Seleccione tipo de camión --</option>';
            tipos.forEach((tipo, i) => {
                const option = document.createElement('option');
                option.value = [25, 37, 45][i];
                option.textContent = tipo;
                this.selectTipoCamion.appendChild(option);
            });
        }
    constructor() {
        this.selectRuta = document.getElementById('ruta');
        this.infoRuta = document.getElementById('infoRuta');
        this.destinosSpan = document.getElementById('destinos');
        this.distanciaSpan = document.getElementById('distancia');
        this.selectTipoCamion = document.getElementById('tipoCamionSeleccionado');
        this.inputFecha = document.getElementById('fechaDespacho');
        this.inputObservaciones = document.getElementById('observaciones');
        this.selectDestinoCliente = document.getElementById('destinoCliente');
    }

    /**
     * Renderiza el select de rutas
     */
    renderizarRutas(rutas) {
        this.selectRuta.innerHTML = '<option value="">-- Seleccione una ruta --</option>';
        
        rutas.forEach(ruta => {
            const option = document.createElement('option');
            option.value = ruta.id;
            option.textContent = `${ruta.codigo} - ${ruta.nombre}`;
            // Guardar destinos como data attribute para uso posterior
            if (ruta.destinos && ruta.destinos.length > 0) {
                option.dataset.destinos = JSON.stringify(ruta.destinos);
            }
            this.selectRuta.appendChild(option);
        });
    }

    /**
     * Renderiza la información de la ruta seleccionada
     */
    renderizarInfoRuta(ruta) {
        if (!ruta) {
            this.infoRuta.style.display = 'none';
            this.infoRuta.innerHTML = '';
            return;
        }
        const distanciaMax = Math.max(...(ruta.destinos || []).map(d => d.distancia));
        this.infoRuta.innerHTML = `<span style="font-size:1.1em;color:#1e40af;font-weight:600;">${ruta.nombre}</span><br><span style="color:#64748b;">Distancia máxima: ${distanciaMax} km</span>`;
        this.infoRuta.style.display = 'block';
    }

    /**
     * Renderiza el select de destinos
     */
    renderizarDestinos(destinos) {
        if (!this.selectDestinoCliente) return;
        this.selectDestinoCliente.innerHTML = '<option value="">-- Seleccione destino --</option>';
        // Aquí puedes agregar la lógica para renderizar los destinos si es necesario
    }

    /**
     * Renderiza la información de la ruta seleccionada
     * (Actualmente oculta la info por requerimiento)
     */
    renderizarInfoRuta(ruta) {
        this.infoRuta.style.display = 'none';
        this.infoRuta.innerHTML = '';
    }

    /**
     * Muestra mensaje de confirmación al agregar destino
     */
    mostrarConfirmacionDestino(nombreDestino) {
        alert(`Destino "${nombreDestino}" agregado exitosamente a la ruta`);
    }

    /**
     * Limpia los campos del formulario de nuevo destino
     */
    limpiarFormularioDestino() {
        document.getElementById('nuevoDestino').value = '';
        document.getElementById('nuevoDestinoKm').value = '';
    }

    /**
     * Obtiene el valor del select de ruta
     */
    obtenerRutaSeleccionada() {
        return parseInt(this.selectRuta.value);
    }

    /**
     * Obtiene el valor del select de tipo de camión
     */
    obtenerTipoCamionSeleccionado() {
        return parseInt(this.selectTipoCamion.value);
    }

    /**
     * Obtiene la fecha seleccionada
     */
    obtenerFecha() {
        return this.inputFecha.value;
    }

    /**
     * Establece la fecha actual
     */
    establecerFechaActual() {
        const hoy = new Date().toISOString().split('T')[0];
        this.inputFecha.value = hoy;
    }

    /**
     * Obtiene las observaciones
     */
    obtenerObservaciones() {
        return this.inputObservaciones.value;
    }
}
