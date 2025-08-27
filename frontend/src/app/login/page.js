"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  // ------------------ User Login ------------------
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const phone = formData.get("phone");

    try {
      const res = await axios.post("http://localhost:3001/api/auth/userlogin", {
        name,
        phone,
      });

    if (res.data?.user) {         // ✅ check `driver` as sent by backend
  localStorage.setItem("user", JSON.stringify(res.data.user));
  alert("🚑 Ambulance driver login successful!");
  console.log("Driver saved in localStorage:", res.data.user);
} else {
  alert("❌ No user data received");
}


    } catch (err) {
      console.error(err);
      alert("❌ " + (err.response?.data?.error || "Server error"));
    } finally {
      setLoading(false);
    }
  };

// ------------------ Ambulance Driver Login ------------------
const handleDriverLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData(e.target);
  const driverName = formData.get("driverName");
  const phone = formData.get("phone");

  console.log("🚦 Form Data:", { driverName, phone });

  try {
    const res = await axios.post("http://localhost:3001/api/auth/login", {
      driverName,
      phone,
    });

    console.log("🚦 Raw Response:", res);
    console.log("🚦 Response Data:", res.data);

    // Check if backend is sending `driver` or `ambulance`
    if (res.data?.driver) {
      localStorage.setItem("driver", JSON.stringify(res.data.driver));
      alert("🚑 Ambulance driver login successful!");
      console.log("✅ Driver saved in localStorage:", res.data.driver);
    } else if (res.data?.ambulance) {
      // fallback if backend ever returns `ambulance`
      localStorage.setItem("driver", JSON.stringify(res.data.ambulance));
      alert("🚑 Ambulance driver login successful! (fallback)");
      console.log("✅ Driver saved in localStorage (fallback):", res.data.ambulance);
    } else {
      console.warn("❌ No driver data found in response:", res.data);
      alert("❌ No driver data received");
    }
  } catch (err) {
    console.error("💥 Axios Error:", err);
    alert("❌ " + (err.response?.data?.error || "Server error"));
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-around p-10 bg-gray-100">
      {/* ------------------ User Login Form ------------------ */}
      <form
        onSubmit={handleUserLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full md:w-[45%] space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700">User Login</h2>
        <input
          name="name"
          placeholder="Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          className="w-full p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login as User"}
        </button>
      </form>

      {/* ------------------ Ambulance Driver Login Form ------------------ */}
      <form
        onSubmit={handleDriverLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full md:w-[45%] space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700">Ambulance Driver Login</h2>
        <input
          name="driverName"
          placeholder="Driver Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          className="w-full p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login as Driver"}
        </button>
      </form>
    </div>
  );
}
