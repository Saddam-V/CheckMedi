import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Patient" });
  const [doctorDetails, setDoctorDetails] = useState({ specialization: "", experience: "", qualifications: "", bio: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle doctor-specific details
  const handleDoctorDetailsChange = (e) => {
    setDoctorDetails({ ...doctorDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    let submitData = { ...form };
    if (form.role === "Doctor") {
      submitData = { ...form, ...doctorDetails };
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      login(data.token);
      setSuccess("Signup successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          className="w-full p-2 mb-4 border rounded"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full p-2 mb-4 border rounded"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select className="w-full p-2 mb-4 border rounded" name="role" value={form.role} onChange={handleChange}>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Pharmacy">Pharmacy</option>
        </select>
        {/* Doctor extra fields */}
        {form.role === "Doctor" && (
          <div className="mb-4">
            <input
              className="w-full p-2 mb-2 border rounded"
              name="specialization"
              placeholder="Specialization (e.g. Cardiologist)"
              value={doctorDetails.specialization}
              onChange={handleDoctorDetailsChange}
              required
            />
            <input
              className="w-full p-2 mb-2 border rounded"
              name="experience"
              type="number"
              placeholder="Years of Experience"
              value={doctorDetails.experience}
              onChange={handleDoctorDetailsChange}
              required
            />
            <input
              className="w-full p-2 mb-2 border rounded"
              name="qualifications"
              placeholder="Qualifications (e.g. MBBS, MD)"
              value={doctorDetails.qualifications}
              onChange={handleDoctorDetailsChange}
              required
            />
            <textarea
              className="w-full p-2 mb-2 border rounded"
              name="bio"
              placeholder="Short Bio"
              value={doctorDetails.bio}
              onChange={handleDoctorDetailsChange}
              required
            />
          </div>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}
