// resources/js/app.jsx
import React, { Suspense, lazy } from 'react';
import { Toaster } from "react-hot-toast"; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import '../css/sidebar.css';
import '../css/app.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from "../context/AuthContext";
// Lazy loading components
const Login = lazy(() => import('../components/user/Login'));
const Home = lazy(() => import('../components/Home'));
const Registration = lazy(() => import('../components/user/Registration'));
const PrivateRoute = lazy(() => import("../components/user/PrivateRoute"));
const UserDashboard = lazy(() => import('../components/user/UserDashboard'));
const About = lazy(() => import('../components/user/About'));
const Contact = lazy(() => import('../components/user/Contact'));
const Profile = lazy(() => import('../components/user/Profile'));
const ChangePassword = lazy(() => import('../components/user/ChangePassword'));
const AddExpense = lazy(() => import('../components/user/AddExpense'));
const ExpenseList = lazy(() => import('../components/user/ExpenseList'));
const ExpenseDetail = lazy(() => import('../components/user/ExpenseDetail'));
const EditExpense = lazy(() => import('../components/user/EditExpense'));
const GroupDetailWithEachUserExpense=lazy(()=>import('../components/user/GroupDetailWithEachUserExpense'));

const DashboardLayout = lazy(() => import('../components/layout/DashboardLayout'));

function App() {
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
              background: '#333',
              color: '#fff',
            },
          }}
        />

        <Routes>
         
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/" element={<Home />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
          
            <Route element={<DashboardLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/change-password" element={<ChangePassword />} />
              <Route path="/user/add-expense" element={<AddExpense />} />
              <Route path="/user/expense-list" element={<ExpenseList />} />
              <Route path="/user/expense-detail/:id" element={<ExpenseDetail />} /> 
              <Route path="/user/edit-expense/:id" element={<EditExpense />} />
              <Route path="/user/group_detail_with_each_user_expense/:id" element={<GroupDetailWithEachUserExpense  />} />
            </Route>
          </Route>

        
        </Routes>

      
       
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
  );
}

// Render the App
ReactDOM.createRoot(document.getElementById('app')).render(<App />);