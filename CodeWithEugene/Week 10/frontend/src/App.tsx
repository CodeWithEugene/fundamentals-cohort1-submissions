import { Routes, Route, Link } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>📋 Real-time Task Manager</h1>
          <nav>
            <Link to="/">Tasks</Link>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<TasksPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;





