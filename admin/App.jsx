import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Footer from "./Components/Footer/Footer";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin";
import AdminLogin from "./Pages/AdminLogin";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AdminNotificationProvider } from "./Context/AdminNotificationContext";
import { AdminUserProvider } from "./Context/AdminUserContext";

function App() {
  return (
    <AdminNotificationProvider>
      <AdminUserProvider>
        <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Admin />
                    <Footer />
                  </>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AdminUserProvider>
    </AdminNotificationProvider>
  );
}

export default App;