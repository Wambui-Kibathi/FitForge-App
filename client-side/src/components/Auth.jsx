import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required')
});

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name too short').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  fitness_level: Yup.string().required('Fitness level is required')
});

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const user = await response.json();
        onLogin(user);
      } else {
        const error = await response.json();
        alert(error.error || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <div className="card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        <Formik
          initialValues={{ name: '', email: '', fitness_level: 'Beginner' }}
          validationSchema={isLogin ? LoginSchema : RegisterSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <Field name="name" className="form-control" />
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Fitness Level</label>
                  <Field as="select" name="fitness_level" className="form-control">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Field>
                  <ErrorMessage name="fitness_level" component="div" className="error-message" />
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                {isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-3">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="btn" 
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', textDecoration: 'underline' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;