import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { dataset } from "../constant/index";

const ChatbotCarbon = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: " Halo! Aku OxyBot  apa saja tentang emisi karbon, energi hijau, atau efek rumah kaca!",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Scroll otomatis ke bawah tiap pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const findReply = (message) => {
    const lowerMsg = message.toLowerCase();
    for (const data of dataset) {
      for (const keyword of data.keywords) {
        if (lowerMsg.includes(keyword.toLowerCase())) {
          return data.reply;
        }
      }
    }
    return "Maaf, aku belum punya jawaban tentang itu . Coba tanya hal lain seputar karbon, energi hijau, atau lingkungan!";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const botReply = { sender: "bot", text: findReply(input) };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E1014] text-white">
      {/* Header */}
      <div className="bg-[#171B23] p-5 text-center shadow-md">
        <h1 className="text-2xl font-bold text-green-400">OxyBot</h1>
        <p className="text-sm text-gray-400">Asisten Pintar tentang Emisi Karbon </p>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0E1014]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-[#1C222E] text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-[#171B23] flex items-center gap-3 border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Tulis pertanyaanmu..."
          className="flex-1 px-4 py-2 bg-[#1C222E] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-xl font-semibold"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatbotCarbon;
