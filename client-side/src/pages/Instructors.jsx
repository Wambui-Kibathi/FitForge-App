import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

function Instructors({ user: currentUser }) {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch(`${API_URL}/instructors`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setInstructors(data);
      } else {
        setInstructors([]);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteInstructor = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await fetch(`${API_URL}/instructors/${id}`, {
          method: 'DELETE',
        });
        fetchInstructors();
      } catch (error) {
        console.error('Error deleting instructor:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading instructors...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Instructors</h1>
        {currentUser?.is_admin && (
          <Link to="/instructors/new" className="btn btn-primary">
            <FaPlus /> Add Instructor
          </Link>
        )}
      </div>

      {instructors.length === 0 ? (
        <div className="empty-state">
          <h3>No instructors found</h3>
          {currentUser?.is_admin ? (
            <>
              <p>Get started by adding your first instructor!</p>
              <Link to="/instructors/new" className="btn btn-primary">
                <FaPlus /> Add Your First Instructor
              </Link>
            </>
          ) : (
            <p>No instructors available at the moment.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-2">
          {instructors.map(instructor => (
            <div key={instructor.id} className="card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3>{instructor.name}</h3>
                {currentUser?.is_admin && (
                  <div className="d-flex gap-2">
                    <Link to={`/instructors/edit/${instructor.id}`} className="btn btn-secondary">
                      <FaEdit />
                    </Link>
                    <button 
                      onClick={() => deleteInstructor(instructor.id)} 
                      className="btn btn-danger"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <p><strong>Specialty:</strong> {instructor.specialty}</p>
              <p><strong>Bio:</strong> {instructor.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Instructors;