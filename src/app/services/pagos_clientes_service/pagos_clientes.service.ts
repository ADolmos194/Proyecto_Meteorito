import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    pagosclientes: "registros/pagosclientes/",
    crearPagosClientes: "registros/pagosclientes/crear/",
    actualizarPagosClientes: (id: number) => `registros/pagosclientes/actualizar/${id}/`,
    eliminarPagosClientes: (id: number) => `registros/pagosclientes/eliminar/${id}/`,
};

@Injectable({
    providedIn: 'root',
})
export class PagosClientesService {
    async getPagosClientes() {
        try {
            const response = await axiosIns.get(`${url}${endpoints.pagosclientes}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener los pagos de los clientes:', error);
            throw error;
        }
    }
    async createPagosClientes(data: any) {
        try {
            const response = await axiosIns.post(`${url}${endpoints.crearPagosClientes}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear el pago del cliente:', error);
            throw error;
        }
    }
    async updatePagosClientes(id: number, data: any) {
        try {
            const response = await axiosIns.put(`${url}${endpoints.actualizarPagosClientes(id)}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el pago del cliente:', error);
            throw error;
        }
    }

    async deletePagosClientes(id: number) {
        try {
            const response = await axiosIns.delete(`${url}${endpoints.eliminarPagosClientes(id)}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar el pago del cliente:', error);
            throw error;
        }
    }
}
