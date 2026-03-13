import React, { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../css/admin/sidebar.css";
// import "../css/app.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AuthProvider } from "../context/AdminAuthContext";

// Lazy load admin components
const AdminLogin = lazy(() => import("../components/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../components/admin/AdminDashboard"));
const UserList = lazy(() => import("../components/admin/UserList"));
const Groups=lazy(()=>import("../components/admin/Groups"));
const GroupList=lazy(()=>import("../components/admin/GroupList"));
const EditGroup=lazy(()=>import("../components/admin/EditGroup"));
const ExpenseList=lazy(()=>import("../components/admin/ExpenseList"));
const UserGroupMapping=lazy(()=>import("../components/admin/UserGroupMapping"));
const GroupWiseUsers=lazy(()=>import("../components/admin/GroupWiseUsers"));
// const AdminReports = lazy(() => import("../components/admin/AdminReports"));
// const AdminSettings = lazy(() => import("../components/admin/AdminSettings"));
const AdminLayout = lazy(() => import("../components/layout/AdminLayout"));
const PrivateRoute = lazy(() => import("../components/admin/PrivateRoute"));

function AdminApp() {
  return (
     <AuthProvider>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />

        <Routes>
          {/* Public admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected admin routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/groups" element={<Groups/> } />
              <Route path="/admin/groups_list" element={<GroupList/>}  />
              <Route path="/admin/edit_group/:id" element={<EditGroup/>}  />
              <Route path="admin/expense_list" element={<ExpenseList/>} />
              <Route path="admin/user_group_mapping_store" element={<UserGroupMapping/>} />
              <Route path="admin/group_wise_users_list/:id" element={<GroupWiseUsers />} />
              {/* 
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} /> */}
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
  );
}

// Render the AdminApp
ReactDOM.createRoot(document.getElementById("admin")).render(<AdminApp />);
