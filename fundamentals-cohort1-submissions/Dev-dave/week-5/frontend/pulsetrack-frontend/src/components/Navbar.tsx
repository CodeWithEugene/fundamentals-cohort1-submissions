import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-emerald-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="font-bold text-2xl">PulseTrack 💚</h1>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>

      
        <div className="hidden md:flex space-x-5">
          <Link to="/Home" className="hover:text-gray-200">Home</Link>
          <Link to="/Activities" className="hover:text-gray-200">Activities</Link>
          <Link to="/Appointments" className="hover:text-gray-200">Appointments</Link>
          <Link to="/Doctors" className="hover:text-gray-200">Doctors</Link>
          <Link to="/Reports" className="hover:text-gray-200">Reports</Link>
          <Link
            to="/Logout"
            className="bg-white text-emerald-600 px-3 py-1 rounded font-medium hover:bg-gray-100"
          >
            Logout
          </Link>
        </div>
      </div>

    
      {menuOpen && (
        <div className="md:hidden mt-3 space-y-2 flex flex-col items-center">
          <Link to="/" className="hover:text-gray-200">Home</Link>
          <Link to="/Activities" className="hover:text-gray-200">Activities</Link>
          <Link to="/Appointments" className="hover:text-gray-200">Appointments</Link>
          <Link to="/Doctors" className="hover:text-gray-200">Doctors</Link>
          <Link to="/Reports" className="hover:text-gray-200">Reports</Link>
          <Link
            to="/Logout"
            className="bg-white text-emerald-600 px-3 py-1 rounded font-medium hover:bg-gray-100"
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
}
