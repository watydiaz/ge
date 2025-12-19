/**
 * Vista del Módulo de Configuración del Viaje
 * Maneja la renderización de la interfaz de configuración
 */

class ConfiguracionViajeView {
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
            option.textContent = ruta.nombre;
            this.selectRuta.appendChild(option);
        });
    }

    /**
     * Renderiza la información de la ruta seleccionada
     */
    renderizarInfoRuta(ruta) {
        if (!ruta) {
            this.infoRuta.style.display = 'none';
            return;
        }

        const destinosNombres = ruta.destinos.map(d => {
            const tag = d.porDefecto ? '' : ' (Nuevo)';
            return d.nombre + tag;
        }).join(', ');

        this.destinosSpan.textContent = destinosNombres;
        
        const distanciaMax = Math.max(...ruta.destinos.map(d => d.distancia));
        this.distanciaSpan.textContent = `hasta ${distanciaMax}`;
        
        this.infoRuta.style.display = 'block';
    }

    /**
     * Renderiza el select de destinos
     */
    renderizarDestinos(destinos) {
        this.selectDestinoCliente.innerHTML = '<option value="">-- Seleccione destino --</option>';
        
        if (!destinos || destinos.length === 0) return;

        destinos.forEach(destino => {
            const option = document.createElement('option');
            option.value = JSON.stringify(destino);
            const etiqueta = destino.porDefecto ? '' : ' *';
            option.textContent = `${destino.nombre} (${destino.distancia} km)${etiqueta}`;
            this.selectDestinoCliente.appendChild(option);
        });
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
