import { useEffect, useState } from "react";
import { adminAPI } from "../../api/adminAPI";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload";

function EditGroup() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const secretKey = "MySuperSecretKey1234567890";

    
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const res = await adminAPI.get(`/edit_group/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                    },
                });

                const decrypted = DecryptResponse(res.data, secretKey);

                if (decrypted.success) {
                    const group = decrypted.data;
                    setName(group.group_name);
                    setDescription(group.group_description);
                    setStatus(group.status);
                } else {
                    toast.error("Failed to load group");
                    navigate("/admin/groups_list");
                }

            } catch (err) {
                toast.error("Something went wrong");
                navigate("/admin/groups_list");
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [id, navigate]);

   
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

            const encryptedData = EncryptPayload(payload, secretKey);

            const res = await adminAPI.put(`/update_group/${id}`, encryptedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });

            const decrypted = DecryptResponse(res.data, secretKey);

            if (decrypted.success) {
                toast.success("Group Updated successfully!");
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

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div className="card shadow-sm">
           

            <div className="card-header bg-primary text-white">
                Edit Group
            </div>

            <div className="card-body">
                <form onSubmit={handleGroup}>
                    <div className="row mt-3">

                        <div className="col-md-4">
                            <label>Group Name *</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-4">
                            <label>Group Description *</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-4">
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

                        <div className="col-md-12 mt-4">
                            <button
                                type="submit"
                                className="btn btn-success"
                            >
                                Update
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditGroup;