import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const API_URL = import.meta.env.VITE_API_URL;

const ExerciseSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .required('Name is required'),
  category: Yup.string()
    .oneOf(['Bodyweight', 'Weightlifting', 'Cardio', 'Flexibility'], 'Invalid category')
    .required('Category is required'),
  muscle_group: Yup.string()
    .oneOf(['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Full Body'], 'Invalid muscle group')
    .required('Muscle group is required'),
  difficulty: Yup.string()
    .oneOf(['Beginner', 'Intermediate', 'Advanced'], 'Invalid difficulty level')
    .required('Difficulty is required'),
  instructions: Yup.string()
    .min(10, 'Instructions must be at least 10 characters')
    .required('Instructions are required')
});

function ExerciseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [initialValues, setInitialValues] = useState({
    name: '',
    category: 'Bodyweight',
    muscle_group: 'Chest',
    difficulty: 'Beginner',
    instructions: ''
  });

  useEffect(() => {
    if (isEdit) {
      fetchExercise();
    }
  }, [id, isEdit]);

  const fetchExercise = async () => {
    try {
      const response = await fetch(`${API_URL}/exercises/${id}`);
      const exercise = await response.json();
      setInitialValues({
        name: exercise.name,
        category: exercise.category,
        muscle_group: exercise.muscle_group,
        difficulty: exercise.difficulty,
        instructions: exercise.instructions
      });
    } catch (error) {
      console.error('Error fetching exercise:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit ? `${API_URL}/exercises/${id}` : `${API_URL}/exercises`;
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        navigate('/exercises');
      } else {
        console.error('Error saving exercise');
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>{isEdit ? 'Edit Exercise' : 'Add New Exercise'}</h1>
      
      <div className="card">
        <Formik
          initialValues={initialValues}
          validationSchema={ExerciseSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Exercise Name</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">Category</label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className="form-control"
                >
                  <option value="Bodyweight">Bodyweight</option>
                  <option value="Weightlifting">Weightlifting</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Flexibility">Flexibility</option>
                </Field>
                <ErrorMessage name="category" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="muscle_group" className="form-label">Muscle Group</label>
                <Field
                  as="select"
                  id="muscle_group"
                  name="muscle_group"
                  className="form-control"
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Arms">Arms</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Core">Core</option>
                  <option value="Full Body">Full Body</option>
                </Field>
                <ErrorMessage name="muscle_group" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="difficulty" className="form-label">Difficulty</label>
                <Field
                  as="select"
                  id="difficulty"
                  name="difficulty"
                  className="form-control"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </Field>
                <ErrorMessage name="difficulty" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="instructions" className="form-label">Instructions</label>
                <Field
                  as="textarea"
                  id="instructions"
                  name="instructions"
                  className="form-control"
                  rows="4"
                />
                <ErrorMessage name="instructions" component="div" className="error-message" />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Saving...' : (isEdit ? 'Update Exercise' : 'Create Exercise')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/exercises')}
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

export default ExerciseForm;