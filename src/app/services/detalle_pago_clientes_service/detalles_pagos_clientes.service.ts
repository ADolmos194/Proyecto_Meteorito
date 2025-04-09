import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    /*  detallespagosclientes: "registros/detallespagosclientes/",*/
    crearDetallesPagosClientes: "registros/detallespagosclientes/crear/",
    actualizarDetallesPagosClientes: (id: number) => `registros/detallespagosclientes/actualizar/${id}/`,
    eliminarDetallesPagosClientes: (id: number) => `registros/detallespagosclientes/eliminar/${id}/`,
};

@Injectable({
    providedIn: 'root',
})
export class DetallesPagosClientesService {

    async createDetallesPagosClientes(data: any) {
        try {
            const response = await axiosIns.post(`${url}${endpoints.crearDetallesPagosClientes}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear el detalle de pago del cliente:', error);
            throw error;
        }
    }
    async updateDetallesPagosClientes(id: number, data: any) {
        try {
            const response = await axiosIns.put(`${url}${endpoints.actualizarDetallesPagosClientes(id)}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el detalle de pago del cliente:', error);
            throw error;
        }
    }

    async deleteDetallesPagosClientes(id: number) {
        try {
            const response = await axiosIns.delete(`${url}${endpoints.eliminarDetallesPagosClientes(id)}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el detalle de pago del cliente:', error);
            throw error;
        }
    }
}
