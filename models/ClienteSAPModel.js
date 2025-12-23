/**
 * Modelo de Cliente SAP
 * Simula datos que vendrán desde SAP
 * Un cliente puede tener múltiples pedidos y ubicaciones
 */

class ClienteSAPModel {
    constructor() {
        // Datos de ejemplo que simularían venir desde SAP
        this.clientesEjemplo = [
            {
                codigoSAP: 'CLI-001',
                nombreCliente: 'Alkosto S.A.',
                nit: '900123456-1',
                ubicaciones: [
                    { 
                        codigo: 'UBI-001-A', 
                        nombre: 'Alkosto Soacha', 
                        direccion: 'Autopista Sur Km 8', 
                        ciudad: 'Soacha',
                        coordenadas: { lat: 4.5772, lng: -74.2166 }
                    },
                    { 
                        codigo: 'UBI-001-B', 
                        nombre: 'Alkosto Calle 80', 
                        direccion: 'Calle 80 # 69B-52', 
                        ciudad: 'Bogotá',
                        coordenadas: { lat: 4.7110, lng: -74.0721 }
                    }
                ],
                pedidos: [
                    {
                        numeroPedido: 'PED-2025-001',
                        fecha: '2025-12-19',
                        ubicacionEntrega: 'UBI-001-A', // Referencia a ubicaciones
                        ordenCompra: 'OC-45678',
                        estado: 'Pendiente',
                        productos: [
                            {
                                codigoSAP: 'PROD-001',
                                nombre: 'COL MONARCA 100X190X28 JAC',
                                cantidad: 20,
                                volumenUnitario: 0.532, // 1.00 x 1.90 x 0.28 m
                                pesoUnitario: 18.5,
                                precioUnitario: 350000
                            },
                            {
                                codigoSAP: 'PROD-002',
                                nombre: 'COL CONFORT PREMIUM 140X190X34 NUBE 4.0',
                                cantidad: 15,
                                volumenUnitario: 0.904, // 1.40 x 1.90 x 0.34 m
                                pesoUnitario: 25.0,
                                precioUnitario: 580000
                            }
                        ]
                    },
                    {
                        numeroPedido: 'PED-2025-002',
                        fecha: '2025-12-19',
                        ubicacionEntrega: 'UBI-001-B',
                        ordenCompra: 'OC-45679',
                        estado: 'Pendiente',
                        productos: [
                            {
                                codigoSAP: 'PROD-003',
                                nombre: 'LAM UT 200,0x200,0x004,0',
                                cantidad: 50,
                                volumenUnitario: 0.160, // 2.00 x 2.00 x 0.04 m
                                pesoUnitario: 12.8,
                                precioUnitario: 85000
                            }
                        ]
                    }
                ]
            },
            {
                codigoSAP: 'CLI-002',
                nombreCliente: 'Homecenter S.A.S.',
                nit: '900234567-2',
                ubicaciones: [
                    { 
                        codigo: 'UBI-002-A', 
                        nombre: 'Homecenter Fontibón', 
                        direccion: 'Av. Centenario # 42-35', 
                        ciudad: 'Bogotá',
                        coordenadas: { lat: 4.6901, lng: -74.1403 }
                    },
                    { 
                        codigo: 'UBI-002-B', 
                        nombre: 'Homecenter Autopista Norte', 
                        direccion: 'Autopista Norte Km 18', 
                        ciudad: 'Bogotá',
                        coordenadas: { lat: 4.7512, lng: -74.0365 }
                    }
                ],
                pedidos: [
                    {
                        numeroPedido: 'PED-2025-003',
                        fecha: '2025-12-19',
                        ubicacionEntrega: 'UBI-002-A',
                        ordenCompra: 'OC-78901',
                        estado: 'Pendiente',
                        productos: [
                            {
                                codigoSAP: 'PROD-004',
                                nombre: 'COL BASE CAMA SEMIDOBLE 120X190',
                                cantidad: 25,
                                volumenUnitario: 0.456, // 1.20 x 1.90 x 0.20 m
                                pesoUnitario: 22.0,
                                precioUnitario: 420000
                            },
                            {
                                codigoSAP: 'PROD-005',
                                nombre: 'COL ORTOPEDICO DOBLE 140X190X25',
                                cantidad: 18,
                                volumenUnitario: 0.665, // 1.40 x 1.90 x 0.25 m
                                pesoUnitario: 20.5,
                                precioUnitario: 485000
                            }
                        ]
                    }
                ]
            },
            {
                codigoSAP: 'CLI-003',
                nombreCliente: 'Colchones El Dorado',
                nit: '900345678-3',
                ubicaciones: [
                    { 
                        codigo: 'UBI-003-A', 
                        nombre: 'El Dorado Américas', 
                        direccion: 'Av. Américas # 68-55', 
                        ciudad: 'Bogotá',
                        coordenadas: { lat: 4.6583, lng: -74.1057 }
                    }
                ],
                pedidos: [
                    {
                        numeroPedido: 'PED-2025-004',
                        fecha: '2025-12-19',
                        ubicacionEntrega: 'UBI-003-A',
                        ordenCompra: 'OC-11223',
                        estado: 'Pendiente',
                        productos: [
                            {
                                codigoSAP: 'PROD-006',
                                nombre: 'COL MONARCA 100X190X28 JAC',
                                cantidad: 30,
                                volumenUnitario: 0.532,
                                pesoUnitario: 18.5,
                                precioUnitario: 350000
                            },
                            {
                                codigoSAP: 'PROD-007',
                                nombre: 'LAM UT 200,0x200,0x004,0',
                                cantidad: 40,
                                volumenUnitario: 0.160,
                                pesoUnitario: 12.8,
                                precioUnitario: 85000
                            }
                        ]
                    },
                    {
                        numeroPedido: 'PED-2025-005',
                        fecha: '2025-12-20',
                        ubicacionEntrega: 'UBI-003-A',
                        ordenCompra: 'OC-11224',
                        estado: 'Pendiente',
                        productos: [
                            {
                                codigoSAP: 'PROD-008',
                                nombre: 'COL CONFORT PREMIUM 140X190X34 NUBE 4.0',
                                cantidad: 12,
                                volumenUnitario: 0.904,
                                pesoUnitario: 25.0,
                                precioUnitario: 580000
                            }
                        ]
                    }
                ]
            }
        ];
    }

    /**
     * Obtiene todos los clientes (simula llamada a SAP)
     */
    async obtenerClientes() {
        // Simula delay de red
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`📦 SAP: ${this.clientesEjemplo.length} clientes obtenidos`);
                resolve(this.clientesEjemplo);
            }, 100);
        });
    }

    /**
     * Busca clientes por nombre o código
     */
    async buscarClientes(termino) {
        const clientes = await this.obtenerClientes();
        const terminoLower = termino.toLowerCase();
        
        return clientes.filter(c => 
            c.nombreCliente.toLowerCase().includes(terminoLower) ||
            c.codigoSAP.toLowerCase().includes(terminoLower) ||
            c.nit.includes(termino)
        );
    }

    /**
     * Obtiene un cliente específico por código SAP
     */
    async obtenerClientePorCodigo(codigoSAP) {
        const clientes = await this.obtenerClientes();
        return clientes.find(c => c.codigoSAP === codigoSAP);
    }

    /**
     * Obtiene pedidos de un cliente
     */
    async obtenerPedidosCliente(codigoSAP) {
        const cliente = await this.obtenerClientePorCodigo(codigoSAP);
        return cliente ? cliente.pedidos : [];
    }

    /**
     * Obtiene ubicaciones de un cliente
     */
    async obtenerUbicacionesCliente(codigoSAP) {
        const cliente = await this.obtenerClientePorCodigo(codigoSAP);
        return cliente ? cliente.ubicaciones : [];
    }

    /**
     * Obtiene un pedido específico
     */
    async obtenerPedido(numeroPedido) {
        const clientes = await this.obtenerClientes();
        
        for (const cliente of clientes) {
            const pedido = cliente.pedidos.find(p => p.numeroPedido === numeroPedido);
            if (pedido) {
                return {
                    ...pedido,
                    cliente: {
                        codigoSAP: cliente.codigoSAP,
                        nombreCliente: cliente.nombreCliente,
                        nit: cliente.nit
                    },
                    ubicacionData: cliente.ubicaciones.find(u => u.codigo === pedido.ubicacionEntrega)
                };
            }
        }
        
        return null;
    }

    /**
     * Calcula totales de un pedido
     */
    calcularTotalesPedido(pedido) {
        let volumenTotal = 0;
        let pesoTotal = 0;
        let valorTotal = 0;
        
        pedido.productos.forEach(prod => {
            volumenTotal += prod.volumenUnitario * prod.cantidad;
            pesoTotal += prod.pesoUnitario * prod.cantidad;
            valorTotal += prod.precioUnitario * prod.cantidad;
        });
        
        return {
            volumenTotal: volumenTotal.toFixed(3),
            pesoTotal: pesoTotal.toFixed(2),
            valorTotal,
            cantidadProductos: pedido.productos.length,
            cantidadItems: pedido.productos.reduce((sum, p) => sum + p.cantidad, 0)
        };
    }

    /**
     * Agrupa pedidos por ubicación (para optimizar rutas)
     */
    async agruparPedidosPorUbicacion(pedidos) {
        const grupos = {};
        
        for (const pedido of pedidos) {
            const pedidoCompleto = await this.obtenerPedido(pedido.numeroPedido || pedido);
            if (pedidoCompleto) {
                const ubicacion = pedidoCompleto.ubicacionEntrega;
                
                if (!grupos[ubicacion]) {
                    grupos[ubicacion] = {
                        ubicacion: pedidoCompleto.ubicacionData,
                        pedidos: []
                    };
                }
                
                grupos[ubicacion].pedidos.push(pedidoCompleto);
            }
        }
        
        return grupos;
    }
}

// Exportar para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClienteSAPModel;
}
