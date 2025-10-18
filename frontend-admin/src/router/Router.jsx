import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Users from "../view/Users";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const RouterApp = () => {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-900 text-white min-h-screen">
          <Navbar />
          <div className="p-8">
            <Routes>   
              <Route path="/users" element={<Users />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default RouterApp;
