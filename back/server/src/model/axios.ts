import axios from "axios";
console.log(process.env.DB_SERVER_ORIGIN)
export const dbAxios = axios.create({
    baseURL: process.env.DB_SERVER_ORIGIN,
    withCredentials: true
})