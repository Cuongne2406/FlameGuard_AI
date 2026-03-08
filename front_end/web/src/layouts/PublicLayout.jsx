import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar"; // Đảm bảo đúng đường dẫn
import Footer from "../components/public/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* BẮT BUỘC PHẢI CÓ DÒNG NÀY */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;