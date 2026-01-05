// Lógica para el nuevo modal de pedido
document.addEventListener('DOMContentLoaded', function() {
  const btnShow = document.createElement('button');
  btnShow.textContent = 'Agregar Pedido';
  btnShow.className = 'btn btn-primary mb-3';
  btnShow.style.marginBottom = '16px';
  const alerta = document.getElementById('alertaCapacidad');
  if (alerta && alerta.parentNode) {
    alerta.parentNode.insertBefore(btnShow, alerta.nextSibling);
  }

  const modal = document.getElementById('nuevoModalPedido');
  const cancelar = document.getElementById('nuevoPedidoCancelar');
  const guardar = document.getElementById('nuevoPedidoGuardar');

  btnShow.onclick = () => { modal.style.display = 'flex'; };
  cancelar.onclick = () => { modal.style.display = 'none'; };
  guardar.onclick = () => {
    const cliente = document.getElementById('nuevoPedidoCliente').value.trim();
    const numero = document.getElementById('nuevoPedidoNumero').value.trim();
    const producto = document.getElementById('nuevoPedidoProducto').value.trim();
    const cantidad = parseInt(document.getElementById('nuevoPedidoCantidad').value);
    if (!cliente || !numero || !producto || !cantidad) {
      alert('Completa todos los campos');
      return;
    }
    // Aquí puedes hacer lo que quieras con los datos (mostrar, guardar, etc)
    alert('Pedido guardado:\nCliente: '+cliente+'\nPedido: '+numero+'\nProducto: '+producto+'\nCantidad: '+cantidad);
    modal.style.display = 'none';
  };
  // Cerrar modal al hacer clic fuera
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
});