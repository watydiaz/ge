/**
 * Punto de entrada de la aplicación
 * Inicializa el controlador y establece los event listeners globales
 */

// Variable global del controlador
let appController;

/**
 * Inicialización de la aplicación al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Crear instancia del controlador principal
    appController = new AppController();
    
    // Inicializar la aplicación (async - conecta a BD si existe)
    await appController.inicializar();
    
    console.log('✓ Aplicación GE Logística inicializada correctamente (Arquitectura MVC)');
});

/**
 * Funciones globales que el HTML puede llamar
 * Estas actúan como adaptadores hacia el controlador
 */

async function cargarRuta() {
    await appController.cargarRuta();
}

function validarCapacidadCamion() {
    appController.validarCapacidadCamion();
}

function agregarDestinoARuta() {
    appController.agregarDestinoARuta();
}

function agregarPedido() {
    appController.agregarPedido();
}

function eliminarPedido(pedidoId) {
    appController.eliminarPedido(pedidoId);
}

async function calcularDespacho() {
    await appController.calcularDespacho();
}

function exportarReporte() {
    appController.exportarReporte();
}

function nuevoDespacho() {
    appController.nuevoDespacho();
}

/**
 * Carga un producto de ejemplo en el formulario
 */
function cargarEjemplo(tipo) {
    const ejemplos = {
        1: { // Colchón Monarca
            producto: 'COL MONARCA 100X190X28 JAC',
            cliente: 'Muebles Jamar',
            ordenCompra: 'OC-2025-001',
            cantidad: 20,
            volumenUnitario: 0.532, // 1.00m x 1.90m x 0.28m
            pesoUnitario: 18.5,
            precioUnitario: 350000
        },
        2: { // Colchón Premium
            producto: 'COL CONFORT PREMIUM 140X190X34 NUBE 4.0',
            cliente: 'Alkosto S.A.',
            ordenCompra: 'OC-2025-002',
            cantidad: 15,
            volumenUnitario: 0.904, // 1.40m x 1.90m x 0.34m
            pesoUnitario: 25.0,
            precioUnitario: 580000
        },
        3: { // Laminado
            producto: 'LAM UT 200,0x200,0x004,0',
            cliente: 'Homecenter',
            ordenCompra: 'OC-2025-003',
            cantidad: 50,
            volumenUnitario: 0.160, // 2.00m x 2.00m x 0.04m
            pesoUnitario: 12.8,
            precioUnitario: 85000
        }
    };

    const ejemplo = ejemplos[tipo];
    if (!ejemplo) return;

    document.getElementById('nombreProducto').value = ejemplo.producto;
    document.getElementById('clientePedido').value = ejemplo.cliente;
    document.getElementById('ordenCompra').value = ejemplo.ordenCompra;
    document.getElementById('cantidadProducto').value = ejemplo.cantidad;
    document.getElementById('volumenUnitario').value = ejemplo.volumenUnitario;
    document.getElementById('pesoUnitario').value = ejemplo.pesoUnitario;
    document.getElementById('precioUnitario').value = ejemplo.precioUnitario;

    // Calcular volumen total previo
    const volTotal = ejemplo.cantidad * ejemplo.volumenUnitario;
    document.getElementById('volumenTotalPrevio').value = `${volTotal.toFixed(3)} m³`;
    document.getElementById('volumenTotalPrevio').style.color = volTotal > 10 ? '#dc2626' : '#059669';

    // Hacer focus en el botón agregar
    setTimeout(() => {
        const btnAgregar = document.querySelector('button[onclick="agregarPedido()"]');
        if (btnAgregar) {
            btnAgregar.focus();
            btnAgregar.style.animation = 'pulse 0.5s';
        }
    }, 100);
}

// Calcular volumen total previo al agregar
document.addEventListener('DOMContentLoaded', function() {
    const cantidadInput = document.getElementById('cantidadProducto');
    const volumenInput = document.getElementById('volumenUnitario');
    const volumenPrevio = document.getElementById('volumenTotalPrevio');

    if (cantidadInput && volumenInput && volumenPrevio) {
        const calcularVolumenPrevio = () => {
            const cantidad = parseFloat(cantidadInput.value) || 0;
            const volumen = parseFloat(volumenInput.value) || 0;
            const total = cantidad * volumen;
            volumenPrevio.value = `${total.toFixed(3)} m³`;
            
            // Cambiar color según el total
            if (total > 0) {
                volumenPrevio.style.color = total > 10 ? '#dc2626' : '#059669';
            }
        };

        cantidadInput.addEventListener('input', calcularVolumenPrevio);
        volumenInput.addEventListener('input', calcularVolumenPrevio);
    }
});
