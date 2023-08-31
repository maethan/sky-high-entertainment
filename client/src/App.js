import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Domestic from './components/Domestic';
import International from './components/International';
import Movies from './components/Movies';
import Airports from './components/Airports';
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'

// Define the pages of our site
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/domestic" element={<Domestic />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/airports" element={<Airports />} />
        <Route path="/international" element={<International />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>Not found.</div>} />
      </Routes>
    </div>
  );
}

export default App;
