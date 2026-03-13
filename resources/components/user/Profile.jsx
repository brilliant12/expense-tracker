import React, { useEffect, useState } from "react";
import { userAPI } from "../../api/userAPI";
import toast from "react-hot-toast";
import { DecryptResponse } from "../../js/EncryptPayload";
import { FaUserCircle } from "react-icons/fa"; // ✅ default user icon

function Profile() {
  const [user, setUser] = useState(null);
  const secretKey = "MySuperSecretKey1234567890";

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }

    userAPI
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const decrypted = DecryptResponse(res.data, secretKey);
        if (decrypted.success) {
          setUser(decrypted.data.user);
        } else {
          toast.error("Failed to load profile.");
        }
      })
      .catch(() => {
        toast.error("Error fetching profile.");
      });
  }, []);

  if (!user) {
    return <p className="text-muted">Loading profile...</p>;
  }

  return (
    <div className="card card-shadow m-3">
      <div className="card-header title">
        <h5>Profile</h5>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-4 text-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            ) : (
              <FaUserCircle size={120} className="text-secondary mb-3" />
            )}

            <h6 className="fw-bold">{user.name}</h6>
            <p className="text-muted">{user.email}</p>
          </div>
          <div className="col-md-8">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td>{user.phone || "Not provided"}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span
                      className={
                        user.status === "ACTIVE"
                          ? "badge bg-success"
                          : "badge bg-secondary"
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Joined</th>
                  <td>{user.created_at_formatted || user.created_at}</td>
                </tr>
                <tr>
                  <th>Last Updated</th>
                  <td>{user.updated_at_formatted || user.updated_at}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
