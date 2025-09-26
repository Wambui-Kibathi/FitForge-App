import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const WorkoutSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters'),
  duration: Yup.number()
    .min(5, 'Duration must be at least 5 minutes')
    .max(300, 'Duration must be less than 300 minutes')
    .required('Duration is required'),
  user_id: Yup.number()
    .required('User is required')
});

function WorkoutForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [users, setUsers] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    duration: 30,
    user_id: ''
  });

  useEffect(() => {
    fetchUsers();
    if (isEdit) {
      fetchWorkout();
    }
  }, [id, isEdit]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/users');
      const data = await response.json();
      setUsers(data);
      if (!isEdit && data.length > 0) {
        setInitialValues(prev => ({ ...prev, user_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchWorkout = async () => {
    try {
      const response = await fetch(`http://localhost:5001/workouts/${id}`);
      const workout = await response.json();
      setInitialValues({
        name: workout.name,
        description: workout.description || '',
        duration: workout.duration,
        user_id: workout.user_id
      });
    } catch (error) {
      console.error('Error fetching workout:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit ? `http://localhost:5001/workouts/${id}` : 'http://localhost:5001/workouts';
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/workouts');
      } else {
        console.error('Error saving workout');
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Workout' : 'Add New Workout'}</h1>
      
      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={WorkoutSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Workout Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="form-control"
                  rows="3"
                />
                <ErrorMessage name="description" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                <Field
                  type="number"
                  id="duration"
                  name="duration"
                  className="form-control"
                  min="5"
                  max="300"
                />
                <ErrorMessage name="duration" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="user_id" className="form-label">User</label>
                <Field
                  as="select"
                  id="user_id"
                  name="user_id"
                  className="form-control"
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.fitness_level})
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="user_id" component="div" className="error-message" />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Workout' : 'Create Workout')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/workouts')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default WorkoutForm;