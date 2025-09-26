import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Home from './pages/Home';
import Users from './pages/Users';
import Instructors from './pages/Instructors';
import Exercises from './pages/Exercises';
import Workouts from './pages/Workouts';
import UserForm from './components/UserForm';
import ExerciseForm from './components/ExerciseForm';
import WorkoutForm from './components/WorkoutForm';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!user) {
    return (
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users user={user} />} />
            <Route path="/users/new" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="/instructors" element={<Instructors user={user} />} />
            <Route path="/exercises" element={<Exercises user={user} />} />
            <Route path="/exercises/new" element={<ExerciseForm />} />
            <Route path="/exercises/edit/:id" element={<ExerciseForm />} />
            <Route path="/workouts" element={<Workouts user={user} />} />
            <Route path="/workouts/new" element={<WorkoutForm />} />
            <Route path="/workouts/edit/:id" element={<WorkoutForm />} />
            <Route path="/profile" element={<Profile user={user} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;