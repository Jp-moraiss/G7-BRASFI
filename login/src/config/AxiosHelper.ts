import axios from 'axios';

export const baseURL = "https://g7-brasfi.onrender.com"
export const httpClient = axios.create({
    baseURL: baseURL,
})