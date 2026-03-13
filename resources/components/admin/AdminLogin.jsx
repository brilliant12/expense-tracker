import { useState } from "react";
import { adminAPI } from "../../api/adminAPI.js";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AdminAuthContext.jsx";
function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
     const { setToken, setAdmin } = useContext(AuthContext);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const secretKey = "MySuperSecretKey1234567890";

            // Encrypt request
            const encryptedData = EncryptPayload(
                { email, password },
                secretKey,
            );
            const res = await adminAPI.post("/login", encryptedData);
            const decrypted = DecryptResponse(res.data, secretKey);

            if (decrypted.success) {
                console.log(decrypted);
                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 100);

                toast.success("Login successful!");
                setToken(decrypted.data.token);
                setAdmin(decrypted.data.user);

            } else {
                toast.error(decrypted.message || "something went wrong");
            }
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            {/* Toast container */}

            <div
                className="card shadow-sm p-4 rounded"
                style={{ maxWidth: 400, width: "100%" }}
            >
                <h2 className="text-center text-success mb-4">Admin Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-success btn-lg rounded"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
