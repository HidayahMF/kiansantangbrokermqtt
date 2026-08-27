import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    nomer: "",
    kecamatan: "",
    kelurahan: "",
    kodepos: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const isRegister = mode === "register";
    const url = `${API_BASE_URL}/api/${isRegister ? "register" : "login"}`;

    const payload = isRegister
      ? {
          name: form.name,
          email: form.email,
          password: form.password,
          nomer: form.nomer,
          kecamatan: form.kecamatan,
          kelurahan: form.kelurahan,
          kodepos: form.kodepos,
        }
      : { email: form.email, password: form.password };

    try {
      const res = await axios.post(url, payload);

      if (res.data.token) {
        localStorage.setItem("auth_token", res.data.token);
        localStorage.setItem("auth_user", JSON.stringify(res.data.user));
      }

      setMessage(res.data.message || "Berhasil!");
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || `Gagal (${err.response?.status ?? "koneksi"})`);
    }
  };

  const inputClass =
    "w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-md w-80 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Daftar"}
        </h2>

        <div className="flex mb-4 rounded bg-gray-700 overflow-hidden">
          {["login", "register"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                mode === m ? "bg-blue-500" : "bg-transparent"
              }`}
            >
              {m === "login" ? "Login" : "Daftar"}
            </button>
          ))}
        </div>

        {mode === "register" && (
          <input
            name="name"
            placeholder="Nama Lengkap"
            className={inputClass}
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className={inputClass}
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min. 6 karakter)"
          className={inputClass}
          value={form.password}
          onChange={handleChange}
          required
        />

        {mode === "register" && (
          <>
            <input
              name="nomer"
              placeholder="Nomor Telepon"
              className={inputClass}
              value={form.nomer}
              onChange={handleChange}
              required
            />
            <input
              name="kecamatan"
              placeholder="Kecamatan"
              className={inputClass}
              value={form.kecamatan}
              onChange={handleChange}
              required
            />
            <input
              name="kelurahan"
              placeholder="Kelurahan"
              className={inputClass}
              value={form.kelurahan}
              onChange={handleChange}
              required
            />
            <input
              name="kodepos"
              placeholder="Kode Pos"
              className={inputClass}
              value={form.kodepos}
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded">
          {mode === "login" ? "Login" : "Daftar"}
        </button>

        {message && <p className="mt-4 text-center text-green-400">{message}</p>}
        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default Login;