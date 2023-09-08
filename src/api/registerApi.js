import axios from 'axios';

const variable = 'http://localhost:4000'

export const registerApi = axios.create({
    baseURL: variable,
    withCredentials: true
});

