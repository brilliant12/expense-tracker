import { useEffect, useState } from "react";
import { userAPI } from "../../api/userAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DecryptResponse } from "../../js/EncryptPayload";
import { FaReceipt, FaUsers, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { AuthContext } from "../../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function ExpenseChart({ groups }) {
  const data = {
    labels: groups.map((g) => g.group_name),
    datasets: [
      {
        label: "Total Group Expenses",
        data: groups.map((g) => g.total_group_expenses),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Your Expenses",
        data: groups.map((g) => g.user_total_expenses),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Fair Share",
        data: groups.map((g) => g.split_expense_per_user),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Expense Comparison by Group" },
    },
  };

  return <Bar data={data} options={options} />;
}
function UserDashboard() {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
 
  const colors = [
    "bg-primary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info",
    "bg-dark",
  ];

  useEffect(() => {
    const token = localStorage.getItem("user_token");

    if (!token) {
      toast.error("You are not logged in.");
      navigate("/login", { replace: true });
      return;
    }

    userAPI
      .get("/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const decryptedData = DecryptResponse(
          res.data,
          "MySuperSecretKey1234567890",
        );
        if (decryptedData.success) {
          setUser(decryptedData.data.user);
          setGroups(decryptedData.data.groups);
        } else {
          toast.error("Failed to decrypt dashboard data.");
          navigate("/login", { replace: true });
        }
      })
      .catch(() => {
        toast.error("Unauthorized access. Please log in.");
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  return (
     <div className="container">
    <div className="card card-shadow">
      <div className="card-header title">
        <h5>Dashboard Overview</h5>
      </div>
      <div className="card-body">
        <div className="row">
          {groups.length > 0 ? (
            groups.map((item, index) => {
              const randomColor =
                colors[Math.floor(Math.random() * colors.length)];
              return (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="card dashboard-card shadow-sm">
                    <div className="card-body" style={{ cursor: "pointer" }}>
                      <div className="dashboard-header bg-primary rounded text-white">
                        <FaReceipt size={32} className="me-2 text-primary" />
                        <h5 className="card-title mb-0">{item.group_name}</h5>
                      </div>

                      {/* Details grid */}
                      <div
                        className="row text-center g-2 mt-1"
                        onClick={() =>
                          navigate(
                            "/user/group_detail_with_each_user_expense/" +
                              item.group_id,
                            { replace: true },
                          )
                        }
                      >
                        <div className="col-6">
                          <div className="das_box">
                            <FaUsers className="icon" />
                            <div className="das_data">
                              <div className="value">
                                {item.total_users_in_group}
                              </div>
                              <div className="label">Users</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="das_box">
                            <FaMoneyBillWave className="icon" />
                            <div className="das_data">
                              <div className="value">
                                ₹{item.total_group_expenses}
                              </div>
                              <div className="label">Total</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="das_box">
                            <FaUser className="icon" />
                            <div className="das_data">
                              <div className="value">
                                ₹{item.user_total_expenses}
                              </div>
                              <div className="label">Your Expenses</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="das_box">
                            <span className="icon">💰</span>
                            <div className="das_data">
                              <div className="value">
                                ₹{item.split_expense_per_user}
                              </div>
                              <div className="label">Split/User</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="d-flex justify-content-between small mb-1">
                          <span>Your Share</span>
                          <span>Fair Share</span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className={`progress-bar ${item.user_total_expenses >= item.split_expense_per_user ? "bg-success" : "bg-warning"}`}
                            role="progressbar"
                            style={{
                              width: `${Math.min((item.user_total_expenses / item.split_expense_per_user) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>

                        {/* Difference text */}
                        <div className="mt-2 text-center difference-text">
                          {item.user_total_expenses >
                          item.split_expense_per_user ? (
                            <span className="text-success">
                              +₹
                              {item.user_total_expenses -
                                item.split_expense_per_user}
                              above fair share
                            </span>
                          ) : item.user_total_expenses <
                            item.split_expense_per_user ? (
                            <span className="text-warning">
                              -₹
                              {item.split_expense_per_user -
                                item.user_total_expenses}
                              below fair share
                            </span>
                          ) : (
                            <span className="text-info">
                              Exactly at fair share
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted">No groups assigned yet.</p>
          )}
        </div>
      </div>
    </div>
    <div className="card card-shadow mt-4">
  <div className="card-header title">
    <h5>Expense Chart</h5>
  </div>
  <div className="card-body">
    {groups.length > 0 ? (
      <ExpenseChart groups={groups} />
    ) : (
      <p className="text-muted">No data available for chart.</p>
    )}
  </div>
</div>
</div>
  );
}
export default UserDashboard;
