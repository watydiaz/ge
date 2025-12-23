// ============================================
// DATOS MAESTROS DEL SISTEMA
// ============================================

// Rutas y tarifas por tipo de camión
const RUTAS = [
    {
        id: 1,
        nombre: "Bogotá - Medellín",
        destinos: [
            { nombre: "Medellín", distancia: 415, porDefecto: true },
            { nombre: "Envigado", distancia: 420, porDefecto: true },
            { nombre: "Itagüí", distancia: 418, porDefecto: true }
        ],
        tarifas: {
            25: 850000,  // Camión de 25 m³
            37: 1200000, // Camión de 37 m³
            45: 1450000  // Camión de 45 m³
        }
    },
    {
        id: 2,
        nombre: "Bogotá - Cali",
        destinos: [
            { nombre: "Cali", distancia: 510, porDefecto: true },
            { nombre: "Palmira", distancia: 530, porDefecto: true },
            { nombre: "Yumbo", distancia: 515, porDefecto: true }
        ],
        tarifas: {
            25: 950000,
            37: 1350000,
            45: 1650000
        }
    },
    {
        id: 3,
        nombre: "Bogotá - Barranquilla",
        destinos: [
            { nombre: "Barranquilla", distancia: 998, porDefecto: true },
            { nombre: "Soledad", distancia: 1005, porDefecto: true },
            { nombre: "Malambo", distancia: 1010, porDefecto: true }
        ],
        tarifas: {
            25: 1400000,
            37: 1900000,
            45: 2300000
        }
    },
    {
        id: 4,
        nombre: "Bogotá - Bucaramanga",
        destinos: [
            { nombre: "Bucaramanga", distancia: 395, porDefecto: true },
            { nombre: "Floridablanca", distancia: 400, porDefecto: true },
            { nombre: "Girón", distancia: 403, porDefecto: true }
        ],
        tarifas: {
            25: 800000,
            37: 1150000,
            45: 1400000
        }
    },
    {
        id: 5,
        nombre: "Medellín - Cali",
        destinos: [
            { nombre: "Cali", distancia: 450, porDefecto: true },
            { nombre: "Palmira", distancia: 470, porDefecto: true }
        ],
        tarifas: {
            25: 900000,
            37: 1250000,
            45: 1550000
        }
    }
];

// Tipos de camiones con capacidades
const TIPOS_CAMION = [
    { capacidad: 25, nombre: "Camión 25 m³", eficiencia: 0.80 },
    { capacidad: 37, nombre: "Camión 37 m³", eficiencia: 0.80 },
    { capacidad: 45, nombre: "Camión 45 m³", eficiencia: 0.80 }
];

// ============================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================

let despacho = {
    ruta: null,
    fecha: null,
    observaciones: "",
    clientes: []
};

let contadorClientes = 0;

// ============================================
// INICIALIZACIÓN
// ============================================

// Eliminar la carga de rutas desde script.js para evitar conflicto con MVC
// document.addEventListener('DOMContentLoaded', function() {
//     cargarRutas();
//     establecerFechaActual();
// });

// function cargarRutas() {
//     const selectRuta = document.getElementById('ruta');
//     RUTAS.forEach(ruta => {
//         const option = document.createElement('option');
//         option.value = ruta.id;
//         option.textContent = ruta.nombre;
//         selectRuta.appendChild(option);
//     });
// }

// Solo establecer la fecha actual
function establecerFechaActual() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaDespacho').value = hoy;
}

// ============================================
// MANEJO DE RUTAS
// ============================================

function cargarRuta() {
    const rutaId = parseInt(document.getElementById('ruta').value);
    
    if (!rutaId) {
        document.getElementById('infoRuta').style.display = 'none';
        document.getElementById('destinoCliente').innerHTML = '<option value="">-- Seleccione destino --</option>';
        despacho.ruta = null;
        return;
    }

    const ruta = RUTAS.find(r => r.id === rutaId);
    despacho.ruta = ruta;

    // Mostrar info de la ruta
    const destinosNombres = ruta.destinos.map(d => {
        const tag = d.porDefecto ? '' : ' (Nuevo)';
        return d.nombre + tag;
    }).join(', ');
    document.getElementById('destinos').textContent = destinosNombres;
    
    // Calcular distancia máxima
    const distanciaMax = Math.max(...ruta.destinos.map(d => d.distancia));
    document.getElementById('distancia').textContent = `hasta ${distanciaMax}`;
    document.getElementById('infoRuta').style.display = 'block';

    // Cargar destinos en el select
    actualizarSelectDestinos();

    actualizarResumen();
}

function actualizarSelectDestinos() {
    if (!despacho.ruta) return;
    
    const selectDestino = document.getElementById('destinoCliente');
    selectDestino.innerHTML = '<option value="">-- Seleccione destino --</option>';
    
    despacho.ruta.destinos.forEach(destino => {
        const option = document.createElement('option');
        option.value = JSON.stringify(destino);
        const etiqueta = destino.porDefecto ? '' : ' *';
        option.textContent = `${destino.nombre} (${destino.distancia} km)${etiqueta}`;
        selectDestino.appendChild(option);
    });
}

function validarCapacidadCamion() {
    const tipoCamionSeleccionado = parseInt(document.getElementById('tipoCamionSeleccionado').value);
    
    if (!tipoCamionSeleccionado) {
        document.getElementById('alertaCapacidad').style.display = 'none';
        actualizarResumen();
        return;
    }
    
    // Calcular volumen total actual
    let volumenTotal = 0;
    despacho.clientes.forEach(cliente => {
        cliente.productos.forEach(producto => {
            volumenTotal += producto.volumenTotal;
        });
    });
    
    const camion = TIPOS_CAMION.find(c => c.capacidad === tipoCamionSeleccionado);
    const capacidadReal = camion.capacidad * camion.eficiencia;
    const porcentajeOcupacion = (volumenTotal / capacidadReal * 100).toFixed(1);
    
    const alertaDiv = document.getElementById('alertaCapacidad');
    
    if (volumenTotal > capacidadReal) {
        alertaDiv.innerHTML = `<strong>ADVERTENCIA:</strong> El volumen actual (${volumenTotal.toFixed(2)} m³) excede la capacidad del camión seleccionado (${capacidadReal.toFixed(2)} m³). No se pueden agregar más clientes.`;
        alertaDiv.className = 'alert alert-danger';
        alertaDiv.style.display = 'block';
    } else if (porcentajeOcupacion > 90) {
        alertaDiv.innerHTML = `<strong>ATENCIÓN:</strong> El camión está al ${porcentajeOcupacion}% de su capacidad. Espacio restante: ${(capacidadReal - volumenTotal).toFixed(2)} m³`;
        alertaDiv.className = 'alert alert-warning';
        alertaDiv.style.display = 'block';
    } else {
        alertaDiv.style.display = 'none';
    }
    
    actualizarResumen();
}

function agregarDestinoARuta() {
    if (!despacho.ruta) {
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
    
    // Verificar si el destino ya existe
    const existeDestino = despacho.ruta.destinos.find(d => 
        d.nombre.toLowerCase() === nombreDestino.toLowerCase()
    );
    
    if (existeDestino) {
        alert('Este destino ya existe en la ruta');
        return;
    }
    
    // Agregar nuevo destino a la ruta actual
    const nuevoDestino = {
        nombre: nombreDestino,
        distancia: kilometros,
        porDefecto: false  // Marca que fue agregado dinámicamente
    };
    
    despacho.ruta.destinos.push(nuevoDestino);
    
    // Actualizar la ruta en el array global (para mantener persistencia en la sesión)
    const rutaGlobal = RUTAS.find(r => r.id === despacho.ruta.id);
    if (rutaGlobal) {
        rutaGlobal.destinos.push(nuevoDestino);
    }
    
    // Actualizar interfaz
    const destinosNombres = despacho.ruta.destinos.map(d => {
        const tag = d.porDefecto ? '' : ' (Nuevo)';
        return d.nombre + tag;
    }).join(', ');
    document.getElementById('destinos').textContent = destinosNombres;
    
    const distanciaMax = Math.max(...despacho.ruta.destinos.map(d => d.distancia));
    document.getElementById('distancia').textContent = `hasta ${distanciaMax}`;
    
    // Actualizar select de destinos
    actualizarSelectDestinos();
    
    // Limpiar campos
    document.getElementById('nuevoDestino').value = '';
    document.getElementById('nuevoDestinoKm').value = '';
    
    alert(`Destino "${nombreDestino}" agregado exitosamente a la ruta`);
}

// ============================================
// GESTIÓN DE CLIENTES
// ============================================

function agregarCliente() {
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

    // Validar que se haya seleccionado un tipo de camión
    const tipoCamionSeleccionado = document.getElementById('tipoCamionSeleccionado').value;
    if (!tipoCamionSeleccionado) {
        alert('Por favor seleccione primero el tipo de camión en la sección de Información del Despacho');
        return;
    }

    const destino = JSON.parse(destinoData);
    contadorClientes++;
    const clienteId = `cliente_${contadorClientes}`;

    const cliente = {
        id: clienteId,
        nombre: nombreCliente,
        destino: destino,
        ordenCompra: document.getElementById('ordenCompraCliente').value.trim() || 'N/A',
        productos: []
    };

    despacho.clientes.push(cliente);
    renderizarCliente(cliente);

    document.getElementById('nombreCliente').value = '';
    document.getElementById('destinoCliente').value = '';
    document.getElementById('ordenCompraCliente').value = '';
}

function renderizarCliente(cliente) {
    const container = document.getElementById('clientesContainer');
    
    const clienteDiv = document.createElement('div');
    clienteDiv.className = 'cliente-item';
    clienteDiv.id = cliente.id;
    
    clienteDiv.innerHTML = `
        <div class="cliente-header">
            <div>
                <h3>${cliente.nombre} <span style="font-size: 0.8em; color: #64748b; font-weight: normal;">[${cliente.ordenCompra}]</span></h3>
                <small style="color: #7f8c8d;">${cliente.destino.nombre} - ${cliente.destino.distancia} km</small>
            </div>
            <button onclick="eliminarCliente('${cliente.id}')" class="btn-danger">Eliminar</button>
        </div>
        
        <div class="producto-form">
            <input type="text" placeholder="Nombre Producto" id="${cliente.id}_nombreProducto">
            <input type="number" placeholder="Vol. (m³)" step="0.01" id="${cliente.id}_volumenUnitario">
            <input type="number" placeholder="Peso (kg)" step="0.1" id="${cliente.id}_pesoUnitario">
            <input type="number" placeholder="Unidades" id="${cliente.id}_unidades">
            <input type="number" placeholder="Precio Unit." id="${cliente.id}_precioUnitario">
            <button onclick="agregarProducto('${cliente.id}')" class="btn-secondary">+ Agregar</button>
        </div>
        
        <div id="${cliente.id}_productos"></div>
    `;
    
    container.appendChild(clienteDiv);
}

function eliminarCliente(clienteId) {
    if (!confirm('¿Está seguro de eliminar este cliente y todos sus productos?')) {
        return;
    }

    despacho.clientes = despacho.clientes.filter(c => c.id !== clienteId);
    document.getElementById(clienteId).remove();
    actualizarResumen();
}

// ============================================
// GESTIÓN DE PRODUCTOS
// ============================================

function agregarProducto(clienteId) {
    const nombreProducto = document.getElementById(`${clienteId}_nombreProducto`).value.trim();
    const volumenUnitario = parseFloat(document.getElementById(`${clienteId}_volumenUnitario`).value);
    const pesoUnitario = parseFloat(document.getElementById(`${clienteId}_pesoUnitario`).value);
    const unidades = parseInt(document.getElementById(`${clienteId}_unidades`).value);
    const precioUnitario = parseFloat(document.getElementById(`${clienteId}_precioUnitario`).value);

    if (!nombreProducto || !volumenUnitario || !pesoUnitario || !unidades || !precioUnitario) {
        alert('Por favor complete todos los campos del producto');
        return;
    }

    const cliente = despacho.clientes.find(c => c.id === clienteId);
    const productoId = `${clienteId}_prod_${cliente.productos.length + 1}`;

    const producto = {
        id: productoId,
        nombre: nombreProducto,
        volumenUnitario: volumenUnitario,
        pesoUnitario: pesoUnitario,
        unidades: unidades,
        precioUnitario: precioUnitario,
        volumenTotal: volumenUnitario * unidades,
        pesoTotal: pesoUnitario * unidades,
        valorTotal: precioUnitario * unidades
    };

    // Validar capacidad antes de agregar
    const tipoCamionSeleccionado = parseInt(document.getElementById('tipoCamionSeleccionado').value);
    if (tipoCamionSeleccionado) {
        let volumenTotalActual = 0;
        despacho.clientes.forEach(c => {
            c.productos.forEach(p => {
                volumenTotalActual += p.volumenTotal;
            });
        });
        
        const volumenConNuevo = volumenTotalActual + producto.volumenTotal;
        const camion = TIPOS_CAMION.find(c => c.capacidad === tipoCamionSeleccionado);
        const capacidadReal = camion.capacidad * camion.eficiencia;
        
        if (volumenConNuevo > capacidadReal) {
            alert(`No se puede agregar el producto. El volumen total (${volumenConNuevo.toFixed(2)} m³) excedería la capacidad del camión (${capacidadReal.toFixed(2)} m³)`);
            return;
        }
    }

    cliente.productos.push(producto);
    renderizarProducto(clienteId, producto);

    // Limpiar formulario
    document.getElementById(`${clienteId}_nombreProducto`).value = '';
    document.getElementById(`${clienteId}_volumenUnitario`).value = '';
    document.getElementById(`${clienteId}_pesoUnitario`).value = '';
    document.getElementById(`${clienteId}_unidades`).value = '';
    document.getElementById(`${clienteId}_precioUnitario`).value = '';

    actualizarResumen();
}

function renderizarProducto(clienteId, producto) {
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
        <button onclick="eliminarProducto('${clienteId}', '${producto.id}')" class="btn-danger" style="padding: 5px 10px;">Eliminar</button>
    `;
    
    container.appendChild(productoDiv);
}

function eliminarProducto(clienteId, productoId) {
    const cliente = despacho.clientes.find(c => c.id === clienteId);
    cliente.productos = cliente.productos.filter(p => p.id !== productoId);
    document.getElementById(productoId).remove();
    actualizarResumen();
}

// ============================================
// CÁLCULOS Y RESUMEN
// ============================================

function actualizarResumen() {
    // Calcular volumen total
    let volumenTotal = 0;
    let valorTotal = 0;

    despacho.clientes.forEach(cliente => {
        cliente.productos.forEach(producto => {
            volumenTotal += producto.volumenTotal;
            valorTotal += producto.valorTotal;
        });
    });

    document.getElementById('volumenTotal').textContent = `${volumenTotal.toFixed(2)} m³`;
    document.getElementById('valorTotalProductos').textContent = `$ ${valorTotal.toLocaleString()}`;

    // Usar camión seleccionado manualmente
    const tipoCamionSeleccionado = parseInt(document.getElementById('tipoCamionSeleccionado').value);
    
    if (tipoCamionSeleccionado) {
        const camionSeleccionado = TIPOS_CAMION.find(c => c.capacidad === tipoCamionSeleccionado);
        
        if (camionSeleccionado) {
            document.getElementById('tipoCamion').textContent = camionSeleccionado.nombre;
            
            const capacidadReal = camionSeleccionado.capacidad * camionSeleccionado.eficiencia;
            const ocupacion = (volumenTotal / capacidadReal * 100).toFixed(1);
            document.getElementById('ocupacionReal').textContent = `${ocupacion}%`;
            
            // Calcular flete si hay ruta seleccionada
            if (despacho.ruta) {
                const fleteTotal = despacho.ruta.tarifas[camionSeleccionado.capacidad];
                document.getElementById('fleteTotal').textContent = `$ ${fleteTotal.toLocaleString()}`;
            }
        }
    } else {
        document.getElementById('tipoCamion').textContent = '-';
        document.getElementById('ocupacionReal').textContent = '-';
        document.getElementById('fleteTotal').textContent = '$ 0';
    }
    
    // Actualizar detalle por cliente
    actualizarDetalleClientes();
    
    // Validar capacidad
    if (tipoCamionSeleccionado) {
        validarCapacidadCamion();
    }
}

function actualizarDetalleClientes() {
    const container = document.getElementById('detalleClientesContainer');
    
    if (despacho.clientes.length === 0) {
        container.innerHTML = '<p style="color: #64748b; font-size: 0.875em; text-align: center; padding: 20px;">No hay clientes agregados</p>';
        return;
    }
    
    container.innerHTML = '';
    
    despacho.clientes.forEach(cliente => {
        let volumenCliente = 0;
        let pesoCliente = 0;
        let valorCliente = 0;
        let cantidadProductos = 0;
        
        cliente.productos.forEach(producto => {
            volumenCliente += producto.volumenTotal;
            pesoCliente += producto.pesoTotal;
            valorCliente += producto.valorTotal;
            cantidadProductos += producto.unidades;
        });
        
        const clienteCard = document.createElement('div');
        clienteCard.style.cssText = 'background: #f8fafc; padding: 12px 16px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #2563eb; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; align-items: center;';
        
        clienteCard.innerHTML = `
            <div>
                <strong style="color: #1a3a52; font-size: 0.9em;">${cliente.nombre}</strong>
                <div style="color: #64748b; font-size: 0.8em; margin-top: 2px;">${cliente.destino.nombre} (${cliente.destino.distancia} km)</div>
            </div>
            <div style="text-align: center;">
                <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Productos</div>
                <div style="color: #1a3a52; font-weight: 600; font-size: 0.9em;">${cliente.productos.length} tipo(s)</div>
            </div>
            <div style="text-align: center;">
                <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Unidades</div>
                <div style="color: #1a3a52; font-weight: 600; font-size: 0.9em;">${cantidadProductos}</div>
            </div>
            <div style="text-align: center;">
                <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Volumen</div>
                <div style="color: #2563eb; font-weight: 600; font-size: 0.9em;">${volumenCliente.toFixed(2)} m³</div>
            </div>
            <div style="text-align: center;">
                <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Peso</div>
                <div style="color: #8b5cf6; font-weight: 600; font-size: 0.9em;">${pesoCliente.toFixed(1)} kg</div>
            </div>
            <div style="text-align: center;">
                <div style="color: #64748b; font-size: 0.75em; text-transform: uppercase;">Valor</div>
                <div style="color: #10b981; font-weight: 600; font-size: 0.9em;">$ ${valorCliente.toLocaleString()}</div>
            </div>
        `;
        
        container.appendChild(clienteCard);
    });
}

function seleccionarCamion(volumenTotal) {
    // Seleccionar el camión más pequeño que pueda con la carga (considerando eficiencia del 80%)
    for (let i = 0; i < TIPOS_CAMION.length; i++) {
        const camion = TIPOS_CAMION[i];
        const capacidadReal = camion.capacidad * camion.eficiencia;
        
        if (volumenTotal <= capacidadReal) {
            return camion;
        }
    }
    
    // Si ninguno alcanza, devolver el más grande con advertencia
    alert('ADVERTENCIA: El volumen excede la capacidad del camión más grande disponible');
    return TIPOS_CAMION[TIPOS_CAMION.length - 1];
}

// ============================================
// CÁLCULO FINAL DEL DESPACHO
// ============================================

function calcularDespacho() {
    // Validaciones
    if (!despacho.ruta) {
        alert('Por favor seleccione una ruta');
        return;
    }

    if (despacho.clientes.length === 0) {
        alert('Por favor agregue al menos un cliente con productos');
        return;
    }

    let tieneProductos = false;
    despacho.clientes.forEach(cliente => {
        if (cliente.productos.length > 0) {
            tieneProductos = true;
        }
    });

    if (!tieneProductos) {
        alert('Por favor agregue productos a los clientes');
        return;
    }

    // Validar que se haya seleccionado camión
    const tipoCamionSeleccionado = parseInt(document.getElementById('tipoCamionSeleccionado').value);
    if (!tipoCamionSeleccionado) {
        alert('Por favor seleccione el tipo de camión');
        return;
    }

    // Calcular volumen total
    let volumenTotal = 0;
    despacho.clientes.forEach(cliente => {
        cliente.productos.forEach(producto => {
            volumenTotal += producto.volumenTotal;
        });
    });

    // Usar camión seleccionado
    const camionSeleccionado = TIPOS_CAMION.find(c => c.capacidad === tipoCamionSeleccionado);
    const capacidadReal = camionSeleccionado.capacidad * camionSeleccionado.eficiencia;
    
    // Validar que no exceda capacidad
    if (volumenTotal > capacidadReal) {
        alert(`El volumen total (${volumenTotal.toFixed(2)} m³) excede la capacidad del camión seleccionado (${capacidadReal.toFixed(2)} m³)`);
        return;
    }
    
    const fleteTotal = despacho.ruta.tarifas[camionSeleccionado.capacidad];

    // ============================================
    // NUEVO CÁLCULO PROPORCIONAL: VOLUMEN × DISTANCIA
    // ============================================
    
    // 1. Calcular el factor de ponderación para cada cliente
    let totalFactorPonderado = 0;
    
    despacho.clientes.forEach(cliente => {
        let volumenCliente = 0;
        cliente.productos.forEach(producto => {
            volumenCliente += producto.volumenTotal;
        });
        
        // Factor de ponderación = Volumen × Distancia
        cliente.factorPonderacion = volumenCliente * cliente.destino.distancia;
        totalFactorPonderado += cliente.factorPonderacion;
    });

    // 2. Asignar flete proporcionalmente por producto
    despacho.clientes.forEach(cliente => {
        let volumenCliente = 0;
        cliente.productos.forEach(producto => {
            volumenCliente += producto.volumenTotal;
        });
        
        // Participación del cliente en el flete total
        cliente.participacionFlete = (cliente.factorPonderacion / totalFactorPonderado) * 100;
        cliente.fleteAsignado = (cliente.factorPonderacion / totalFactorPonderado) * fleteTotal;
        
        // Distribuir el flete del cliente entre sus productos proporcionalmente
        cliente.productos.forEach(producto => {
            producto.participacionVolumen = (producto.volumenTotal / volumenTotal) * 100;
            producto.participacionVolumenCliente = (producto.volumenTotal / volumenCliente) * 100;
            
            // El flete del producto es proporcional a su volumen dentro del flete del cliente
            producto.fleteAsignado = (producto.volumenTotal / volumenCliente) * cliente.fleteAsignado;
            producto.porcentajeFleteVenta = (producto.fleteAsignado / producto.valorTotal) * 100;
        });
    });

    // Generar reporte
    generarReporte();

    // Mostrar sección de reporte
    document.getElementById('reporteSection').style.display = 'block';
    document.getElementById('reporteSection').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// GENERACIÓN DE REPORTES
// ============================================

function generarReporte() {
    generarReporteProductos();
    generarReporteClientes();
    generarAnalisisMixto();
}

function generarReporteProductos() {
    const tbody = document.getElementById('tablaProductosBody');
    tbody.innerHTML = '';

    despacho.clientes.forEach(cliente => {
        cliente.productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${cliente.nombre}</strong></td>
                <td>${cliente.destino.nombre}</td>
                <td>${cliente.destino.distancia}</td>
                <td>${producto.nombre}</td>
                <td>${producto.unidades}</td>
                <td>${producto.volumenUnitario.toFixed(2)}</td>
                <td>${producto.volumenTotal.toFixed(2)}</td>
                <td>${producto.pesoUnitario.toFixed(1)}</td>
                <td>${producto.pesoTotal.toFixed(1)}</td>
                <td>$ ${producto.precioUnitario.toLocaleString()}</td>
                <td>$ ${producto.valorTotal.toLocaleString()}</td>
                <td><strong>$ ${producto.fleteAsignado.toLocaleString()}</strong></td>
                <td style="color: ${producto.porcentajeFleteVenta > 15 ? 'red' : 'green'}; font-weight: bold;">
                    ${producto.porcentajeFleteVenta.toFixed(2)}%
                </td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function generarReporteClientes() {
    const tbody = document.getElementById('tablaClientesBody');
    tbody.innerHTML = '';

    despacho.clientes.forEach(cliente => {
        let volumenTotalCliente = 0;
        let pesoTotalCliente = 0;
        let valorTotalCliente = 0;
        let fleteTotalCliente = 0;

        cliente.productos.forEach(producto => {
            volumenTotalCliente += producto.volumenTotal;
            pesoTotalCliente += producto.pesoTotal;
            valorTotalCliente += producto.valorTotal;
            fleteTotalCliente += producto.fleteAsignado;
        });

        const porcentajeFleteVentaCliente = (fleteTotalCliente / valorTotalCliente) * 100;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${cliente.nombre}</strong></td>
            <td>${cliente.destino.nombre}</td>
            <td>${cliente.destino.distancia}</td>
            <td>${volumenTotalCliente.toFixed(2)}</td>
            <td>${pesoTotalCliente.toFixed(1)}</td>
            <td>${cliente.factorPonderacion.toFixed(2)}</td>
            <td><strong>${cliente.participacionFlete.toFixed(2)}%</strong></td>
            <td>$ ${valorTotalCliente.toLocaleString()}</td>
            <td><strong>$ ${fleteTotalCliente.toLocaleString()}</strong></td>
            <td style="color: ${porcentajeFleteVentaCliente > 15 ? 'red' : 'green'}; font-weight: bold;">
                ${porcentajeFleteVentaCliente.toFixed(2)}%
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function generarAnalisisMixto() {
    // Calcular totales para ambas dimensiones
    let volumenTotal = 0;
    let pesoTotal = 0;
    let fleteTotal = parseFloat(document.getElementById('fleteTotal').textContent.replace('$', '').replace(/\./g, '').trim());
    
    despacho.clientes.forEach(cliente => {
        cliente.productos.forEach(producto => {
            volumenTotal += producto.volumenTotal;
            pesoTotal += producto.pesoTotal;
        });
    });
    
    // DIMENSIÓN OPERATIVA (Volumen × Distancia)
    const resumenOperativo = document.getElementById('resumenOperativo');
    let htmlOperativo = '<div style="font-size: 0.85em; line-height: 1.8;">';
    htmlOperativo += `<p style="margin: 5px 0;"><strong>Método:</strong> Flete asignado por <strong>Volumen × Distancia</strong></p>`;
    htmlOperativo += `<p style="margin: 5px 0;"><strong>Volumen Total:</strong> ${volumenTotal.toFixed(2)} m³</p>`;
    htmlOperativo += `<p style="margin: 5px 0;"><strong>Flete Total:</strong> $ ${fleteTotal.toLocaleString()}</p>`;
    htmlOperativo += `<p style="margin: 5px 0;"><strong>Objetivo:</strong> Distribución equitativa según ocupación y distancia</p>`;
    
    // Listar clientes con mayor participación operativa
    const clientesOperativos = despacho.clientes.map(c => {
        let vol = 0;
        c.productos.forEach(p => vol += p.volumenTotal);
        return { nombre: c.nombre, valor: vol, porcentaje: (c.participacionFlete || 0) };
    }).sort((a, b) => b.porcentaje - a.porcentaje);
    
    htmlOperativo += '<hr style="margin: 12px 0; border: none; border-top: 1px solid #bfdbfe;">';
    htmlOperativo += '<p style="margin: 8px 0 5px 0; font-weight: 600; color: #1e40af;">Top Clientes (Operativo):</p>';
    clientesOperativos.slice(0, 3).forEach((c, i) => {
        htmlOperativo += `<p style="margin: 3px 0; font-size: 0.8em;">${i+1}. ${c.nombre}: ${c.porcentaje.toFixed(1)}% del flete</p>`;
    });
    htmlOperativo += '</div>';
    resumenOperativo.innerHTML = htmlOperativo;
    
    // DIMENSIÓN FINANCIERA (Peso - simulación)
    const resumenFinanciero = document.getElementById('resumenFinanciero');
    let htmlFinanciero = '<div style="font-size: 0.85em; line-height: 1.8;">';
    htmlFinanciero += `<p style="margin: 5px 0;"><strong>Método:</strong> Análisis futuro por <strong>Peso × Costo SAP</strong></p>`;
    htmlFinanciero += `<p style="margin: 5px 0;"><strong>Peso Total:</strong> ${pesoTotal.toFixed(1)} kg</p>`;
    htmlFinanciero += `<p style="margin: 5px 0;"><strong>Estado:</strong> <span style="color: #dc2626;">Pendiente integración SAP</span></p>`;
    htmlFinanciero += `<p style="margin: 5px 0;"><strong>Objetivo:</strong> Rentabilidad por costo de producción (peso/valor)</p>`;
    
    // Listar clientes con mayor peso
    const clientesFinancieros = despacho.clientes.map(c => {
        let peso = 0;
        c.productos.forEach(p => peso += p.pesoTotal);
        return { nombre: c.nombre, peso: peso, porcentaje: (peso / pesoTotal * 100) };
    }).sort((a, b) => b.peso - a.peso);
    
    htmlFinanciero += '<hr style="margin: 12px 0; border: none; border-top: 1px solid #bbf7d0;">';
    htmlFinanciero += '<p style="margin: 8px 0 5px 0; font-weight: 600; color: #166534;">Top Clientes (Financiero):</p>';
    clientesFinancieros.slice(0, 3).forEach((c, i) => {
        htmlFinanciero += `<p style="margin: 3px 0; font-size: 0.8em;">${i+1}. ${c.nombre}: ${c.peso.toFixed(1)} kg (${c.porcentaje.toFixed(1)}%)</p>`;
    });
    htmlFinanciero += '<p style="margin: 10px 0 5px 0; padding: 8px; background: #fef3c7; border-radius: 4px; font-size: 0.8em; color: #92400e;">⚠️ La dimensión financiera requiere integración con SAP para costos reales por peso</p>';
    htmlFinanciero += '</div>';
    resumenFinanciero.innerHTML = htmlFinanciero;
}

function calcularVolumenTotalDespacho() {
    let total = 0;
    despacho.clientes.forEach(cliente => {
        cliente.productos.forEach(producto => {
            total += producto.volumenTotal;
        });
    });
    return total;
}

// ============================================
// EXPORTACIÓN Y UTILIDADES
// ============================================

function exportarReporte() {
    let contenido = "=".repeat(80) + "\n";
    contenido += "REPORTE DE DESPACHO - GE LOGÍSTICA S.A.S.\n";
    contenido += "=".repeat(80) + "\n\n";
    
    contenido += `Fecha: ${document.getElementById('fechaDespacho').value}\n`;
    contenido += `Ruta: ${despacho.ruta.nombre}\n`;
    contenido += `Destinos: ${despacho.ruta.destinos.join(', ')}\n`;
    contenido += `Distancia: ${despacho.ruta.distancia} km\n\n`;

    contenido += `Volumen Total: ${document.getElementById('volumenTotal').textContent}\n`;
    contenido += `Tipo Camión: ${document.getElementById('tipoCamion').textContent}\n`;
    contenido += `Ocupación: ${document.getElementById('ocupacionReal').textContent}\n`;
    contenido += `Flete Total: ${document.getElementById('fleteTotal').textContent}\n\n`;

    contenido += "=".repeat(80) + "\n";
    contenido += "DETALLE POR PRODUCTO\n";
    contenido += "=".repeat(80) + "\n\n";

    despacho.clientes.forEach(cliente => {
        contenido += `\nCliente: ${cliente.nombre}\n`;
        contenido += "-".repeat(80) + "\n";
        
        cliente.productos.forEach(producto => {
            contenido += `  Producto: ${producto.nombre}\n`;
            contenido += `  Unidades: ${producto.unidades}\n`;
            contenido += `  Volumen Total: ${producto.volumenTotal.toFixed(2)} m³\n`;
            contenido += `  Participación: ${producto.participacionVolumen.toFixed(2)}%\n`;
            contenido += `  Valor Total: $ ${producto.valorTotal.toLocaleString()}\n`;
            contenido += `  Flete Asignado: $ ${producto.fleteAsignado.toLocaleString()}\n`;
            contenido += `  % Flete/Venta: ${producto.porcentajeFleteVenta.toFixed(2)}%\n\n`;
        });
    });

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Despacho_${despacho.ruta.nombre.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Reporte exportado exitosamente');
}

function nuevoDespacho() {
    if (!confirm('¿Está seguro de crear un nuevo despacho? Se perderán los datos actuales.')) {
        return;
    }

    // Resetear estado
    despacho = {
        ruta: null,
        fecha: null,
        observaciones: "",
        clientes: []
    };
    
    contadorClientes = 0;

    // Limpiar interfaz
    document.getElementById('ruta').value = '';
    document.getElementById('infoRuta').style.display = 'none';
    document.getElementById('clientesContainer').innerHTML = '';
    document.getElementById('reporteSection').style.display = 'none';
    
    actualizarResumen();
    establecerFechaActual();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
