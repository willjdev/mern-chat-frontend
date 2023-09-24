import axios from 'axios';

const variable = import.meta.env.VITE_API_BASE_URL;

export const registerApi = axios.create({
    baseURL: variable,
    withCredentials: true
});

