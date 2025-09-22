import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Complaints from './components/Complaints/Complaints';
import WorkOrders from './components/WorkOrders/WorkOrders';
import ServiceOrders from './components/ServiceOrders/ServiceOrders';
import Assets from './components/Assets/Assets';
import Compliances from './components/Compliances/Compliances';
import Layout from './components/Layout/Layout';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/work-orders" element={<WorkOrders />} />
        <Route path="/service-orders" element={<ServiceOrders />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/compliances" element={<Compliances />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;