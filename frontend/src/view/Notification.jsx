import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = () => {
  const [records, setRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Ambil data dari API tiap 5 detik
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/inputemission");
        const data = res.data.slice(-24); // ambil 24 data terakhir (1 hari)
        setRecords(data);
        generateNotifications(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    loadData();
    const timer = setInterval(loadData, 5000);
    return () => clearInterval(timer);
  }, []);

  // Tentukan level berdasarkan CO₂
  const getLevel = (value) => {
    if (value < 50) return "Aman";
    if (value < 100) return "Sedang";
    if (value < 200) return "Bahaya";
    return "Kritis";
  };

  // Warna badge
  const getColor = (level) => {
    switch (level) {
      case "Aman":
        return "bg-green-500";
      case "Sedang":
        return "bg-yellow-500";
      case "Bahaya":
        return "bg-orange-500";
      case "Kritis":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  // Buat pesan notifikasi otomatis
  const generateNotifications = (data) => {
    const notifList = [];

    data.forEach((r) => {
      const co2 = parseFloat(r.CO2 || 0);
      const level = getLevel(co2);
      let message = "";

      if (level === "Aman") message = "Emisi karbon dalam batas aman.";
      else if (level === "Sedang")
        message = "Emisi mulai meningkat, periksa penggunaan energi.";
      else if (level === "Bahaya")
        message = "Emisi tinggi! Kurangi konsumsi listrik segera.";
      else if (level === "Kritis")
        message = "Emisi sangat tinggi ⚠️. Potensi bahaya lingkungan!";

      // hanya tampilkan jika melebihi 50
      if (co2 > 50) {
        notifList.push({
          id: r.id,
          time: r.timestamp,
          level,
          message,
          co2,
        });
      }
    });

    // urutkan dari terbaru
    setNotifications(notifList.reverse());
  };

  // Hitung waktu relatif (x menit lalu)
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const t = new Date(timestamp);
    const diffMin = Math.floor((now - t) / 60000);
    if (diffMin < 1) return "baru saja";
    if (diffMin < 60) return `${diffMin}m lalu`;
    const diffH = Math.floor(diffMin / 60);
    return `${diffH}h lalu`;
  };

  return (
    <div className="p-10 min-h-screen text-white bg-[#0E1014]">
      <h1 className="text-3xl font-bold mb-8">Notifikasi Harian</h1>

      {/* Legend */}
      <div className="flex items-center space-x-3 mb-6">
        <span className="font-semibold">Level Bahaya</span>
        <div className="flex space-x-2">
          {["bg-green-500", "bg-yellow-500", "bg-orange-500", "bg-red-600"].map(
            (color, i) => (
              <div key={i} className={`${color} w-4 h-4 rounded-full`} />
            )
          )}
        </div>
      </div>

      {/* Daftar Notifikasi */}
      {notifications.length === 0 ? (
        <p className="text-gray-400">Belum ada aktivitas berbahaya hari ini </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex justify-between items-center bg-[#1f2025]/90 px-5 py-4 rounded-2xl shadow hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <h3 className="font-semibold text-lg">CO₂: {n.co2.toFixed(1)} ppm</h3>
                <p className="text-gray-400 text-sm">{n.message}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-semibold ${getColor(
                    n.level
                  )} px-3 py-1 rounded-full`}
                >
                  {n.level}
                </span>
                <span className="text-gray-400 text-sm">{timeAgo(n.time)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
