import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaClock } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

function Workouts({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Workouts data:', data);
      if (Array.isArray(data)) {
        setWorkouts(data);
      } else {
        console.error('Expected array, got:', data);
        setWorkouts([]);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await fetch(`${API_URL}/workouts/${id}`, {
          method: 'DELETE',
        });
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const addWorkoutToProfile = async (workoutId) => {
    try {
      const checkResponse = await fetch(`${API_URL}/my-workouts`, {
        credentials: 'include'
      });
      
      if (checkResponse.ok) {
        const userWorkouts = await checkResponse.json();
        const originalWorkout = workouts.find(w => w.id === workoutId);
    
        const alreadyHas = userWorkouts.some(w => 
          w.name === originalWorkout.name || 
          w.name === `${originalWorkout.name} (My Copy)`
        );
        
        if (alreadyHas) {
          alert('You already have this workout in your profile!');
          return;
        }
      }
    
      const originalWorkout = workouts.find(w => w.id === workoutId);
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `${originalWorkout.name} (My Copy)`,
          description: originalWorkout.description,
          duration: originalWorkout.duration,
          instructor_id: originalWorkout.instructor_id
        }),
      });
      
      if (response.ok) {
        const newWorkout = await response.json();
        console.log('Workout added:', newWorkout);
        alert('Workout added to your profile!');
      } else {
        const error = await response.json();
        console.error('Error adding workout:', error);
        alert(error.error || 'Failed to add workout to profile');
      }
    } catch (error) {
      console.error('Error adding workout to profile:', error);
    }
  };

  if (loading) return <div className="loading">Loading workouts...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Workouts</h1>
        <Link to="/workouts/new" className="btn btn-primary">
          <FaPlus /> Add Workout
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="empty-state">
          <h3>No workouts found</h3>
          <p>Start your fitness journey by creating your first workout plan!</p>
          <Link to="/workouts/new" className="btn btn-primary">
            <FaPlus /> Create Your First Workout
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {workouts.map(workout => (
            <div key={workout.id} className="card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>{workout.name}</h3>
                <div className="d-flex gap-2">
                  <Link to={`/workouts/edit/${workout.id}`} className="btn btn-secondary">
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => deleteWorkout(workout.id)} 
                    className="btn btn-danger"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p>{workout.description}</p>
              <div className="d-flex align-items-center gap-2 mt-2">
                <FaClock />
                <span>{workout.duration} minutes</span>
              </div>
              <p><strong>Instructor:</strong> {workout.instructor?.name}</p>
              {workout.workout_exercises && workout.workout_exercises.length > 0 && (
                <div className="mt-2">
                  <strong>Exercises:</strong>
                  <ul>
                    {workout.workout_exercises.map(we => (
                      <li key={we.id}>
                        {we.exercise.name} - {we.sets} sets x {we.reps} reps
                        {we.weight && ` @ ${we.weight}lbs`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2">
                <button 
                  onClick={() => addWorkoutToProfile(workout.id)} 
                  className="btn btn-success"
                >
                  Add to My Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;