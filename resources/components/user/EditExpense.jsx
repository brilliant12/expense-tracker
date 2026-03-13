import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { userAPI } from "../../api/userAPI";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload";
import { Spinner } from "react-bootstrap"; // Importing Spinner for loading state

function EditExpense() {
    const { id } = useParams(); // Get the expense ID from the URL
    const navigate = useNavigate();
     const [groupMaster, setGroupMaster] = useState([]);
    // State for the expense form
    const [expense, setExpense] = useState({
        expense_name: "",
        group_id: "",
        expense_description: "",
        amount: "",
        status: "ACTIVE", // Default status as ACTIVE
    });

    const [loading, setLoading] = useState(true);
     const secretKey= "MySuperSecretKey1234567890";
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
                    setExpense(decryptedData.data); // Populate the form fields with current expense data
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

        useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await userAPI.get("user/group_master", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                    },
                });
                const decrypted = DecryptResponse(res.data, secretKey);
                    console.log(decrypted);
                if (decrypted.success) {
                    setGroupMaster(decrypted.data);
                } else {
                    toast.error(decrypted.message || "Something went wrong");
                }
            } catch (error) {
                toast.error("Failed to load groups");
            }
        };

        fetchGroups();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Encrypt the updated expense data before sending it to the API
            const encryptedData = EncryptPayload(
                expense,
                "MySuperSecretKey1234567890",
            );
            const res = await userAPI.put(
                `/user/edit-expense/${id}`,
                encryptedData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                    },
                },
            );
            const decryptedData = DecryptResponse(
                res.data,
                "MySuperSecretKey1234567890",
            );

            if (decryptedData.success) {
                toast.success("Expense updated successfully!");
                navigate("/user/expense-list"); // Redirect to expense list
            } else {
                toast.error(decryptedData.message);
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h3>Edit Expense</h3>
           

            <div className="card card-shadow m-4">
                <div className="card-body">
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" role="status" />
                            <span className="ms-2">Loading...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label
                                        htmlFor="expense_name"
                                        className="form-label"
                                    >
                                        Expense Name
                                    </label>
                                    <input
                                        type="text"
                                        name="expense_name"
                                        id="expense_name"
                                        className="form-control"
                                        value={expense.expense_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                   <div className="col-md-4">
                                <label htmlFor="group_id" className="form-label">
                                    Group <span className="text-danger">*</span>
                                </label>
                             <select
  name="group_id"
  id="group_id"
  className="form-control form-select"
  value={expense.group_id} // The selected value is controlled by this
  onChange={handleChange}
  required
>
  <option value="">Select</option>
  {groupMaster.map((item) => (
    <option key={item.id} value={item.id}>
      {item.group_name}
    </option>
  ))}
</select>
                            </div>

                                <div className="col-md-4 mb-3">
                                    <label
                                        htmlFor="expense_description"
                                        className="form-label"
                                    >
                                        Expense Description
                                    </label>
                                    <input
                                        type="text"
                                        name="expense_description"
                                        id="expense_description"
                                        className="form-control"
                                        value={expense.expense_description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>{" "}
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label
                                        htmlFor="amount"
                                        className="form-label"
                                    >
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="form-control"
                                        value={expense.amount}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label
                                        htmlFor="status"
                                        className="form-label"
                                    >
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        id="status"
                                        className="form-control"
                                        value={expense.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Update Expense"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditExpense;
