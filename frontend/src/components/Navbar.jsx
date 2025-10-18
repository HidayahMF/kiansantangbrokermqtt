import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ onToggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    onToggleSidebar(); 
  };

  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-[#121212] text-white shadow-md">
      
      <h1 className="font-extrabold text-[26px] sm:text-[28px]">Dashboard</h1>

     
      <div className="hidden sm:flex items-center space-x-3">
        <button className="font-extrabold bg-[#23252b] hover:bg-[#2e323a] text-white px-5 py-2 rounded-xl transition">
          Daftar
        </button>
        <button className="font-extrabold bg-[#23252b] hover:bg-[#2e323a] text-white px-5 py-2 rounded-xl transition">
          Login
        </button>
      </div>


      <button
        className="sm:hidden flex items-center justify-center w-10 h-10 bg-[#23252b] rounded-xl hover:bg-[#2e323a] transition"
        onClick={handleMenuClick}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </nav>
  );
};

export default Navbar;
