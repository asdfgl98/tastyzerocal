import axios from "axios";

export const dbAxios = axios.create({
    baseURL: process.env.DB_SERVER_ORIGIN,
    withCredentials: true
})