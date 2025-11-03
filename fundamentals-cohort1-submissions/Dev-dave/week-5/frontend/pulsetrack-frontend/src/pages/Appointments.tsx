import { useEffect, useState } from "react";
import api from "../lib/api";
import AppointmentForm from "../components/Appointmentform";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Appointment {
  _id: string;
  // doctor can be a populated object, a plain id/string, or null
  doctor: { name: string } | string | null;
  date: string;
  reason: string;
  status: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchAppointments = async () => {
    try {
      if (!token) throw new Error("No auth token");
      setLoading(true);
      const res = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      alert("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAppointmentAdded = () => {
    fetchAppointments();
  };

  return (
    <section className=" px-0 bg-gray-50 min-h-screen">
      <Navbar />

      <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
        Appointments
      </h2>

      <AppointmentForm onAppointmentAdded={handleAppointmentAdded} />

      <div className="max-w-2xl mx-auto space-y-3">
        {loading ? (
          <p className="text-center text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white shadow p-3 rounded border-l-4 border-emerald-500"
            >
              <p className="font-semibold text-gray-800">
                Doctor:{" "}
                {a.doctor
                  ? typeof a.doctor === "string"
                    ? a.doctor
                    : a.doctor.name
                  : "Not assigned"}
              </p>

              <p className="text-gray-600">
                Date: {new Date(a.date).toLocaleString()}
              </p>
              <p className="text-gray-500">Reason: {a.reason}</p>
              <p className="text-sm text-emerald-600 font-medium">
                Status: {a.status}
              </p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </section>
  );
}
