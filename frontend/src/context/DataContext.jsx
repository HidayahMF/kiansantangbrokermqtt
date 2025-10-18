import React, { createContext, useState, useContext } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "TV",
      sensor: "Carbon",
      status: true,
      daily: 150,
      weekly: 800,
      monthly: 3200,
      city: "Jakarta",
      lat: -6.2088,
      lng: 106.8456,
    },
    {
      id: 2,
      name: "Kulkas",
      sensor: "Carbon",
      status: false,
      daily: 90,
      weekly: 650,
      monthly: 2500,
      city: "Jakarta",
      lat: -6.2088,
      lng: 106.8456,
    },
    {
      id: 3,
      name: "Lampu Ruang Tamu",
      sensor: "Carbon",
      status: true,
      daily: 50,
      weekly: 300,
      monthly: 1100,
      city: "Jakarta",
      lat: -6.2088,
      lng: 106.8456,
    },
    {
      id: 4,
      name: "AC",
      sensor: "Carbon",
      status: true,
      daily: 200,
      weekly: 1200,
      monthly: 5000,
      city: "Bandung",
      lat: -6.9175,
      lng: 107.6191,
    },
  ]);

  const totalSensor = devices.length;
  const sensorOn = devices.filter((d) => d.status).length;
  const sensorOff = devices.filter((d) => !d.status).length;

  
  const cityOverview = devices.reduce((acc, d) => {
    if (!acc[d.city])
      acc[d.city] = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        sensors: 0,
        lat: d.lat,
        lng: d.lng,
      };
    acc[d.city].daily += d.daily;
    acc[d.city].weekly += d.weekly;
    acc[d.city].monthly += d.monthly;
    acc[d.city].sensors += 1;
    return acc;
  }, {});

  const user = {
    name: "Hidayah Muhammad",
    email: "user@email.com",
    city: "Jakarta",
    district: "Matraman",
    rt: "01",
    rw: "02",
    joinDate: "12 Jan 2025",
    status: "Active",
    sensors: {
      total: totalSensor,
      on: sensorOn,
      off: sensorOff,
      error: 0,
    },
    devices: devices.filter((d) => d.city === "Jakarta"), 
  };

  return (
    <DataContext.Provider value={{ devices, setDevices, user, cityOverview }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
