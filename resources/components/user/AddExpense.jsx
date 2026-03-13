import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userAPI } from "../../api/userAPI";
import { useNavigate } from "react-router-dom";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload";

function AddExpense() {
    const navigate = useNavigate();

    const [groupMaster, setGroupMaster] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    // ✅ Initialize expense state
    const [expense, setExpense] = useState({
        expense_name: "",
        group_id: "",
        expense_description: "",
        amount: "",
        status: "ACTIVE",
    });

    const secretKey = "MySuperSecretKey1234567890";

    const handleChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await userAPI.get("user/group_master", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
                    },
                });
                const decrypted = DecryptResponse(res.data, secretKey);

                if (decrypted.success) {
                    setGroupMaster(decrypted.data);
                } else {
                    toast.error(decrypted.message || "Something went wrong");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load groups");
            }
        };

        fetchGroups();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const encryptedData = EncryptPayload(expense, secretKey);

    const formData = new FormData();
    formData.append("payload", encryptedData.payload);
    formData.append("signature", encryptedData.signature);

    if (file) {
      formData.append("upload_expense_doc", file);
    }

    const res = await userAPI.post("/user/add-expense", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const decrypted = DecryptResponse(res.data, secretKey);

    if (decrypted.success) {
      toast.success("Expense added successfully!");
      navigate("/user/expense-list");
    } else {
      toast.error(decrypted.message || "Something went wrong");
    }
  } catch (error) {
    toast.error("Something went wrong!");
  } finally {
    setLoading(false);
  }
};


    return (
        <div className="card card-shadow m-2">
            <div className="card-header title">
                <h5>Add New Expense</h5>
            </div>

            <div className="card-body">
                <div className="row">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <label htmlFor="expense_name" className="form-label">
                                    Expense Name <span className="text-danger">*</span>
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
                                    value={expense.group_id}
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

                            <div className="col-md-4">
                                <label htmlFor="expense_description" className="form-label">
                                    Expense Description <span className="text-danger">*</span>
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
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label htmlFor="amount" className="form-label">
                                    Amount <span className="text-danger">*</span>
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
                            <div className="col-md-4">
                                <label htmlFor="upload_expense_doc" className="form-label">
                                    Upload Document (PDF/Image)
                                </label>
                                <input
                                    type="file"
                                    name="upload_expense_doc"
                                    id="upload_expense_doc"
                                    className="form-control"
                                    accept=".pdf,image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="status" className="form-label">
                                    Status <span className="text-danger">*</span>
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
                                    <option value="INACTIVE">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary text-center"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Add Expense"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddExpense;
