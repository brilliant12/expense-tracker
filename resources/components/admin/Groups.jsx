import { adminAPI } from "../../api/adminAPI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload";

function Groups() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    const handleGroup = async (e) => {
        e.preventDefault();

        if (!name || !description || !status) {
            toast.error("All fields are required");
            return;
        }

        try {
            const payload = {
                group_name: name,
                group_description: description,
                status: status,
            };

            const secretKey = "MySuperSecretKey1234567890";

            const encryptedData = EncryptPayload(payload, secretKey);

            const res = await adminAPI.post("/group", encryptedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });

            const decrypted = DecryptResponse(res.data, secretKey);

            if (decrypted.success) {
                toast.success("Group Added successfully!");

                setTimeout(() => {
                    navigate("/admin/groups_list");
                }, 1000);
            } else {
                toast.error(decrypted.message || "Something went wrong");
            }

        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="card shadow-sm">
            

            <div className="card-header bg-primary text-white">
                Add Groups
            </div>

            <div className="card-body">
                <form onSubmit={handleGroup}>
                    <div className="row mt-3">

                        <div className="col-md-3">
                            <label>Group Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label>Group Description *</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label>Select Status *</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>

                        <div className="col-md-3 mt-4">
                            <button
                                type="submit"
                                className="btn btn-success rounded"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Groups;