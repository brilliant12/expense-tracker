import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userAPI } from "../../api/userAPI";
import { DecryptResponse } from "../../js/EncryptPayload";
import { Spinner } from "react-bootstrap";

function ExpenseDetail() {
    const { id } = useParams();
    const [expense, setExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenseDetail = async () => {
            try {
                const res = await userAPI.get(`/user/expense-detail/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                    },
                });

                const decryptedData = DecryptResponse(
                    res.data,
                    "MySuperSecretKey1234567890",
                );
                if (decryptedData) {
                    setExpense(decryptedData.data);
                } else {
                    toast.error("Failed to load expense details.");
                }
            } catch (error) {
                toast.error("Something went wrong!");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenseDetail();
    }, [id]);

    const handleEdit = () => {
        navigate(`/user/edit-expense/${id}`);
    };

    return (
        <div className="container">
            <div className="card card-shadow m-4 expense-detail-card">
                <div className="card-body">
                    <h5 className="title mb-4">Expense Details</h5>

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" role="status" />
                            <span className="ms-2">Loading...</span>
                        </div>
                    ) : expense ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <tbody>
                                    <tr>
                                        <th>Expense Name</th>
                                        <td>{expense.expense_name}</td>
                                        <th>Group Name</th>
                                        <td>{expense.group?.group_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Description</th>
                                        <td colSpan="3">
                                            {expense.expense_description}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Amount</th>
                                        <td>₹{expense.amount}</td>
                                        <th>Status</th>
                                        <td>
                                            <span
                                                className={`badge bg-${
                                                    expense.status === "ACTIVE"
                                                        ? "success"
                                                        : "danger"
                                                }`}
                                            >
                                                {expense.status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>User Name</th>
                                        <td>{expense.user?.name}</td>
                                        {/* <th>User ID</th>
                                        <td>{expense.user?.id}</td> */}
                                    </tr>
                                    <tr>
                                        <th>Created At</th>
                                        <td>{expense.created_at}</td>
                                        <th>Updated At</th>
                                        <td>{expense.updated_at}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="text-center mt-4">
                                <button
                                    onClick={handleEdit}
                                    className="btn btn-primary"
                                >
                                    Edit Expense
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Expense not found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExpenseDetail;
