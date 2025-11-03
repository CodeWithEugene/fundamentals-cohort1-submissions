import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Doctor {
  _id: string;
  name: string;
  specialty: string;
}

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

 

  return (
    <section className=" bg-gray-50 min-h-screen">
        <Navbar />

      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          Meet Our Doctors 👩‍⚕️👨‍⚕️
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border-t-4 border-emerald-500 p-5 text-center"
              >
                <div className="w-20 h-20 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center text-3xl text-emerald-700 font-bold">
                  {doctor.name.charAt(0)}
                </div>

                <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                <p className="text-emerald-600 font-medium">
                  {doctor.specialty || "Specialty not available"}
                </p>

                <button
                  className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                  onClick={() => navigate(`/appointments?doctorId=${doctor._id}`)}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </section>
  );
};

export default Doctors;
