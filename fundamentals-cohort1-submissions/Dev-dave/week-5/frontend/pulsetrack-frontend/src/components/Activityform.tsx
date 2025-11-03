import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/authContext";

export interface ActivityFormProps {
  onActivityAdded: (newActivity: any) => void; // callback to refresh list after adding activity
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onActivityAdded }) => {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload on form submit
    try {
      if (!token) throw new Error("No auth token found");

      setLoading(true);


      const response = await api.post( "/activities",
        {
          type,
          duration: Number(duration),
          caloriesBurned: Number(caloriesBurned),
          date,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Notify parent that a new activity was added
      onActivityAdded(response.data);

      // Reset form fields
      setType("");
      setDuration("");
      setCaloriesBurned("");
      setDate("");
    } catch (error) {
      console.error("Failed to add activity:", error);
      alert("Failed to add activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow p-5 rounded mb-8 border-t-4 border-emerald-500">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 text-center">
        Add New Activity
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Activity Type
          </label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. Running, Cycling..."
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration (mins)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 45"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Calories Burned
          </label>
          <input
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
            placeholder="e.g. 300"
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded font-semibold hover:bg-emerald-700 transition"
        >
          {loading ? "Saving..." : "Add Activity"}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;
