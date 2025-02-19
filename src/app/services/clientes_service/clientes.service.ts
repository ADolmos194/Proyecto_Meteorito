import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    clientes: "registros/clientes/",
    crearclientes: "registros/clientes/crear/",
    actualizarclientes: (id: number) => `registros/clientes/actualizar/${id}/`,
    eliminarclientes: (id: number) => `registros/clientes/eliminar/${id}/`,
};

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    async getClientes() {
        try {
            const response = await axiosIns.get(`${url}/${endpoints.clientes}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener los clientes:', error);
            throw error;
        }
    }
    async createCliente(data : any) {
        try {
            const response = await axiosIns.post(`${url}/${endpoints.crearclientes}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear al cliente:', error);
            throw error;
        }
    }
    async updateCliente(id:number, data: any) {
        try {
            const response = await axiosIns.put(`${url}/${endpoints.actualizarclientes(id)}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar al cliente:', error);
            throw error;
        }
    }

    async deleteCliente(id:number) {
        try {
            const response = await axiosIns.delete(`${url}/${endpoints.eliminarclientes(id)}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar al cliente:', error);
            throw error;
        }
    }

}
