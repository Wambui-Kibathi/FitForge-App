import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaDumbbell, FaTrophy } from 'react-icons/fa';
import EditProfile from '../components/EditProfile';

function Profile({ user }) {
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [userExercises, setUserExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [workoutsRes, exercisesRes] = await Promise.all([
        fetch('http://localhost:5001/my-workouts', { credentials: 'include' }),
        fetch('http://localhost:5001/my-exercises', { credentials: 'include' })
      ]);

      if (workoutsRes.ok && exercisesRes.ok) {
        const workoutsData = await workoutsRes.json();
        const exercisesData = await exercisesRes.json();

        setUserWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setUserExercises(Array.isArray(exercisesData) ? exercisesData : []);
      } else {
        console.error('Failed to fetch user data');
        setUserWorkouts([]);
        setUserExercises([]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    setIsEditing(false);
  };

  const removeExercise = async (userExerciseId) => {
    if (window.confirm('Remove this exercise from your profile?')) {
      try {
        const response = await fetch(`http://localhost:5001/user-exercises/${userExerciseId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          fetchUserData(); // Refresh data
        } else {
          alert('Failed to remove exercise');
        }
      } catch (error) {
        console.error('Error removing exercise:', error);
      }
    }
  };

  const removeWorkout = async (workoutId) => {
    if (window.confirm('Remove this workout from your profile?')) {
      try {
        const response = await fetch(`http://localhost:5001/workouts/${workoutId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          fetchUserData(); // Refresh data
        } else {
          alert('Failed to remove workout');
        }
      } catch (error) {
        console.error('Error removing workout:', error);
      }
    }
  };

  if (!currentUser) return <div className="empty-state">User not found</div>;

  if (isEditing) {
    return (
      <div>
        <h1>Edit Profile</h1>
        <EditProfile 
          user={currentUser} 
          onUpdate={handleUpdateProfile}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <h1>My Profile</h1>
      
      <div className="grid grid-2">
        <div className="card">
          <div className="d-flex align-items-center mb-3">
            <FaUser size={48} color="var(--accent-color)" />
            <div style={{ marginLeft: '1rem' }}>
              <h2>{currentUser.name}</h2>
              <p>{currentUser.email}</p>
            </div>
          </div>
          <p><strong>Fitness Level:</strong> {currentUser.fitness_level}</p>
          <p><strong>Member Since:</strong> {new Date(currentUser.created_at).toLocaleDateString()}</p>
          <button 
            className="btn btn-primary mt-2"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        <div className="card">
          <h3><FaDumbbell /> Workout Stats</h3>
          <div className="mt-2">
            <p><strong>Total Workouts:</strong> {userWorkouts.length}</p>
            <p><strong>Total Exercise Records:</strong> {userExercises.length}</p>
            <p><strong>Favorite Muscle Group:</strong> Chest</p>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <h3><FaTrophy /> Personal Records</h3>
        {userExercises.length === 0 ? (
          <p>No personal records yet. Start tracking your progress!</p>
        ) : (
          <div className="grid grid-3">
            {userExercises.map(ue => (
              <div key={ue.id} className="card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4>{ue.exercise.name}</h4>
                  <button 
                    onClick={() => removeExercise(ue.id)} 
                    className="btn btn-danger"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem'}}
                  >
                    Remove
                  </button>
                </div>
                <p><strong>PR:</strong> {ue.personal_record}lbs</p>
                <p><strong>Notes:</strong> {ue.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card mt-3">
        <h3>My Workouts</h3>
        {userWorkouts.length === 0 ? (
          <p>No workouts created yet.</p>
        ) : (
          <div className="grid grid-2">
            {userWorkouts.map(workout => (
              <div key={workout.id} className="card">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4>{workout.name}</h4>
                  <button 
                    onClick={() => removeWorkout(workout.id)} 
                    className="btn btn-danger"
                    style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem'}}
                  >
                    Remove
                  </button>
                </div>
                <p>{workout.description}</p>
                <p><strong>Duration:</strong> {workout.duration} minutes</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;