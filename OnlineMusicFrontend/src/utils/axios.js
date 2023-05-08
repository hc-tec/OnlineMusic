// 建立的axios实例
import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', 
    timeout: 15000
})

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        config.headers.Authorization = `Bearer ${token}`
        return config
    }, 
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    response => {
        console.log(response);
        return response
    }, 
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)

export default axiosInstance