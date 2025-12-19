/**
 * Punto de entrada de la aplicación
 * Inicializa el controlador y establece los event listeners globales
 */

// Variable global del controlador
let appController;

/**
 * Inicialización de la aplicación al cargar el DOM
 */
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia del controlador principal
    appController = new AppController();
    
    // Inicializar la aplicación
    appController.inicializar();
    
    console.log('✓ Aplicación GE Logística inicializada correctamente (Arquitectura MVC)');
});

/**
 * Funciones globales que el HTML puede llamar
 * Estas actúan como adaptadores hacia el controlador
 */

function cargarRuta() {
    appController.cargarRuta();
}

function validarCapacidadCamion() {
    appController.validarCapacidadCamion();
}

function agregarDestinoARuta() {
    appController.agregarDestinoARuta();
}

function agregarCliente() {
    appController.agregarCliente();
}

function calcularDespacho() {
    appController.calcularDespacho();
}

function exportarReporte() {
    appController.exportarReporte();
}

function nuevoDespacho() {
    appController.nuevoDespacho();
}
