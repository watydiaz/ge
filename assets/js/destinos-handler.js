/**
 * Manejador de Destinos para Pedidos
 * Actualiza el selector de destinos cuando se selecciona una ruta
 */

document.addEventListener('DOMContentLoaded', function() {
    const selectRuta = document.getElementById('ruta');
    const selectDestino = document.getElementById('destinoCliente');
    const distanciaSpan = document.getElementById('distanciaSeleccionada');

    // Listener: cuando cambia la ruta, cargar sus destinos
    if (selectRuta) {
        selectRuta.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            if (selectedOption && selectedOption.dataset.destinos) {
                try {
                    const destinos = JSON.parse(selectedOption.dataset.destinos);
                    
                    // Limpiar select
                    selectDestino.innerHTML = '<option value="">-- Seleccione destino --</option>';
                    
                    // Agregar destinos
                    destinos.forEach(destino => {
                        const option = document.createElement('option');
                        option.value = JSON.stringify(destino);
                        option.textContent = `${destino.nombre} (${destino.distancia} km)`;
                        selectDestino.appendChild(option);
                    });
                    
                    // Mostrar el selector si hay destinos
                    if (destinos.length > 0) {
                        selectDestino.parentElement.style.display = 'block';
                    }
                } catch(e) {
                    console.error('Error cargando destinos:', e);
                    selectDestino.innerHTML = '<option value="">-- Destino final --</option>';
                }
            } else {
                // Si no hay destinos, usar destino único
                selectDestino.innerHTML = '<option value="">-- Destino final --</option>';
                selectDestino.parentElement.style.display = 'block';
            }
        });
    }

    // Listener: cuando cambia el destino, mostrar distancia
    if (selectDestino && distanciaSpan) {
        selectDestino.addEventListener('change', function() {
            if (this.value) {
                try {
                    const destino = JSON.parse(this.value);
                    distanciaSpan.textContent = `${destino.distancia} km`;
                } catch(e) {
                    distanciaSpan.textContent = '0 km';
                }
            } else {
                distanciaSpan.textContent = '0 km';
            }
        });
    }

    // Listener: actualizar vista previa de volumen total
    const cantidadInput = document.getElementById('cantidadProducto');
    const volumenUnitarioInput = document.getElementById('volumenUnitario');
    const volumenTotalPrevio = document.getElementById('volumenTotalPrevio');

    function actualizarVolumenPrevio() {
        const cantidad = parseFloat(cantidadInput.value) || 0;
        const volumenUnit = parseFloat(volumenUnitarioInput.value) || 0;
        const total = cantidad * volumenUnit;
        volumenTotalPrevio.value = `${total.toFixed(3)} m³`;
    }

    if (cantidadInput) cantidadInput.addEventListener('input', actualizarVolumenPrevio);
    if (volumenUnitarioInput) volumenUnitarioInput.addEventListener('input', actualizarVolumenPrevio);
});
