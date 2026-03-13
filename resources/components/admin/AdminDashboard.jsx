import React, { useEffect, useState } from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import { adminAPI } from "../../api/adminAPI";
import { DecryptResponse } from "../../js/EncryptPayload";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        if (!token) {
            toast.error("You are not logged in.");
            navigate("/admin/login", { replace: true });
            return;
        }

        const fetchDashboard = async () => {
            try {
                const res = await adminAPI.get("/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const decryptedData = DecryptResponse(
                    res.data,
                    "MySuperSecretKey1234567890"
                );
             
                if (decryptedData) {
                    setDashboardData(decryptedData.data);
                } else {
                    toast.error("Failed to load dashboard.");
                    navigate("/admin/login", { replace: true });
                }

            } catch (error) {
                toast.error("Unauthorized access. Please log in.");
                navigate("/admin/login", { replace: true });
            }
        };

        fetchDashboard();

    }, [navigate]);

    if (!dashboardData) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    return (
        <div>
           

            <Row>
                <Col md={4} onClick={() => navigate("/admin/users")}>
                
                    <Card className="text-center mb-3 dashboard-card" >
                        <Card.Body>
                            <i className="fa fa-users fa-2x mb-2"></i>
                            <h5>Users</h5>
                            <p>{dashboardData.totalUsers}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} onClick={() => navigate("/admin/groups_list")}>
                    <Card className="text-center mb-3 dashboard-card">
                        <Card.Body>
                            <i className="fa fa-layer-group fa-2x mb-2"></i>
                            <h5>Groups Master</h5>
                            <p>{dashboardData.totalGroups}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} onClick={() => navigate("/admin/expense_list")}>
                    <Card className="text-center mb-3 dashboard-card">
                        <Card.Body>
                            <i className="fa-solid fa-credit-card fa-2x mb-2"></i>
                            <h5>Expense</h5>
                            <p>{dashboardData.totalExpenses}</p>
                        </Card.Body>
                    </Card>
                </Col>

                
            </Row>

            <Card className="mt-4">
                <Card.Header className="bg-primary text-white" >Recent Expenses</Card.Header>
                <Card.Body>
                    <Table striped responsive>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>User Name</th>
                                <th>Group Name</th>
                                <th>Expense Name</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentExpenses.map((expense, index) => (
                                <tr key={expense.id}>
                                    <td>{index + 1}</td>
                                    <td>{expense.user.name}</td>
                                    <td>{expense.group.group_name}</td>
                                    <td>{expense.expense_name}</td>
                                    <td>₹{expense.amount}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                expense.status === "ACTIVE"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                            }`}
                                        >
                                            {expense.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
    );
}

export default AdminDashboard;