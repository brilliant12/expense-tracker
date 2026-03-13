import { useEffect, useState } from "react";
import { userAPI } from "../../api/userAPI";
import { DecryptResponse } from "../../js/EncryptPayload";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

import DataTable, { createTheme } from "react-data-table-component";

import {
    FaUser,
    FaReceipt,
    FaRegStickyNote,
    FaMoneyBillWave,
    FaUsers,
    FaCalendarAlt,
    FaChartBar,
} from "react-icons/fa";
createTheme("bootstrapTheme", {
    text: {
        primary: "#212529", // Bootstrap body text
        secondary: "#6c757d", // Bootstrap muted text
    },
    background: {
        default: "#ffffff", // White card background
    },
    context: {
        background: "#e9ecef", // Light gray for context rows
        text: "#212529",
    },
    divider: {
        default: "#dee2e6", // Bootstrap border color
    },
    button: {
        default: "#0d6efd", // Bootstrap primary
        hover: "#0b5ed7",
        focus: "#0a58ca",
        disabled: "#6c757d",
    },
    sortFocus: {
        default: "#0d6efd",
    },
    highlightOnHover: {
        default: "#f8f9fa", // Light hover
        text: "#212529",
    },
    striped: {
        default: "#f8f9fa", // Light gray stripes
        text: "#212529",
    },
});
const customStyles = {
    headCells: {
        style: {
            backgroundColor: "#0d6efd",// Bootstrap "success" green
            color: "white", // White text for contrast
            fontWeight: "600",
            fontSize: "0.95rem",
        },
    },
    rows: {
        style: {
            minHeight: "48px", // more breathing room
        },
    },
};

function GroupDetailWithEachExpense() {
    const [groupDetail, setGroupDetail] = useState(null);
    const [expenseList, setExpenseList] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [userTotals, setUserTotals] = useState({});
    const [searchText, setSearchText] = useState("");
    const secretKey = "MySuperSecretKey1234567890";
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("user_token");
                if (!token) {
                    toast.error("You are not logged in.");
                    return;
                }

                const res = await userAPI.get(
                    `/user/group_detail_with_each_expense/${id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    },
                );

                const decrypted = DecryptResponse(res.data, secretKey);
              
                if (decrypted.success) {
                    setGroupDetail(decrypted.data.groupDetail);
                    setExpenseList(decrypted.data.expenseList);
                    setFilteredExpenses(decrypted.data.expenseList);

                    // Calculate totals per user
                    const totals = {};
                    decrypted.data.expenseList.forEach((exp) => {
                        totals[exp.name] =
                            (totals[exp.name] || 0) + +exp.amount;
                    });
                    setUserTotals(totals);
                } else {
                    toast.error("Failed to decrypt data");
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!searchText) {
            setFilteredExpenses(expenseList);
        } else {
            const lower = searchText.toLowerCase();
            const filtered = expenseList.filter(
                (exp) =>
                    exp.name.toLowerCase().includes(lower) ||
                    exp.expense_name.toLowerCase().includes(lower),
            );
            setFilteredExpenses(filtered);
        }
    }, [searchText, expenseList]);

    // Define DataTable columns
    const columns = [
        {
            name: (
                <>
                    <FaUser className="me-2 text-white" />
                    User
                </>
            ),
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: (
                <>
                    <FaReceipt className="me-2 text-white" />
                    Expense Name
                </>
            ),
            selector: (row) => row.expense_name,
            sortable: true,
        },
        {
            name: (
                <>
                    <FaRegStickyNote className="me-2 text-white" />
                    Description
                </>
            ),
            selector: (row) => row.expense_description,
            wrap: true,
        },
        {
            name: (
                <>
                    <FaMoneyBillWave className="me-2 text-white" />
                    Amount (₹)
                </>
            ),
            selector: (row) => row.amount,
            sortable: true,
            right: true,
            cell: (row) => (
                <span className="text-success fw-bold">₹ {row.amount}</span>
            ),
        },
        {
            name: (
                <>
                    <FaCalendarAlt className="me-2 text-white" />
                    Created at
                </>
            ),
            selector: (row) => row.created_at,
            sortable: true,
            right: true,
            cell: (row) => (
                <span className="text-success fw-bold"> {row.created_at}</span>
            ),
        },
    ];

    return (
        <div className="container mt-4">
            {/* Group Details */}
            {groupDetail && (
                <div className="card shadow-sm mb-4 border-0">
                    <div className="card-body">
                        <h3 className="card-title text-primary mb-2">
                            <FaUsers className="me-2" />{" "}
                            {groupDetail.group_name}
                        </h3>
                        <p className="text-muted">
                            {groupDetail.group_description}
                        </p>
                        <div className="d-flex justify-content-between mt-3">
                            <span>
                                Status:{" "}
                                <span className="badge bg-info">
                                    {groupDetail.status}
                                </span>
                            </span>
                            <span>
                                <FaCalendarAlt className="me-2" />{" "}
                                {groupDetail.created_at}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Expense List */}
            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body">
                    <h5 className="card-header bg-white title mb-3">
                        <FaReceipt className="me-2" /> Expense Details
                    </h5>

                    {/* Search Bar */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by user or expense name..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredExpenses}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        theme="bootstrapTheme"
                        customStyles={customStyles}
                    />
                </div>
            </div>

            {/* User Totals */}
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <h5 className="card-header bg-white title mb-3 rounded">
                        <FaChartBar className="me-2" /> User-wise Totals
                    </h5>
                    <ul className="list-group list-group-flush">
                        {Object.entries(userTotals).map(
                            ([user, total], index) => (
                                <li
                                    key={index}
                                    className="list-group-item d-flex justify-content-between"
                                >
                                    <span>
                                        <i className="bi bi-person-circle me-2"></i>
                                        {user}
                                    </span>
                                    <span className="fw-bold text-primary">
                                        ₹ {total}
                                    </span>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default GroupDetailWithEachExpense;
