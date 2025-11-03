import { useEffect, useState } from "react";
import api from "../lib/api";
import ActivityForm from "../components/Activityform";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


interface Activity {
  _id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}
export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();


  const fetchActivities = async () => {
    try {
      if (!token) throw new Error("No auth token");
      setLoading(true);
      const res = await api.get("/activities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      alert("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Load activities when the page first mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  //Refresh list after a new activity is added
  const handleActivityAdded = () => {
    fetchActivities();
  };

  return (
    <section className=" bg-gray-50 min-h-screen">
        <Navbar />

      <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
        Your Activities
      </h2>

      {/* Form to add new activity */}
      <ActivityForm onActivityAdded={handleActivityAdded} />

    
      <div className="max-w-2xl mx-auto space-y-3">
        {loading ? (
          <p className="text-center text-gray-500">Loading activities...</p>
        ) : activities.length === 0 ? (
          <p className="text-center text-gray-500">No activities found.</p>
        ) : (
          activities.map((a) => (
            <div
              key={a._id}
              className="bg-white shadow p-3 rounded border-l-4 border-emerald-500"
            >
              <p className="font-semibold text-gray-800">{a.type}</p>
              <p className="text-gray-600">{a.duration} mins</p>
              <p className="text-gray-500">
                {a.caloriesBurned} kcal burned on{" "}
                {new Date(a.date).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <Footer />
    </section>
  );
}
