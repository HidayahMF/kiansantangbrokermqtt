import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_URL = "http://localhost:8000/api/devices"; // Ganti sesuai route Laravel kamu

const Sensor = () => {
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data perangkat
  const fetchDevices = async () => {
    try {
      const res = await axios.get(API_URL);
      setDevices(res.data);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Tambah atau update perangkat
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ name: "" });
      setEditingId(null);
      setIsModalOpen(false);
      fetchDevices();
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
    }
  };

  // Buka modal untuk edit
  const handleEdit = (device) => {
    setFormData({ name: device.name });
    setEditingId(device.id);
    setIsModalOpen(true);
  };

  // Hapus perangkat
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus perangkat ini?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchDevices();
    } catch (err) {
      console.error("Gagal menghapus data:", err);
    }
  };

  // Buka modal tambah
  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="p-10 min-h-screen bg-[#0E1014] text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Perangkat Sensor</h1>

      {/* Kartu Total */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-[#171B23]/80 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm">Total Perangkat</p>
          <p className="text-2xl font-bold">{devices.length}</p>
        </div>
        <div className="bg-[#171B23]/80 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm">Perangkat Terbaru</p>
          <p className="text-2xl font-bold text-yellow-400">
            {devices.length > 0 ? devices[devices.length - 1].name : "-"}
          </p>
        </div>
        <div className="bg-[#171B23]/80 rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-2xl font-bold text-green-400">Aktif</p>
        </div>
      </div>

      {/* Tombol Tambah */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          + Tambah Perangkat
        </button>
      </div>

      {/* Tabel Perangkat */}
      <div className="overflow-x-auto rounded-2xl bg-[#171B23]/80 shadow-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-300 text-sm uppercase border-b border-gray-700">
              <th className="py-4 px-6 font-semibold">#</th>
              <th className="py-4 px-6 font-semibold">Nama Perangkat</th>
              <th className="py-4 px-6 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border-b border-gray-700 hover:bg-[#1C222E]/60 transition ${i % 2 === 0 ? "bg-[#141821]/60" : ""
                  }`}
              >
                <td className="py-4 px-6">{i + 1}</td>
                <td className="py-4 px-6">{item.name}</td>
                <td className="py-4 px-6 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-yellow-500 rounded-lg text-black font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 rounded-lg text-white font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal Tambah/Edit */}
     {/* Popup Modal Tambah/Edit */}
<AnimatePresence>
  {isModalOpen && (
    <>
      {/* Background Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsModalOpen(false)}
      >
        {/* Modal Box */}
        <motion.div
          className="bg-[#171B23] rounded-2xl p-6 w-80 text-white shadow-xl relative"
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          onClick={(e) => e.stopPropagation()} // biar klik di dalam modal ga nutup
        >
          <h2 className="text-xl font-semibold mb-4 text-center">
            {editingId ? "Edit Perangkat" : "Tambah Perangkat"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nama Perangkat"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-3 rounded-lg bg-[#1C222E] w-full outline-none text-white"
              required
            />
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {editingId ? "Update" : "Tambah"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </>
  )}
</AnimatePresence>

    </div>
  );
};

export default Sensor;
