import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_URL || 'https://fitforge-app-backend-1.onrender.com';
console.log('API_URL:', API_URL);

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
      console.log('Submitting to:', `${API_URL}${endpoint}`);
      console.log('Data:', values);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        ...(isLogin && { credentials: 'include' }),
        body: JSON.stringify(values),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Response status:', response.status);

      if (response.ok) {
        const user = await response.json();
        console.log('Success:', user);
        
        // If registration, automatically log in the user
        if (!isLogin) {
          console.log('Registration successful, logging in...');
          const loginController = new AbortController();
          const loginTimeoutId = setTimeout(() => loginController.abort(), 10000);
          
          try {
            const loginResponse = await fetch(`${API_URL}/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ email: values.email }),
              signal: loginController.signal
            });
            
            clearTimeout(loginTimeoutId);
            
            if (loginResponse.ok) {
              const loggedInUser = await loginResponse.json();
              console.log('Auto-login successful:', loggedInUser);
              onLogin(loggedInUser);
            } else {
              console.log('Auto-login failed, using registration data');
              onLogin(user);
            }
          } catch (loginError) {
            clearTimeout(loginTimeoutId);
            console.log('Auto-login error, using registration data:', loginError);
            onLogin(user);
          }
        } else {
          onLogin(user);
        }
      } else {
        console.log('Error response status:', response.status);
        if (!isLogin && response.status === 404) {
          // Fallback: try /users endpoint for registration
          console.log('Trying /users endpoint as fallback');
          const fallbackResponse = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
            signal: controller.signal
          });
          
          if (fallbackResponse.ok) {
            const user = await fallbackResponse.json();
            console.log('Fallback success:', user);
            onLogin(user);
            return;
          }
        }
        
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('Error response:', error);
        alert(error.error || (isLogin ? 'Login failed' : 'Registration failed'));
      }
    } catch (error) {
      console.error('Full error:', error);
      if (error.name === 'AbortError') {
        alert('Request timed out. Please check your connection and try again.');
      } else {
        alert('Network error: ' + error.message);
      }
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