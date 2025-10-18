import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Circle,
  Popup,
} from "react-leaflet";
import axios from "axios";

const OverviewKota = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
        (err) => setError("Tidak bisa mendapatkan lokasi: " + err.message)
      );
    } else {
      setError("Browser kamu tidak mendukung Geolocation API.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/inputemission");
        const latest = res.data.at(-1);
        setSensorData(latest);
      } catch (err) {
        console.error("Gagal ambil data sensor:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (value) => {
    if (value < 50) return "#00aaff";
    if (value < 100) return "#ffaa00";
    return "#ff4444";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Overview Kota</h1>
      <section className="bg-[#1e1f25] p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Lokasi Saat Ini</h2>
        {error && <p className="text-red-400">{error}</p>}
        {!coords && !error && <p className="text-gray-400">Mengambil lokasi...</p>}
        {coords && (
          <MapContainer
            center={coords}
            zoom={13}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            className="w-full h-96 rounded-xl"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle
              center={coords}
              radius={300}
              color={sensorData ? getColor(sensorData.CO2) : "blue"}
              fillColor={sensorData ? getColor(sensorData.CO2) : "blue"}
              fillOpacity={0.1}
            />
            <CircleMarker
              center={coords}
              radius={12}
              color={sensorData ? getColor(sensorData.CO2) : "blue"}
              fillColor={sensorData ? getColor(sensorData.CO2) : "blue"}
              fillOpacity={0.8}
            >
              <Popup>
                <strong> Lokasi Kamu</strong>
                <br />
                Lat: {coords[0].toFixed(5)}, Lng: {coords[1].toFixed(5)}
                <hr className="my-2 border-gray-500" />
                {sensorData ? (
                  <div className="text-sm">
                    <p>CO₂: {sensorData.CO2} ppm</p>
                    <p> Voltage: {sensorData.voltage} V</p>
                    <p> Power: {sensorData.power} W</p>
                    <p>Suhu: {sensorData.tempObject}°C</p>
                    <p>Terakhir: {sensorData.timestamp}</p>
                  </div>
                ) : (
                  <p className="text-gray-400">Memuat data sensor...</p>
                )}
              </Popup>
            </CircleMarker>
          </MapContainer>
        )}
      </section>
    </div>
  );
};

export default OverviewKota;
