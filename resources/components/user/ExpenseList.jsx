import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userAPI } from "../../api/userAPI";
import { DecryptResponse } from "../../js/EncryptPayload";
import { Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { BsFilePdf, BsFileImage, BsFileEarmark } from "react-icons/bs";

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#0d6efd", // Bootstrap primary blue
      color: "white",
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  rows: {
    style: {
      minHeight: "60px", // optional row height
    },
  },
};

function ExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await userAPI.get("/user/expense-list", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                    },
                });

                const decryptedData = DecryptResponse(
                    res.data,
                    "MySuperSecretKey1234567890",
                );
                console.log(decryptedData);
                if (decryptedData) {
                    setExpenses(decryptedData.data);
                } else {
                    toast.error("Failed to load expenses.");
                }
            } catch (error) {
                toast.error("Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const columns = [
        {
            'name':'S.No',
            selector:(row,key)=>(key+1)
        },
        {
            name: "Expense Name",
            selector: (row) => row.expense_name,
            sortable: true,
            wrap: true,
        },
        {
            name: "Amount",
            selector: (row) => row.amount,
            sortable: true,
            wrap: true,
        },
        {
            name: "Status",
            selector: (row) => (
                <span
                    className={
                        row.status === "ACTIVE"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                    }
                >
                    {row.status}
                </span>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: "Created At",
            selector: (row) => row.created_at_formatted || row.created_at,
            sortable: true,
            wrap: true,
        },
        {
            name: "Updated At",
            selector: (row) => row.updated_at_formatted || row.updated_at,
            sortable: true,
            wrap: true,
        },
        {
            name: "Document",
            selector: (row) => {
                if (!row.upload_expense_doc_url) {
                    return <span className="text-muted">No Doc</span>;
                }

                const ext = row.upload_expense_doc_url
                    .split(".")
                    .pop()
                    .toLowerCase();
                let icon;

                if (ext === "pdf") {
                    icon = <BsFilePdf className="text-danger" size={20} />;
                } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                    icon = <BsFileImage className="text-primary" size={20} />;
                } else {
                    icon = (
                        <BsFileEarmark className="text-secondary" size={20} />
                    );
                }

                return (
                    <a
                        href={row.upload_expense_doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Document"
                    >
                        {icon}
                    </a>
                );
            },
            wrap: true,
        },
    ];

    return (
        <div className="card card-shadow">
            <div className="card-header title">
                <h5>Expense List</h5>
            </div>

            <div className="card-body">
                <div className="row">
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" role="status" />
                            <span>Loading...</span>
                        </div>
                    ) : expenses.length === 0 ? (
                        <p>No expenses found</p>
                    ) : (
                        <div className="data-table-wrapper">
                            <DataTable
                                columns={columns}
                                data={expenses}
                                pagination
                                highlightOnHover
                                striped
                                responsive={true} // disable auto-resize so scroll works
                                customStyles={customStyles}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExpenseList;
