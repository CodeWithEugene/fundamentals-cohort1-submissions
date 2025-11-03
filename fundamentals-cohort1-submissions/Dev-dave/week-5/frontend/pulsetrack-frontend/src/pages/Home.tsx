import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-teal-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-teal-700 mb-4">
          Welcome to <span className="text-teal-600">PulseTrack</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mb-8">
          Your personal wellness companion. Manage your activities, track
          appointments, connect with doctors, and monitor your progress — all in one place.
        </p>

        {/* Quick Navigation Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-3xl">
          <Link
            to="/dashboard"
            className="p-6 bg-white shadow-md rounded-2xl hover:bg-teal-100 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-teal-700 mb-2">Dashboard</h2>
            <p className="text-gray-500 text-sm">
              View your summary, progress, and personal stats.
            </p>
          </Link>

          <Link
            to="/Activities"
            className="p-6 bg-white shadow-md rounded-2xl hover:bg-teal-100 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-teal-700 mb-2">Activities</h2>
            <p className="text-gray-500 text-sm">
              Track your daily workouts and health routines.
            </p>
          </Link>

          <Link
            to="/appointments"
            className="p-6 bg-white shadow-md rounded-2xl hover:bg-teal-100 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-teal-700 mb-2">Appointments</h2>
            <p className="text-gray-500 text-sm">
              Book and manage appointments easily.
            </p>
          </Link>

          <Link
            to="/doctors"
            className="p-6 bg-white shadow-md rounded-2xl hover:bg-teal-100 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-teal-700 mb-2">Doctors</h2>
            <p className="text-gray-500 text-sm">
              Connect with trusted medical professionals.
            </p>
          </Link>

          <Link
            to="/reports"
            className="p-6 bg-white shadow-md rounded-2xl hover:bg-teal-100 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-teal-700 mb-2">Reports</h2>
            <p className="text-gray-500 text-sm">
              View your health reports and progress over time.
            </p>
          </Link>

          <Link
            to="/"
            className="p-6 bg-white shadow-md rounded-2xl hover:bg-teal-100 transition duration-200"
          >
            <h2 className="text-xl font-semibold text-teal-700 mb-2">Log Out</h2>
            <p className="text-gray-500 text-sm">
              Exit your session securely.
            </p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
