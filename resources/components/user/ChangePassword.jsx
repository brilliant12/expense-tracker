import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { userAPI } from "../../api/userAPI";
import { EncryptPayload, DecryptResponse } from "../../js/EncryptPayload";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // toggle states for show/hide
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const secretKey = "MySuperSecretKey1234567890";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      // Encrypt payload before sending
      const encryptedData = EncryptPayload(
        {
          current_password: currentPassword,
          new_password: newPassword, 
        },
        secretKey
      );

      const res = await userAPI.post("/user/change-password", encryptedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
      });

      const decrypted = DecryptResponse(res.data, secretKey);

      if (decrypted.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(decrypted.message || "Failed to change password.");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-shadow m-3">
      <div className="card-header title">
        <h5>Change Password</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} >
          {/* Current Password */}
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <div className="input-group">
            {/* Current Password */}
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
                name="current_password"
                autoComplete="current-password"  
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <div className="input-group">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                name="new_password"
                autoComplete="new-password"      
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm New Password</label>
            <div className="input-group">
             {/* Confirm Password */}
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              name="confirm_password"
              autoComplete="new-password"       
              required
            />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
