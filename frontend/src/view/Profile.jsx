import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaUserCircle } from "react-icons/fa";

const Profile = () => {
  // dummy data user
  const user = {
    name: "Pahri Pradana",
    email: "pahri@example.com",
    city: "Bandung",
    district: "Sukajadi",
    rt: "03",
    rw: "06",
    status: "Aktif",
    joinDate: "2025-04-10",
  };

  // state untuk ambil data device dari database
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8000/api/devices"; // endpoint Laravel kamu

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get(API_URL);
        setDevices(res.data);
      } catch (err) {
        console.error("Gagal memuat data devices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  // Hitung total emisi
  const totalDaily = devices.reduce(
    (acc, d) => acc + parseFloat(d.daily || 0),
    0
  );
  const totalWeekly = devices.reduce(
    (acc, d) => acc + parseFloat(d.weekly || 0),
    0
  );
  const totalMonthly = devices.reduce(
    (acc, d) => acc + parseFloat(d.monthly || 0),
    0
  );

  const totalDevices = devices.length;
  const totalSensorType = devices.length > 0 ? devices[0].sensor : "-";

  return (
    <div className="p-10 text-white bg-[#0E1014] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh] text-gray-400">
          Memuat data sensor...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kartu Profil */}
          <div className="col-span-1 bg-[#1f2025] rounded-2xl p-8 shadow-lg flex flex-col items-center">
            <div className="w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl">
              <FaUserCircle />
            </div>

            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>

            <div className="mt-6 w-full border-t border-[#333] pt-5 space-y-2 text-sm">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-400">{user.status}</span>
              </p>
              <p>
                <strong>Bergabung:</strong> {user.joinDate}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                {user.city}, {user.district}
              </p>
              <p>
                <strong>RT/RW:</strong> {user.rt}/{user.rw}
              </p>
            </div>
          </div>

          {/* Statistik */}
          <div className="col-span-2 bg-[#1f2025] rounded-2xl p-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-6">Statistik Sensor</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#2b2d33] rounded-xl p-5 text-center hover:scale-105 transition-all">
                <p className="text-gray-400 text-sm">Total Perangkat</p>
                <h3 className="text-2xl font-bold">{totalDevices}</h3>
              </div>
              <div className="bg-[#2b2d33] rounded-xl p-5 text-center hover:scale-105 transition-all">
                <p className="text-gray-400 text-sm">Jenis Sensor</p>
                <h3 className="text-2xl font-bold text-yellow-400">
                  {totalSensorType}
                </h3>
              </div>
              <div className="bg-[#2b2d33] rounded-xl p-5 text-center hover:scale-105 transition-all">
                <p className="text-gray-400 text-sm mb-1">Total Emisi Harian</p>
                <h3 className="text-xl font-bold text-green-400">
                  {totalDaily.toFixed(1)} CO₂
                </h3>
              </div>
              <div className="bg-[#2b2d33] rounded-xl p-5 text-center hover:scale-105 transition-all">
                <p className="text-gray-400 text-sm mb-1">
                  Total Emisi Bulanan
                </p>
                <h3 className="text-xl font-bold text-green-400">
                  {totalMonthly.toFixed(1)} CO₂
                </h3>
              </div>
            </div>

            {/* Info Akun */}
            <h2 className="text-lg font-semibold mb-4">Informasi Akun</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#2b2d33] p-4 rounded-xl">
                <p className="text-gray-400">Nama Lengkap</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              <div className="bg-[#2b2d33] p-4 rounded-xl">
                <p className="text-gray-400">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div className="bg-[#2b2d33] p-4 rounded-xl">
                <p className="text-gray-400">Kota</p>
                <p className="font-semibold">{user.city}</p>
              </div>
              <div className="bg-[#2b2d33] p-4 rounded-xl">
                <p className="text-gray-400">Kecamatan</p>
                <p className="font-semibold">{user.district}</p>
              </div>
              <div className="bg-[#2b2d33] p-4 rounded-xl">
                <p className="text-gray-400">RT/RW</p>
                <p className="font-semibold">
                  {user.rt}/{user.rw}
                </p>
              </div>
              <div className="bg-[#2b2d33] p-4 rounded-xl">
                <p className="text-gray-400">Tanggal Bergabung</p>
                <p className="font-semibold">{user.joinDate}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
