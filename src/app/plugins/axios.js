import axios from 'axios';


export const api_url = 'http://convinced-haley-proyecto-meteorito-backend-32172d35.koyeb.app/';

// Crea la instancia de axios
export const axiosIns = axios.create({
    baseURL: api_url,
});

