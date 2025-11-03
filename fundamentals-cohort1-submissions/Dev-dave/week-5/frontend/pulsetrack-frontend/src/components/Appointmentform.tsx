import { useState, useEffect } from "react";
import api from "../lib/api";
import { useAuth } from "../context/authContext";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

export interface AppointmentFormProps {
  onAppointmentAdded: (newAppointment: any) => void;
  preselectedDoctorId?: string; // optional: when navigating from Doctors page
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onAppointmentAdded,
  preselectedDoctorId,
}) => {
  const [doctor, setDoctor] = useState(preselectedDoctorId || "");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { token } = useAuth();

  // fetch doctors for dropdown
  useEffect(() => {
    api
      .get("/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Failed to load doctors:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) throw new Error("No auth token");
      if (!doctor) throw new Error("Please select a doctor");
      setLoading(true);

      const response = await api.post(
        "/appointments",
        { doctor, date, reason }, // doctor is now the _id
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onAppointmentAdded(response.data);
      setDoctor("");
      setDate("");
      setReason("");
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error("Failed to create appointment:", err);
      alert("Failed to create appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-5 rounded mb-8 border-t-4 border-emerald-500">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">
        Book New Appointment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Doctor
          </label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Appointment Date
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Routine check-up"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-700 transition"
        >
          {loading ? "Saving..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
