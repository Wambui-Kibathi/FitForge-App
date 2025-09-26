import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  fitness_level: Yup.string().required('Fitness level is required')
});

function EditProfile({ user, onUpdate, onCancel }) {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUpdate(updatedUser);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h3>Edit Profile</h3>
      <Formik
        initialValues={{
          name: user.name,
          email: user.email,
          fitness_level: user.fitness_level
        }}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label className="form-label">Name</label>
              <Field name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Level</label>
              <Field as="select" name="fitness_level" className="form-control">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </Field>
              <ErrorMessage name="fitness_level" component="div" className="error-message" />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
              <button type="button" onClick={onCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditProfile;