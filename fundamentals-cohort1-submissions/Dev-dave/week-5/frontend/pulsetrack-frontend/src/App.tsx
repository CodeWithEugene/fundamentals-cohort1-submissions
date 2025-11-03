import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Activities from './pages/Activities';
import Appointments from './pages/Appointments';
import Doctors from './pages/Doctors';
import Logout from './pages/logout';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Activities" element={<Activities />} />
      <Route path="/Appointments" element={<Appointments />} />
      <Route path="/Doctors" element={<Doctors />} />
      <Route path="/Logout" element={<Logout />} />
    </Routes>
  );
}
export default App;