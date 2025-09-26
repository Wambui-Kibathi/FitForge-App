import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

function Exercises({ user }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/exercises`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Exercises data:', data);
      if (Array.isArray(data)) {
        setExercises(data);
      } else {
        console.error('Expected array, got:', data);
        setExercises([]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteExercise = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        await fetch(`${API_URL}/exercises/${id}`, {
          method: 'DELETE',
        });
        fetchExercises();
      } catch (error) {
        console.error('Error deleting exercise:', error);
      }
    }
  };

  const addToProfile = async (exerciseId, type) => {
    try {
      console.log('Adding exercise to profile:', { user_id: user?.id, exercise_id: exerciseId });
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const response = await fetch(`${API_URL}/user-exercises`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          exercise_id: exerciseId,
          personal_record: 0,
          notes: 'Added to my profile'
        }),
      });
      
      console.log('Add exercise response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Exercise added successfully:', result);
        alert('Exercise added to your profile!');
      } else {
        const error = await response.json();
        console.error('Error adding exercise:', error);
        alert(error.error || 'Failed to add exercise to profile');
      }
    } catch (error) {
      console.error('Error adding to profile:', error);
    }
  };

  if (loading) return <div className="loading">Loading exercises...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Exercises</h1>
        <Link to="/exercises/new" className="btn btn-primary">
          <FaPlus /> Add Exercise
        </Link>
      </div>

      {exercises.length === 0 ? (
        <div className="empty-state">
          <h3>No exercises found</h3>
          <p>Build your exercise library by adding your first exercise!</p>
          <Link to="/exercises/new" className="btn btn-primary">
            <FaPlus /> Add Your First Exercise
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {exercises.map(exercise => (
            <div key={exercise.id} className="card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>{exercise.name}</h3>
                <div className="d-flex gap-2">
                  <Link to={`/exercises/edit/${exercise.id}`} className="btn btn-secondary">
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={() => deleteExercise(exercise.id)} 
                    className="btn btn-danger"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <p><strong>Category:</strong> {exercise.category}</p>
              <p><strong>Muscle Group:</strong> {exercise.muscle_group}</p>
              <p><strong>Difficulty:</strong> {exercise.difficulty}</p>
              <p><strong>Instructions:</strong> {exercise.instructions}</p>
              <p><strong>Instructor:</strong> {exercise.instructor?.name}</p>
              <div className="mt-2">
                <button 
                  onClick={() => addToProfile(exercise.id, 'exercise')} 
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

export default Exercises;