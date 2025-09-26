import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

function Users({ user: currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Users data:', data);
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Expected array, got:', data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE',
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Users</h1>
        {currentUser?.is_admin && (
          <Link to="/users/new" className="btn btn-primary">
            <FaPlus /> Add User
          </Link>
        )}
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <h3>No users found</h3>
          {currentUser?.is_admin ? (
            <>
              <p>Get started by adding your first user!</p>
              <Link to="/users/new" className="btn btn-primary">
                <FaPlus /> Add Your First User
              </Link>
            </>
          ) : (
            <p>No users to display at the moment.</p>
          )}
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                {currentUser?.is_admin && <th>Email</th>}
                <th>Fitness Level</th>
                <th>Created At</th>
                {currentUser?.is_admin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  {currentUser?.is_admin && <td>{user.email}</td>}
                  <td>{user.fitness_level}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  {currentUser?.is_admin && (
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/users/edit/${user.id}`} className="btn btn-secondary">
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => deleteUser(user.id)} 
                          className="btn btn-danger"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;