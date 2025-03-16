import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    tesis: "registros/tesis/",
    crearTesis: "registros/tesis/crear/",
    actualizarTesis: (id: number) => `registros/tesis/actualizar/${id}/`,
    eliminarTesis: (id: number) => `registros/tesis/eliminar/${id}/`,
};

@Injectable({
    providedIn: 'root',
})
export class TesisService {
    async getTesis() {
        try {
            const response = await axiosIns.get(`${url}${endpoints.tesis}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener las tesis:', error);
            throw error;
        }
    }
    async createTesis(data : any) {
        try {
            const response = await axiosIns.post(`${url}${endpoints.crearTesis}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear la tesis:', error);
            throw error;
        }
    }
    async updateTesis(id:number, data: any) {
        try {
            const response = await axiosIns.put(`${url}${endpoints.actualizarTesis(id)}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la tesis:', error);
            throw error;
        }
    }

    async deleteTesis(id:number) {
        try {
            const response = await axiosIns.delete(`${url}${endpoints.eliminarTesis(id)}`);
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la tesis:', error);
            throw error;
        }
    }

}
