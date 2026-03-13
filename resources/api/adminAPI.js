import axios from 'axios';

export const adminAPI = axios.create({
    baseURL: 'http://localhost:8000/api/admin',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
    },
});
