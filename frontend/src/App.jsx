import React from "react";
import Router from "./router/Router";
import { DataProvider } from "./context/DataContext";
import "./constant/index";
import Footer from "./components/Footer";

const App = () => {
  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0E1014] via-[#12141A] to-[#0E1014] text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_70%)]" />

        <div className="relative z-10 backdrop-blur-sm">
          <Router />
          <Footer />
        </div>
      </div>
    </DataProvider>
  );
};

export default App;
