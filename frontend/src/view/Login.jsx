import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      // Tampilkan response untuk debugging
      console.log("Response:", res);

      // Pastikan backend return 200 atau 201
      if (res.status === 200 || res.status === 201) {
        setMessage(res.data.message || "Login berhasil!");
        console.log("User data:", res.data.user);
      } else {
        setMessage("Terjadi kesalahan pada server (kode tidak 200).");
      }

    } catch (err) {
      console.error("Login error:", err.response || err.message);

      // Coba tampilkan pesan error spesifik dari backend
      if (err.response) {
        setMessage(
          err.response.data.message ||
          `Login gagal (${err.response.status})`
        );
      } else {
        setMessage("Tidak dapat terhubung ke server!");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-md w-80 text-white"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded bg-gray-700 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
        >
          Login
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
