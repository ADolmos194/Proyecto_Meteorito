import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    pagosclientes: "registros/pagosclientes/",
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
}
