/**
 * Modelo de Camión
 * Gestiona los datos y lógica de negocio de los tipos de camiones
 */

class CamionModel {
    constructor() {
        this.tiposCamion = [
            { capacidad: 25, nombre: "Camión 25 m³", eficiencia: 0.80 },
            { capacidad: 37, nombre: "Camión 37 m³", eficiencia: 0.80 },
            { capacidad: 45, nombre: "Camión 45 m³", eficiencia: 0.80 }
        ];
    }

    /**
     * Obtiene todos los tipos de camiones disponibles
     */
    obtenerTipos() {
        return this.tiposCamion;
    }

    /**
     * Obtiene un camión por su capacidad
     */
    obtenerPorCapacidad(capacidad) {
        return this.tiposCamion.find(c => c.capacidad === capacidad);
    }

    /**
     * Calcula la capacidad real considerando la eficiencia
     */
    calcularCapacidadReal(capacidad) {
        const camion = this.obtenerPorCapacidad(capacidad);
        if (!camion) {
            throw new Error('Tipo de camión no encontrado');
        }

        return camion.capacidad * camion.eficiencia;
    }

    /**
     * Calcula el porcentaje de ocupación
     */
    calcularOcupacion(capacidad, volumenTotal) {
        const capacidadReal = this.calcularCapacidadReal(capacidad);
        return (volumenTotal / capacidadReal * 100);
    }

    /**
     * Verifica si el volumen cabe en el camión
     */
    verificarCapacidad(capacidad, volumenTotal) {
        const capacidadReal = this.calcularCapacidadReal(capacidad);
        return volumenTotal <= capacidadReal;
    }

    /**
     * Selecciona el camión óptimo para un volumen dado
     */
    seleccionarCamionOptimo(volumenTotal) {
        for (let i = 0; i < this.tiposCamion.length; i++) {
            const camion = this.tiposCamion[i];
            const capacidadReal = camion.capacidad * camion.eficiencia;
            
            if (volumenTotal <= capacidadReal) {
                return camion;
            }
        }

        // Si ninguno alcanza, devolver el más grande
        return this.tiposCamion[this.tiposCamion.length - 1];
    }
}
