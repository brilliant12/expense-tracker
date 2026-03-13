import React, { useEffect, useState } from "react";
import { adminAPI } from "../../api/adminAPI";
import { DecryptResponse } from "../../js/EncryptPayload";

import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

function GroupWiseUser() {
    const { id } = useParams(); // ✅ call useParams at top level
    const [groupWiseUser, setGroupWiseUser] = useState([]);
    const secretKey = "MySuperSecretKey1234567890";
    const navigate = useNavigate();

    const fetchGroupWiseUser = async () => {
        try {
            const result = await adminAPI.get(`group_wise_users_list/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
                },
            });
            const decrypted = DecryptResponse(result.data, secretKey);
            console.log(decrypted.data);
            if (decrypted.success) {
                setGroupWiseUser(decrypted.data);
            } else {
                toast.error(decrypted.message || "Failed to fetch users");
            }
        } catch (error) {
            toast.error("Something went wrong while fetching users");
        }
    };

    useEffect(() => {
        fetchGroupWiseUser();
    }, [id]);

    // Define table columns
    const columns = [
        {
            name: "Group Name",
            selector: (row) => row.group_name,
            sortable: true,
        },
        {
            name: "User Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
    ];

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                    <span>Group Wise User List</span>
                    <button
                        className="btn btn-light btn-sm"
                        onClick={() => navigate(-1)} // ✅ back button
                    >
                        Back
                    </button>
                </div>
                <div className="card-body">
                    <DataTable
                        columns={columns}
                        data={groupWiseUser}
                        pagination
         
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={(newPerPage, page) => {
            setRowsPerPage(newPerPage);
            setCurrentPage(page);
          }}
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
          }} />
                </div>
            </div>
        </div>
    );
}

export default GroupWiseUser;
