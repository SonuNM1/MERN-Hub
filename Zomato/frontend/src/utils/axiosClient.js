import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,  // send cookies if needed
})

// Request Interceptor - runs BEFORE every request. Purpose: attach token to headers 

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") ;

        if(token){
            config.headers.Authorization = `Bearer ${token}` ;
        }

        return config; 
    }, 
    (error) => Promise.reject(error)
)

// Response Interceptor - runs AFTER every response. Purpose: helps catch errors globally 

axiosClient.interceptors.response.use(
    (response) => response, 
    (error) => {
        console.error("API Error: ", error.response?.data) ; 

        return Promise.reject(error) ;
    }
)

export default axiosClient ;