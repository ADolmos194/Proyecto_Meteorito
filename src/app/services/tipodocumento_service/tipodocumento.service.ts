import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    tipodocumento: "app/tipodocumento/",
};

@Injectable({
    providedIn: 'root',
})
export class TipoDocumentoService {
    async getTipoDocumento() {
        try {
            const response = await axiosIns.get(`${url}/${endpoints.tipodocumento}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener los tipos de documentos:', error);
            throw error;
        }
    }
}
