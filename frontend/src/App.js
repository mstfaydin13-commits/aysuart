import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Customize from "@/pages/Customize";
import Gallery from "@/pages/Gallery";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import OrderSuccess from "@/pages/OrderSuccess";
import Memory from "@/pages/Memory";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminOrderDetail from "@/pages/AdminOrderDetail";
import Sozlesme from "@/pages/legal/Sozlesme";
import Gizlilik from "@/pages/legal/Gizlilik";
import Iade from "@/pages/legal/Iade";
import Kvkk from "@/pages/legal/Kvkk";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import CookieConsent from "@/components/CookieConsent";
import WhatsAppButton from "@/components/WhatsAppButton";

function ProtectedAdmin({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-32 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" /></div>;
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" replace />;
  return children;
}

function ProtectedCustomer({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-32 text-center"><Loader2 className="w-6 h-6 mx-auto animate-spin text-gold" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/order/:id" element={<OrderSuccess />} />
              <Route path="/memory/:id" element={<Memory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<ProtectedCustomer><Account /></ProtectedCustomer>} />
              <Route path="/sozlesme" element={<Sozlesme />} />
              <Route path="/gizlilik" element={<Gizlilik />} />
              <Route path="/iade" element={<Iade />} />
              <Route path="/kvkk" element={<Kvkk />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
              <Route path="/admin/orders/:id" element={<ProtectedAdmin><AdminOrderDetail /></ProtectedAdmin>} />
            </Route>
          </Routes>
          <CookieConsent />
          <WhatsAppButton />
        </BrowserRouter>
      </AuthProvider>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
