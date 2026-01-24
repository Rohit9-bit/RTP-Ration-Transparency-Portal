import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // Replace with your API base URL
    timeout: 10000, // Set a timeout limit
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if(error.response) {
            // Handle specific status codes
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized access
                    window.location.href = '/login';
                    break;
                case 403:
                    // Handle forbidden access
                    alert('You do not have permission to perform this action.');
                    break;
                case 500:
                    // Handle server errors
                    alert('A server error occurred. Please try again later.');
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }   
);

export default axiosInstance;