"use client";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  // ------------------ Handle User Registration ------------------
  const handleUserRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await axios.post("http://localhost:3001/api/auth/user", {
          name,
          phone,
          email,
          latitude,
          longitude,
        });

        alert("✅ User registered successfully!");
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user)); // save user for later
      } catch (err) {
        console.error(err);
        alert("❌ " + (err.response?.data?.error || "Server error"));
      } finally {
        setLoading(false);
      }
    });
  };

  // ------------------ Handle Ambulance Registration ------------------
  const handleAmbulanceRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const driverName = formData.get("driverName");
    const phone = formData.get("phone");
    const vehicleNumber = formData.get("vehicleNumber");

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await axios.post("http://localhost:3001/api/auth/ambulance", {
          driverName,
          phone,
          vehicleNumber,
          latitude,
          longitude,
        });

        alert("🚑 Ambulance driver registered successfully!");
        console.log(res.data);
        localStorage.setItem("driver", JSON.stringify(res.data.ambulance)); // save driver
      } catch (err) {
        console.error(err);
        alert("❌ " + (err.response?.data?.error || "Server error"));
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-around p-10 bg-gray-100">
      {/* ------------------ User Form ------------------ */}
      <form
        onSubmit={handleUserRegister}
        className="bg-white shadow-lg rounded-xl p-8 w-full md:w-[45%] space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700">Register User</h2>
        <input name="name" placeholder="Name" className="w-full p-3 border rounded-lg" required />
        <input name="phone" placeholder="Phone" className="w-full p-3 border rounded-lg" required />
        <input name="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register User"}
        </button>
      </form>

      {/* ------------------ Ambulance Driver Form ------------------ */}
      <form
        onSubmit={handleAmbulanceRegister}
        className="bg-white shadow-lg rounded-xl p-8 w-full md:w-[45%] space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700">Register Ambulance Driver</h2>
        <input name="driverName" placeholder="Driver Name" className="w-full p-3 border rounded-lg" required />
        <input name="phone" placeholder="Phone" className="w-full p-3 border rounded-lg" required />
        <input name="vehicleNumber" placeholder="Vehicle Number" className="w-full p-3 border rounded-lg" required />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          {loading ? "Registering..." : "Register Ambulance"}
        </button>
      </form>
    </div>
  );
}
