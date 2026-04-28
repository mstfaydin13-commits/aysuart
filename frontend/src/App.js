import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Customize from "@/pages/Customize";
import Gallery from "@/pages/Gallery";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import OrderSuccess from "@/pages/OrderSuccess";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/customize" element={<Customize />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/order/:id" element={<OrderSuccess />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
