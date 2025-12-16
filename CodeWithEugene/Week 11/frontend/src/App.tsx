import { Link, Route, Routes } from 'react-router-dom';
import PaymentsPage from './pages/PaymentsPage';
import StatsPage from './pages/StatsPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>PayVerse Dashboard</h1>
          <nav>
            <Link to="/">Payments</Link>
            <Link to="/stats">Stats</Link>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<PaymentsPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
