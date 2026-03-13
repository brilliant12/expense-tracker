import { useState } from "react";
import { userAPI } from "../../api/userAPI.js";
import toast, { Toaster } from 'react-hot-toast';
import { EncryptPayload,DecryptResponse } from "../../js/EncryptPayload.js";
function Registraion() {
     const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
     const [cpassword, setCpassword] = useState("");

  const handleRegistration = async (e) => {
  e.preventDefault();
  try {
    const formData = {
      name,
      email,
      password,
      password_confirmation: cpassword,
    };

    const secretKey = "MySuperSecretKey1234567890";

    // Encrypt request
    const encryptedData = EncryptPayload(formData, secretKey);


 
    const res = await userAPI.post("/register", encryptedData);
  
    const decrypted = DecryptResponse(res.data, secretKey);
  


   
    if(decrypted.success){
        toast.success(decrypted.message || "Registration successful!");
         localStorage.setItem("user_token", decrypted.user?.token ?? decrypted.token);
    }
    else{
      toast.error(decrypted.message||'something went wrong');
    }
   
  } catch (err) {
    if (err.response?.data) {
      try {
        const decryptedErr = DecryptResponse(err.response.data, secretKey);
        console.log(decryptedErr);
        toast.error(decryptedErr.message || "Something went wrong");
      } catch {
        toast.error(err.response.data.message || "Something went wrong");
      }
    } else {
      toast.error(err.message);
    }
  }
};



    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            {/* Toast container */}
           

            <div className="card shadow-sm p-4 rounded" style={{ maxWidth: 400, width: "100%" }}>
                <h2 className="text-center text-success mb-4">User Registration</h2>

                <form onSubmit={handleRegistration}>
                      <div className="mb-3">
                        <label className="form-label">User Name</label>
                        <input
                            type="text"
                            placeholder="Enter your Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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

                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="form-control"
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-success btn-lg rounded">
                            Registration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Registraion;
