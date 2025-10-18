import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import axios from "axios";

const TooltipContent = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900/90 p-3 rounded-lg shadow-lg border border-gray-700 text-white text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((item, i) => (
        <p key={i} style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
};

const OverviewPribadi = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/inputemission");
        setRecords(res.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    loadData();
    const timer = setInterval(loadData, 1000);
    return () => clearInterval(timer);
  }, []);

  const weekly = records.slice(0, 7).map((r) => ({ name: r.timestamp, CO2: r.CO2 }));
  const monthly = records.slice(0, 30).map((r) => ({ name: r.timestamp, CO2: r.CO2 }));
  const yearly = records.slice(0, 365).map((r) => ({ name: r.timestamp, CO2: r.CO2 }));

  const sensors = records.map((r) => ({
    name: r.timestamp,
    voltage: r.voltage,
    current: r.current,
    power: r.power,
    energy: r.energy,
    frequency: r.frequency,
    powerFactor: r.powerFactor,
    tempAmbient: r.tempAmbient,
    tempObject: r.tempObject,
  }));

  const CO2Chart = (data, color) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={color} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip content={<TooltipContent />} />

        <Area
          type="monotone"
          dataKey="CO2"
          stroke={color}
          strokeWidth={2.2}
          fill={`url(#${color})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );


  const SensorChart = (data) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="name" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip content={<TooltipContent />} />
        <Legend />

        <Line type="monotone" dataKey="voltage" stroke="#00C49F" dot={false} />
        <Line type="monotone" dataKey="current" stroke="#FFBB28" dot={false} />
        <Line type="monotone" dataKey="power" stroke="#FF8042" dot={false} />
        <Line type="monotone" dataKey="energy" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="frequency" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="powerFactor" stroke="#0088FE" dot={false} />
        <Line type="monotone" dataKey="tempAmbient" stroke="#FF0000" dot={false} />
        <Line type="monotone" dataKey="tempObject" stroke="#9933FF" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Overview Pribadi</h1>

      <section className="bg-[#1e1f25] p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Weekly Overview</h2>
        <div className="h-64">{CO2Chart(weekly, "#00c8ff")}</div>
      </section>

      <section className="bg-[#1e1f25] p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
        <div className="h-64">{CO2Chart(monthly, "#32e3b3")}</div>
      </section>

      <section className="bg-[#1e1f25] p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Yearly Overview</h2>
        <div className="h-64">{CO2Chart(yearly, "#450693")}</div>
      </section>

      <section className="bg-[#1e1f25] p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Other Overview</h2>
        <div className="h-96">{SensorChart(sensors)}</div>
      </section>
    </div>
  );
};

export default OverviewPribadi;
