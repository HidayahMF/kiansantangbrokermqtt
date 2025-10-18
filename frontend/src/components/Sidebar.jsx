import React from "react";
import {
  Home,
  BarChart2,
  Cpu,
  Bell,
  Settings,
  User,
  Activity,
  BotIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={22} />, label: "Dashboard", path: "/" },
    { icon: <BarChart2 size={22} />, label: "Overview", path: "/overview" },
    { icon: <Activity size={22} />, label: "Sensor", path: "/sensor" },
    { icon: <BotIcon size={22} />, label: "Chatbot", path: "/chatbot" },
    { icon: <Bell size={22} />, label: "Notification", path: "/notification" },
    { icon: <Settings size={22} />, label: "Settings", path: "/settings" },
    { icon: <User size={22} />, label: "Profile", path: "/profile" },
  ];

  return (
    <aside
      className="fixed top-7 left-5 h-[90 vh] w-24 bg-gradient-to-b from-[#2a2d35] to-[#1b1d22]
     rounded-3xl shadow-lg z-40 flex flex-col items-center py-12 space-y-8"
    >
      {menuItems.map((item, index) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center transition ${
              active ? "text-[#4b5bff]" : "text-gray-300 hover:text-[#4b5bff]"
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-2">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default Sidebar;
