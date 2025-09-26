import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_URL;

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  fitness_level: Yup.string()
    .oneOf(['Beginner', 'Intermediate', 'Advanced'], 'Invalid fitness level')
    .required('Fitness level is required')
});

function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    fitness_level: 'Beginner'
  });

  useEffect(() => {
    if (isEdit) {
      fetchUser();
    }
  }, [id, isEdit]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      const user = await response.json();
      setInitialValues({
        name: user.name,
        email: user.email,
        fitness_level: user.fitness_level
      });
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit ? `${API_URL}/users/${id}` : `${API_URL}/users`;
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/users');
      } else {
        console.error('Error saving user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit User' : 'Add New User'}</h1>
      
      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={UserSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="fitness_level" className="form-label">Fitness Level</label>
                <Field
                  as="select"
                  id="fitness_level"
                  name="fitness_level"
                  className="form-control"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Field>
                <ErrorMessage name="fitness_level" component="div" className="error-message" />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/users')}
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

export default UserForm;