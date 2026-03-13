import { useState } from 'react';
import { adminAPI } from '../../api/adminAPI';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await adminAPI.post('/login', { email, password });
            localStorage.setItem('admin_token', res.data.token); // store user token
            setMessage('Login successful!');
        } catch (err) {
            setMessage('Login failed');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">User Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
            </form>
            <p className="mt-3 text-red-500">{message}</p>
        </div>
    );
}

export default Login;
