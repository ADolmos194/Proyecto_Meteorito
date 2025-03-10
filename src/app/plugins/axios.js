// @/plugins/axios.js
import axios from 'axios';

// URL base de la API
export const api_url = 'http://127.0.0.1:8080/';

// Crea la instancia de axios
export const axiosIns = axios.create({
    baseURL: api_url,
});
