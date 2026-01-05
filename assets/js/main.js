// --- Lógica para formulario de pedido tipo Picking SAP ---
document.addEventListener('DOMContentLoaded', function() {
                // --- Modal para agregar/editar producto ---
                let productoEditandoIdx = null;
                const modalProducto = document.getElementById('modalProductoPicking');
                const modalTitulo = document.getElementById('modalProductoTitulo');
                const modalCodigo = document.getElementById('modalProdCodigo');
                const modalDescripcion = document.getElementById('modalProdDescripcion');
                const modalLote = document.getElementById('modalProdLote');
                const modalUnidad = document.getElementById('modalProdUnidad');
                const modalCantidad = document.getElementById('modalProdCantidad');
                const modalPicking = document.getElementById('modalProdPicking');
                const modalCancelar = document.getElementById('modalProdCancelar');
                const modalGuardar = document.getElementById('modalProdGuardar');

                // Abrir modal para agregar producto
                window.abrirModalAgregarProducto = function() {
                    productoEditandoIdx = null;
                    modalTitulo.textContent = 'Agregar Producto';
                    modalCodigo.value = '';
                    modalDescripcion.value = '';
                    modalLote.value = '';
                    modalUnidad.value = 'UN';
                    modalCantidad.value = 1;
                    modalPicking.value = 0;
                    modalProducto.style.display = 'flex';
                    setTimeout(()=>modalCodigo.focus(), 100);
                };
                // Abrir modal para editar producto
                window.abrirModalEditarProducto = function(idx) {
                    productoEditandoIdx = idx;
                    const prod = productosPicking[idx];
                    modalTitulo.textContent = 'Editar Producto';
                    modalCodigo.value = prod.codigo||'';
                    modalDescripcion.value = prod.descripcion||'';
                    modalLote.value = prod.lote||'';
                    modalUnidad.value = prod.unidad||'UN';
                    modalCantidad.value = prod.cantidad||1;
                    modalPicking.value = prod.picking||0;
                    modalProducto.style.display = 'flex';
                    setTimeout(()=>modalCodigo.focus(), 100);
                };
                // Guardar producto (agregar o editar)
                modalGuardar.onclick = function() {
                    const prod = {
                        codigo: modalCodigo.value.trim(),
                        descripcion: modalDescripcion.value.trim(),
                        lote: modalLote.value.trim(),
                        unidad: modalUnidad.value.trim(),
                        cantidad: parseInt(modalCantidad.value),
                        picking: parseInt(modalPicking.value)
                    };
                    if (!prod.codigo || !prod.descripcion || !prod.cantidad) {
                        alert('Completa los campos obligatorios');
                        return;
                    }
                    if (productoEditandoIdx === null) {
                        productosPicking.push(prod);
                    } else {
                        productosPicking[productoEditandoIdx] = prod;
                    }
                    renderProductosPicking();
                    modalProducto.style.display = 'none';
                };
                // Cancelar modal
                modalCancelar.onclick = function() { modalProducto.style.display = 'none'; };
                // Cerrar modal al hacer clic fuera
                modalProducto.onclick = function(e) { if (e.target === modalProducto) modalProducto.style.display = 'none'; };
            // Lógica de búsqueda SAP (simulada)
            const btnBuscarSAP = document.getElementById('btnBuscarSAP');
            if (btnBuscarSAP) {
                btnBuscarSAP.onclick = function() {
                    const valor = document.getElementById('busquedaSAP').value.trim();
                    const tipo = document.getElementById('tipoBusquedaSAP').value;
                    if (!valor) {
                        alert('Ingrese un valor para buscar.');
                        return;
                    }
                    // Aquí se integrará la búsqueda real contra SAP
                    alert('Búsqueda simulada:\nTipo: ' + tipo + '\nValor: ' + valor + '\n(En integración, aquí se traerán los datos automáticamente)');
                };
            }
        // Fecha de emisión automática (hoy)
        const fechaInput = document.getElementById('pickingFecha');
        if (fechaInput) {
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            fechaInput.value = `${yyyy}-${mm}-${dd}`;
        }
    // Productos dinámicos para el picking
    let productosPicking = [];

    function renderProductosPicking() {
        const tbody = document.getElementById('tbodyProductosPicking');
        tbody.innerHTML = '';
        productosPicking.forEach((prod, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prod.codigo||''}</td>
                <td>${prod.descripcion||''}</td>
                <td>${prod.lote||''}</td>
                <td>${prod.unidad||''}</td>
                <td>${prod.cantidad||''}</td>
                <td>${prod.picking||''}</td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm" onclick="window.abrirModalEditarProducto(${idx})">Editar</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="window.eliminarProdPicking(${idx})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    window.agregarProductoPicking = function() {
        window.abrirModalAgregarProducto();
    };
    window.actualizarProdPicking = function(idx, campo, valor) {
        productosPicking[idx][campo] = valor;
    };
    window.eliminarProdPicking = function(idx) {
        productosPicking.splice(idx, 1);
        renderProductosPicking();
    };
    document.getElementById('btnAgregarProductoPicking').onclick = function() {
        window.abrirModalAgregarProducto();
    };
    // Guardar pedido (simulado)
    document.getElementById('btnGuardarPicking').onclick = function() {
        const pedido = {
            pedido: document.getElementById('pickingPedido').value,
            fecha: document.getElementById('pickingFecha').value,
            cliente: document.getElementById('pickingCliente').value,
            nit: document.getElementById('pickingNIT').value,
            direccion: document.getElementById('pickingDireccion').value,
            ciudad: document.getElementById('pickingCiudad').value,
            zona: document.getElementById('pickingZona').value,
            transporte: document.getElementById('pickingTransporte').value,
            ruta: document.getElementById('pickingRuta').value,
            observaciones: document.getElementById('pickingObservaciones').value,
            productos: productosPicking.slice(),
            costoSAP: document.getElementById('pickingCostoSAP').value
        };
        alert('Pedido guardado (simulado):\n' + JSON.stringify(pedido, null, 2));
        // Aquí podrías limpiar el formulario si lo deseas
    };
    // Inicializa con una fila de producto
    productosPicking.push({codigo:'',descripcion:'',lote:'',unidad:'UN',cantidad:1,picking:0});
    renderProductosPicking();
});
// JS extraído de index.html
// ...existing code...


// Definir tipos de camión para el select
const TIPOS_CAMION = [
    "Camión 25 m³",
    "Camión 37 m³",
    "Camión 45 m³"
];

// Asegurar que DespachoModel esté disponible si se usa en el controlador global
if (typeof window !== 'undefined' && typeof DespachoModel === 'undefined') {
    window.DespachoModel = DespachoModel;
}




// Interceptar intento de abrir modal de pedido si no está habilitado
// ...eliminado bloque duplicado de addEventListener para btnAbrirModalPedido...
// --- Lógica de Pedidos y Productos ---
let pedidos = [];
let capacidadCamion = 25;
let editandoPedido = false;
let indiceEditando = null;
let nuevoPedido = {
    cliente: '',
    numero: '',
    canal: '',
    productos: [crearProductoVacio()]
};

function crearProductoVacio() {
    return { nombre: '', cantidad: 1, volumenUnitario: 0, pesoUnitario: 0, precioUnitario: 0, destino: '' };
}

function abrirModalPedido() {
    editandoPedido = false;
    indiceEditando = null;
    nuevoPedido = {
        cliente: '',
        numero: '',
        canal: '',
        productos: [crearProductoVacio()]
    };
    renderProductosPedidoForm();
    document.getElementById('pedidoCliente').value = '';
    document.getElementById('pedidoNumero').value = '';
    document.getElementById('pedidoCanal').value = '';
    document.getElementById('modalPedidoTitulo').textContent = 'Agregar Pedido';
        document.getElementById('modalPedido').classList.add('show');
        document.getElementById('modalPedidoBackdrop').classList.add('show');
        document.body.style.overflow = 'hidden';
}

function cerrarModalPedido() {
    document.getElementById('modalPedido').style.display = 'none';
        document.getElementById('modalPedido').classList.remove('show');
        document.getElementById('modalPedidoBackdrop').classList.remove('show');
        document.body.style.overflow = '';
}

    // Cerrar modal al hacer clic fuera
    document.addEventListener('mousedown', function(e) {
        const modal = document.getElementById('modalPedido');
        const backdrop = document.getElementById('modalPedidoBackdrop');
        if (modal.classList.contains('show') && backdrop.classList.contains('show')) {
            if (!modal.querySelector('.modal-dialog').contains(e.target) && backdrop.contains(e.target)) {
                cerrarModalPedido();
            }
        }
    });

    // Cerrar modal con Esc
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') cerrarModalPedido();
    });
function agregarProductoAlPedido() {
    nuevoPedido.productos.push(crearProductoVacio());
    renderProductosPedidoForm();
}

function eliminarProductoDelPedido(idx) {
    if (nuevoPedido.productos.length > 1) {
        nuevoPedido.productos.splice(idx, 1);
        renderProductosPedidoForm();
    }
}

function renderProductosPedidoForm() {
    const cont = document.getElementById('productosPedidoForm');
    cont.innerHTML = '';
    // Opciones de productos de prueba
    const productosPrueba = [
        { nombre: 'LAM UT 200', cantidad: 100, volumenUnitario: 0.16, precioUnitario: 96223, destino: 'Destino 1' },
        { nombre: 'COL MONARCA', cantidad: 6, volumenUnitario: 0.53, precioUnitario: 605406, destino: 'Destino 2' },
        { nombre: 'COL CONFORT PREMIUM', cantidad: 5, volumenUnitario: 0.90, precioUnitario: 734200, destino: 'Destino 3' }
    ];
    nuevoPedido.productos.forEach((prod, idx) => {
        const div = document.createElement('div');
        div.style.display = 'grid';
        div.style.gridTemplateColumns = '2fr 1fr 1fr 1fr 1fr auto';
        div.style.gap = '10px';
        div.style.marginBottom = '8px';
        div.style.alignItems = 'end';
        div.innerHTML = `
            <div class="form-group" style="margin-bottom: 0;">
                <label>Producto:</label>
                <select onchange="if(this.value){cargarProductoPrueba(${idx}, this.value);}else{actualizarProdCampo(${idx}, 'nombre', '');actualizarProdCampo(${idx}, 'cantidad', 1);actualizarProdCampo(${idx}, 'volumenUnitario', 0);actualizarProdCampo(${idx}, 'precioUnitario', 0);actualizarProdCampo(${idx}, 'destino', '');renderProductosPedidoForm();}" style="width:100%;margin-bottom:4px;">
                    <option value="">-- Manual / Nuevo --</option>
                    <option value="0" ${prod.nombre==='LAM UT 200'?'selected':''}>LAM UT 200</option>
                    <option value="1" ${prod.nombre==='COL MONARCA'?'selected':''}>COL MONARCA</option>
                    <option value="2" ${prod.nombre==='COL CONFORT PREMIUM'?'selected':''}>COL CONFORT PREMIUM</option>
                </select>
                <input type="text" value="${prod.nombre}" placeholder="Nombre producto" onchange="actualizarProdCampo(${idx}, 'nombre', this.value)">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Cantidad:</label>
                <input type="number" min="1" value="${prod.cantidad}" onchange="actualizarProdCampo(${idx}, 'cantidad', this.value)">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Vol. Unit. (m³):</label>
                <input type="number" step="0.001" value="${prod.volumenUnitario}" onchange="actualizarProdCampo(${idx}, 'volumenUnitario', this.value)">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Precio Unit. ($):</label>
                <input type="number" step="100" value="${prod.precioUnitario}" onchange="actualizarProdCampo(${idx}, 'precioUnitario', this.value)">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>Destino:</label>
                <input type="text" value="${prod.destino}" onchange="actualizarProdCampo(${idx}, 'destino', this.value)">
            </div>
            <button type="button" class="btn btn-danger btn-sm" onclick="eliminarProductoDelPedido(${idx})">X</button>
        `;
        cont.appendChild(div);
    });
    // Función global para cargar producto de prueba
    window.cargarProductoPrueba = function(idx, val) {
        if (productosPrueba[val]) {
            Object.keys(productosPrueba[val]).forEach(k => {
                actualizarProdCampo(idx, k, productosPrueba[val][k]);
            });
            renderProductosPedidoForm();
        }
    }
}

function actualizarProdCampo(idx, campo, valor) {
    if (campo === 'cantidad' || campo === 'volumenUnitario' || campo === 'pesoUnitario' || campo === 'precioUnitario') {
        valor = parseFloat(valor) || 0;
    }
    nuevoPedido.productos[idx][campo] = valor;
}

function guardarPedido() {
    // Validaciones básicas
    const cliente = document.getElementById('pedidoCliente').value.trim();
    const numero = document.getElementById('pedidoNumero').value.trim();
    const canal = document.getElementById('pedidoCanal').value;
    if (!cliente || !numero || !canal) {
        mostrarAlerta('Completa todos los campos obligatorios del pedido.');
        return;
    }
    if (nuevoPedido.productos.length === 0 || nuevoPedido.productos.some(p => !p.nombre || !p.destino)) {
        mostrarAlerta('Completa los datos de todos los productos y su destino.');
        return;
    }
    const volumenPedido = nuevoPedido.productos.reduce((acc, prod) => acc + (prod.cantidad * prod.volumenUnitario), 0);
    const volumenOcupado = pedidos.reduce((acc, ped) => acc + ped.productos.reduce((a, prod) => a + (prod.cantidad * prod.volumenUnitario), 0), 0);
    let volumenFinal = volumenOcupado + volumenPedido;
    if (editandoPedido) {
        const anterior = pedidos[indiceEditando].productos.reduce((a, prod) => a + (prod.cantidad * prod.volumenUnitario), 0);
        volumenFinal = volumenOcupado - anterior + volumenPedido;
    }
    if (volumenFinal > capacidadCamion) {
        mostrarAlerta('¡Capacidad del camión superada!');
        return;
    }
    const pedidoObj = {
        cliente,
        numero,
        canal,
        productos: JSON.parse(JSON.stringify(nuevoPedido.productos))
    };
    if (editandoPedido) {
        pedidos[indiceEditando] = pedidoObj;
    } else {
        pedidos.push(pedidoObj);
    }
    cerrarModalPedido();
    mostrarAlerta('');
    renderPedidosResumen();
    renderOcupacionVisual();
}

function mostrarAlerta(msg) {
    const alerta = document.getElementById('alertaCapacidad');
    if (msg) {
        alerta.textContent = msg;
        alerta.style.display = 'block';
    } else {
        alerta.style.display = 'none';
    }
}

function renderPedidosResumen() {
    const cont = document.getElementById('pedidosResumenContainer');
    if (pedidos.length === 0) {
        cont.innerHTML = '';
        return;
    }
    let html = `<h3 style=\"margin: 0 0 15px 0; font-size: 0.95em; color: #334155;\">Pedidos en el Camión</h3>`;
    html += `<div class='acordeon-pedidos'>`;
    pedidos.forEach((pedido, idx) => {
        const volTotal = pedido.productos.reduce((acc, prod) => acc + (prod.cantidad * prod.volumenUnitario), 0);
        const subtotal = pedido.productos.reduce((acc, prod) => acc + (prod.cantidad * prod.precioUnitario), 0);
        html += `
        <div class='acordeon-item' style="margin-bottom:8px;border-radius:8px;overflow:hidden;">
            <div class='acordeon-header' style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:12px 18px;background:#f8fafc;font-weight:600;" onclick="toggleAcordeonPedido(${idx})">
                <span><span style='color:#1e40af;'>${pedido.cliente}</span> | Pedido: <b>${pedido.numero}</b> | Canal: <span style='color:#64748b;'>${pedido.canal}</span></span>
                <span style='font-size:0.95em;color:#fb923c;'>Vol: ${volTotal.toFixed(2)} m³ | $${subtotal.toLocaleString()}</span>
                <span id='acordeon-icon-${idx}' style='margin-left:12px;font-size:1.2em;'>▼</span>
            </div>
            <div class='acordeon-body' id='acordeon-body-${idx}' style='display:none;background:#fff;padding:12px 24px 12px 24px;'>
                <div style='overflow-x:auto;'>
                <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
                    <thead>
                        <tr style='background:#f1f5fa;'>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Producto</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Cantidad</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Vol. Unit. (m³)</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Vol. Total (m³)</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Precio Unit.</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Valor Total</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Destino</th>
                            <th style='padding:6px 8px;border:1px solid #e2e8f0;'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedido.productos.map((prod, pidx) => {
                            const volTotal = (prod.cantidad * prod.volumenUnitario).toFixed(2);
                            const valorTotal = (prod.cantidad * prod.precioUnitario).toLocaleString();
                            return `
                            <tr>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>${prod.nombre}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>${prod.cantidad}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>${prod.volumenUnitario}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>${volTotal}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>${prod.precioUnitario}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>$${valorTotal}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>${prod.destino}</td>
                                <td style='padding:6px 8px;border:1px solid #e2e8f0;'>
                                    <button class='btn btn-warning btn-sm' onclick='editarPedido(${idx});setTimeout(()=>{document.querySelectorAll("#productosPedidoForm input")[0].focus();},200)'>Editar</button>
                                    <button class='btn btn-danger btn-sm' onclick='eliminarProductoDesdeAcordeon(${idx},${pidx})'>Eliminar</button>
                                </td>
                            </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                </div>
                <div style='margin-top:8px;display:flex;gap:8px;'>
                    <button class='btn btn-secondary btn-sm' onclick='editarPedido(${idx});setTimeout(()=>{window.agregarProductoAlPedido();},200)'>Agregar otro producto</button>
                    <button class='btn btn-warning btn-sm' onclick='editarPedido(${idx})'>Editar Pedido</button>
                    <button class='btn btn-danger btn-sm' onclick='eliminarPedido(${idx})'>Eliminar Pedido</button>
                </div>
            </div>
        </div>`;
    // Eliminar producto desde el acordeón
    window.eliminarProductoDesdeAcordeon = function(pedidoIdx, prodIdx) {
        if (pedidos[pedidoIdx].productos.length > 1) {
            pedidos[pedidoIdx].productos.splice(prodIdx, 1);
            renderPedidosResumen();
            renderOcupacionVisual();
        }
    }
    });
    html += `</div>`;
    cont.innerHTML = html;
    // Cerrar todos los acordeones menos el último agregado
    pedidos.forEach((_, i) => {
        document.getElementById('acordeon-body-' + i).style.display = 'none';
        document.getElementById('acordeon-icon-' + i).textContent = '▼';
    });
// Eliminar llave extra aquí
// Función global para el acordeón
window.toggleAcordeonPedido = function(idx) {
    const body = document.getElementById('acordeon-body-' + idx);
    const icon = document.getElementById('acordeon-icon-' + idx);
    if (body.style.display === 'none') {
        body.style.display = 'block';
        icon.textContent = '▲';
    } else {
        body.style.display = 'none';
        icon.textContent = '▼';
    }
}
function editarPedido(idx) {
    editandoPedido = true;
    indiceEditando = idx;
    // Copiar datos del pedido seleccionado
    const pedido = pedidos[idx];
    nuevoPedido = {
        cliente: pedido.cliente,
        numero: pedido.numero,
        canal: pedido.canal,
        productos: JSON.parse(JSON.stringify(pedido.productos))
    };
    renderProductosPedidoForm();
    document.getElementById('pedidoCliente').value = pedido.cliente;
    document.getElementById('pedidoNumero').value = pedido.numero;
    document.getElementById('pedidoCanal').value = pedido.canal;
    document.getElementById('modalPedidoTitulo').textContent = 'Editar Pedido';
    document.getElementById('modalPedido').classList.add('show');
    document.getElementById('modalPedidoBackdrop').classList.add('show');
    document.body.style.overflow = 'hidden';
}
}

function renderOcupacionVisual() {
window.renderOcupacionVisual = renderOcupacionVisual;
    const volumenOcupado = pedidos.reduce((acc, ped) => acc + ped.productos.reduce((a, prod) => a + (prod.cantidad * prod.volumenUnitario), 0), 0);
    const porcentajeOcupacion = ((volumenOcupado / capacidadCamion) * 100).toFixed(2);
    const rutaSelect = document.getElementById('ruta');
    const tipoCamionSelect = document.getElementById('tipoCamionSeleccionado');
    const rutaId = rutaSelect && rutaSelect.value ? parseInt(rutaSelect.value) : null;
    let tipoCamion = tipoCamionSelect && tipoCamionSelect.value ? tipoCamionSelect.value : null;
    // Asegurar que el tipo de camión sea número
    if (tipoCamion !== null) tipoCamion = Number(tipoCamion);
    let capacidadTexto = '';
    if (tipoCamion) {
        capacidadTexto = `<span style='font-size:0.95em;display:block;color:#64748b;margin-top:2px;'>Capacidad: ${tipoCamion} m³</span>`;
    }
    let nombreRuta = '';
    if (rutaId && window.appController && window.appController.rutaModel) {
        const rutaObj = window.appController.rutaModel.obtenerRutaPorIdSync(rutaId);
        if (rutaObj && rutaObj.nombre) {
            nombreRuta = `<span style='font-size:0.93em;display:block;color:#334155;margin-top:2px;'>Ruta: <b>${rutaObj.nombre}</b></span>`;
        }
    }
    // Mostrar solo ocupación y nombre de ruta, el valor de flete lo maneja el controlador
    document.getElementById('porcentajeOcupacion').innerHTML = `<span>${porcentajeOcupacion}%</span>` + capacidadTexto + nombreRuta;
    const visual = document.getElementById('ocupacionVisual');
    // El camión siempre centrado dentro de la barra
    const barraWidth = 120; // px
    visual.innerHTML = `<div style='width:${barraWidth}px;height:60px;background:#e5e7eb;border-radius:12px;position:relative;overflow:hidden;box-shadow:0 2px 8px #0001;border:2px solid #fb923c;'>
        <div style='width:${porcentajeOcupacion}%;height:100%;background:${porcentajeOcupacion<80?'#60a5fa':(porcentajeOcupacion<100?'#facc15':'#ef4444')};position:absolute;left:0;top:0;'></div>
        <div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;z-index:3;pointer-events:none;">
            <span style='font-size:2em;line-height:1;'>🚚</span>
        </div>
    </div>
    <span style='font-size:1.1em;color:#334155;'>${volumenOcupado.toFixed(2)} m³ / ${capacidadCamion} m³</span>`;
}

function eliminarPedido(idx) {
    pedidos.splice(idx, 1);
    renderPedidosResumen();
    renderOcupacionVisual();
}

// Inicialización segura tras cargar el DOM

document.addEventListener('DOMContentLoaded', function() {
    // Botón para abrir el modal
    let btnAgregarPedido = document.getElementById('btnAbrirModalPedido');
    if (!btnAgregarPedido) {
        btnAgregarPedido = document.createElement('button');
        btnAgregarPedido.id = 'btnAbrirModalPedido';
        btnAgregarPedido.className = 'btn btn-primary mb-3';
        btnAgregarPedido.type = 'button';
        btnAgregarPedido.textContent = 'Agregar Pedido';
        const alerta = document.getElementById('alertaCapacidad');
        if (alerta && alerta.parentNode) {
            alerta.parentNode.insertBefore(btnAgregarPedido, alerta.nextSibling);
        }
    }
    const btnCerrarModalPedido = document.getElementById('btnCerrarModalPedido');
    const btnCancelarModalPedido = document.getElementById('btnCancelarModalPedido');
    const btnAgregarProductoPedido = document.getElementById('btnAgregarProductoPedido');
    const btnGuardarPedido = document.getElementById('btnGuardarPedido');
    const modal = document.getElementById('modalPedido');

    btnAgregarPedido.onclick = function() {
        document.getElementById('modalPedidoTitulo').textContent = 'Agregar Pedido';
        modal.style.display = 'flex';
    };
    if (btnCerrarModalPedido) btnCerrarModalPedido.onclick = function() { modal.style.display = 'none'; };
    if (btnCancelarModalPedido) btnCancelarModalPedido.onclick = function() { modal.style.display = 'none'; };
    if (btnAgregarProductoPedido) btnAgregarProductoPedido.onclick = agregarProductoAlPedido;
    if (btnGuardarPedido) btnGuardarPedido.onclick = guardarPedido;

    // Cerrar modal al hacer clic fuera
    modal.onclick = function(e) { if (e.target === modal) modal.style.display = 'none'; };

    // Validación de Configuración del Viaje (dejar siempre habilitado el botón)
    function validarConfiguracionViajeCompleta() {
        btnAgregarPedido.disabled = false;
        const bloqueoMsg = document.getElementById('bloqueoCargaMsg');
        if (bloqueoMsg) bloqueoMsg.style.display = 'none';
    }
    document.getElementById('ruta').addEventListener('change', validarConfiguracionViajeCompleta);
    document.getElementById('tipoCamionSeleccionado').addEventListener('change', validarConfiguracionViajeCompleta);
    document.getElementById('fechaDespacho').addEventListener('change', validarConfiguracionViajeCompleta);
    validarConfiguracionViajeCompleta();

    renderPedidosResumen();
    renderOcupacionVisual();
});

