import React, { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { adminAPI } from "../../api/adminAPI";
import { useNavigate } from "react-router-dom";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload";
import DataTable from "react-data-table-component";

function UserGroupMapping() {
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupWiseUsers, setGroupWiseUsers] = useState([]);

    const navigate = useNavigate();
    const secretKey = "MySuperSecretKey1234567890";

    useEffect(() => {
        fetchData();
        fetchGroupWiseUser();
    }, []);

    const fetchGroupWiseUser = async () => {
        try {
            const result = await adminAPI.get("group_wise_users_count", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });
            const decrypted = DecryptResponse(result.data, secretKey);
            if (decrypted.success) {
                setGroupWiseUsers(decrypted.data);
            } else {
                toast.error(decrypted.message || "Failed to fetch groups");
            }
        } catch (error) {
            toast.error("Something went wrong while fetching group users");
        }
    };

    const fetchData = async () => {
        try {
            const res = await adminAPI.get("/user_group_create/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });
            const decrypted = DecryptResponse(res.data, secretKey);
            if (decrypted.success) {
                setUsers(decrypted.users);
                setGroups(decrypted.groups);
            }
        } catch (error) {
            toast.error("Failed to load data");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGroup) {
            toast.error("Please select group");
            return;
        }
        if (selectedUsers.length === 0) {
            toast.error("Please select users");
            return;
        }

        const payload = {
            group_id: selectedGroup.value,
            user_ids: selectedUsers.map((user) => user.value),
        };
        const EncryptedData = EncryptPayload(payload, secretKey);

        try {
            const res = await adminAPI.post("/user_group_store", EncryptedData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });

            const decryptedData = DecryptResponse(res.data, secretKey);
            if (decryptedData.success) {
                toast.success("Users assigned successfully");
                setSelectedGroup(null);
                setSelectedUsers([]);
                fetchGroupWiseUser(); // refresh table
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    // Define DataTable columns
    const columns = [
        {
            name: "Group Name",
            selector: (row) => row.group_name,
            sortable: true,
        },
        {
            name: "Total Users",
            selector: (row) => row.total,
            sortable: true,
            cell: (row) => (
                <span
                    className="badge bg-info"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/admin/group_wise_users_list/${row.id}`)}
                >
                    {row.total}
                </span>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            {/* Assign Users Form */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    Assign Users To Group
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Group</label>
                                <Select
                                    options={groups.map((group) => ({
                                        value: group.id,
                                        label: group.group_name,
                                    }))}
                                    value={selectedGroup}
                                    onChange={setSelectedGroup}
                                    placeholder="Select Group"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>Select Users</label>
                                <Select
                                    isMulti
                                    options={users.map((user) => ({
                                        value: user.id,
                                        label: user.name,
                                    }))}
                                    value={selectedUsers}
                                    onChange={setSelectedUsers}
                                    placeholder="Select Users"
                                />
                            </div>
                            <div className="col-md-2 mt-4">
                                <button type="submit" className="btn btn-success w-100">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Group Wise Users Table */}
            {groupWiseUsers.length > 0 && (
                <div className="card shadow-sm mt-4">
                    <div className="card-header bg-secondary text-white">
                        Group Wise Users Assigned
                    </div>
                    <div className="card-body">
                        <DataTable
                            columns={columns}
                            data={groupWiseUsers}
                            pagination
                              highlightOnHover
          responsive
          striped
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                backgroundColor: "#f8f9fa",
              },
            },
          }}
                            noDataComponent="No groups found"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserGroupMapping;
