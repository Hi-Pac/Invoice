import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import OrderManagement from "./components/OrderManagement";
import ProductManagement from "./components/ProductManagement";
import BillingPayments from "./components/BillingPayments";
import DeliveryManagement from "./components/DeliveryManagement";
import CRMSupplier from "./components/CRMSupplier";
import CollectionManagement from "./components/CollectionManagement";
import Reports from "./components/Reports";
import UserManagement from "./components/UserManagement";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/orders" element={<OrderManagement />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/billing" element={<BillingPayments />} />
                    <Route path="/delivery" element={<DeliveryManagement />} />
                    <Route path="/crm" element={<CRMSupplier />} />
                    <Route path="/collections" element={<CollectionManagement />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

