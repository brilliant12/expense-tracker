import axios from 'axios';

export const userAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Laravel backend URL
    headers: {
        Authorization: `Bearer ${localStorage.getItem('user_token')}`,
    },
});
