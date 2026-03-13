import { useEffect, useState } from "react";
import { adminAPI } from "../../api/adminAPI";
import { DecryptResponse } from "../../js/EncryptPayload";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const secretKey = "MySuperSecretKey1234567890";

    const fetchGroups = async () => {
        try {
            const res = await adminAPI.get("/groups", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });

            const decrypted = DecryptResponse(res.data, secretKey);

            if (decrypted.success) {
                setGroups(decrypted.data);
            } else {
                toast.error(decrypted.message || "Failed to fetch groups");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                    err.message ||
                    "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between">
                <span>Group List</span>
                <button
                    className="btn btn-light btn-sm"
                    onClick={() => navigate("/admin/groups")}
                >
                    + Add Group
                </button>
            </div>

            <div className="card-body">
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : groups.length === 0 ? (
                    <div className="text-center text-muted">
                        No groups found
                    </div>
                ) : (
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Group Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groups.map((group, index) => (
                                <tr key={group.id}>
                                    <td>{index + 1}</td>
                                    <td>{group.group_name}</td>
                                    <td>{group.group_description}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                group.status === "ACTIVE"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                            }`}
                                        >
                                            {group.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() =>
                                                navigate(
                                                    `/admin/edit_group/${group.id}`,
                                                )
                                            }
                                        >
                                            <i className="fa fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default GroupList;
