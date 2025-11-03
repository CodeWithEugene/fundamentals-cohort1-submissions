import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Users from "./pages/User";
import Transactions from "./pages/Transaction";

function App() {
  return (
    <Router>
      <nav className="bg-blue-600 text-white p-3 flex gap-4">
        <Link to="/" className="hover:underline">
          Users
        </Link>
        <Link to="/transactions" className="hover:underline">
          Transactions
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;
