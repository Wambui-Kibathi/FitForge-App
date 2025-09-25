import { Link } from 'react-router-dom';
import { FaUsers, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import backgroundImage from '../assets/Landing-image.png';

function Home() {
  return (
    <div>
      <div className="hero" style={{backgroundImage: `url(${backgroundImage})`}}>
        <h1>Welcome to FitForge</h1>
        <p>Your ultimate workout planner and fitness companion</p>
        <Link to="/workouts" className="btn btn-primary">Start Planning</Link>
      </div>
      
      <div className="grid grid-3">
        <div className="card text-center">
          <FaUsers size={48} color="var(--accent-color)" />
          <h3 className="mt-2">Manage Users</h3>
          <p>Create and manage user profiles with different fitness levels</p>
          <Link to="/users" className="btn btn-primary mt-2">View Users</Link>
        </div>
        
        <div className="card text-center">
          <FaDumbbell size={48} color="var(--accent-color)" />
          <h3 className="mt-2">Exercise Library</h3>
          <p>Browse and manage a comprehensive library of exercises</p>
          <Link to="/exercises" className="btn btn-primary mt-2">View Exercises</Link>
        </div>
        
        <div className="card text-center">
          <FaCalendarAlt size={48} color="var(--accent-color)" />
          <h3 className="mt-2">Workout Plans</h3>
          <p>Create custom workout plans tailored to your goals</p>
          <Link to="/workouts" className="btn btn-primary mt-2">View Workouts</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;