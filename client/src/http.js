import axios from "axios";

// Create an axios instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // Allows cookies to be sent with requests
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {

        return config;
    },
    function (error) {
        // Do something with the request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lies within the range of 2xx triggers this function
        return response;
    },
    function (error) {
        // Handle 401 (Unauthorized) or 403 (Forbidden) errors
        if (error.response.status === 401 || error.response.status === 403) {
            // Handle unauthorized access by redirecting to the login page or clearing user data
            window.location = "/login";
        }
        return Promise.reject(error);
    }
);

export default instance;