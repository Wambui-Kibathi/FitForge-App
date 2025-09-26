# FitForge Workout Planner

A full-stack fitness tracking application built with React frontend and Flask backend. Features user authentication, personal workout tracking, and a comprehensive exercise library with a modern dark theme and responsive design.

## Features

- **User Authentication**: Register and login system with session management
- **User Profiles**: Personal profile pages with account details and statistics
- **User Management**: View all users in the community (Formula 1 drivers)
- **Exercise Library**: Comprehensive database of exercises with categories, muscle groups, and difficulty levels
- **Workout Planning**: Create custom workout plans with exercises, sets, reps, and weights
- **Personal Collection**: Add existing exercises and workouts to personal profile
- **Personal Records**: Track personal bests and notes for exercises
- **Profile Management**: Remove exercises and workouts from personal collection
- **Dark/Light Theme**: Toggle between dark and light themes (dark mode default)
- **Responsive Design**: Mobile-first design with hamburger menu navigation
- **Modern UI**: Dark grey/black theme with green accent colors

## Tech Stack

### Frontend
- React 19 (latest version)
- React Router DOM (client-side routing)
- React Icons (icon library)
- Formik & Yup (form handling and validation)
- Vite (fast build tool and dev server)
- CSS3 with CSS Variables (theming)

### Backend
- Flask 3.0.3
- Flask-RESTful (RESTful API architecture)
- SQLAlchemy with SQLAlchemy-Serializer (automatic JSON serialization)
- Flask-Migrate (database migrations)
- Flask-CORS (cross-origin requests)
- SQLite database
- Session-based authentication
- Pipenv (dependency management)

## Project Structure

```
FitForge-Workout-Planner/
├── client-side/          # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components (Navbar, Auth, Forms)
│   │   ├── pages/        # Page components (Home, Users, Exercises, etc.)
│   │   ├── assets/       # Images and static files
│   │   ├── App.jsx       # Main app component with routing
│   │   ├── App.css       # Global styles and theme variables
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
├── server/               # Flask backend
│   ├── app.py           # Main Flask application
│   ├── models.py        # Database models
│   ├── seed.py          # Database seeding
│   ├── migrations/      # Database migrations
│   ├── Pipfile          # Python dependencies
│   ├── Pipfile.lock     # Locked dependencies
│   └── .venv/           # Virtual environment (pipenv)
└── README.md
```

## Database Models

### User
- id, name, email, fitness_level, created_at
- One-to-many with Workout
- Many-to-many with Exercise (through UserExercise)

### Exercise
- id, name, category, muscle_group, difficulty, instructions, created_at
- One-to-many with WorkoutExercise
- Many-to-many with User (through UserExercise)

### Workout
- id, name, description, duration, user_id, created_at
- Belongs to User
- One-to-many with WorkoutExercise

### WorkoutExercise (Many-to-many association)
- id, workout_id, exercise_id, sets, reps, weight, rest_time
- User submittable attributes: weight, rest_time

### UserExercise (Many-to-many association)
- id, user_id, exercise_id, personal_record, notes, created_at
- User submittable attributes: personal_record, notes

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install pipenv if not already installed:
   ```bash
   pip install pipenv
   ```

3. Install dependencies:
   ```bash
   pipenv install
   ```

4. Run database migrations:
   ```bash
   pipenv run flask db upgrade
   ```

5. Seed the database:
   ```bash
   pipenv run python seed.py
   ```

6. Start the Flask server:
   ```bash
   pipenv run python app.py
   ```
   Or use the start script:
   ```bash
   ./start.sh
   ```

The backend will run on `http://localhost:5001` (changed from 5000 to avoid macOS AirPlay conflicts)

### Frontend Setup

1. Navigate to the client-side directory:
   ```bash
   cd client-side
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## User Workflow

1. **Landing**: App opens with login/register screen (dark theme by default)
2. **Authentication**: Users must register (name, email, fitness level) or login to access features
3. **Dashboard**: Once authenticated, users can navigate through all sections
4. **Community Library**: Browse F1 drivers' profiles, exercise library, and workout plans
5. **Personal Collection**: Add existing exercises/workouts to personal profile with "Add to My Profile" buttons
6. **Personal Profile**: Private profile showing account details, personal records, and saved workouts
7. **Profile Management**: Edit profile information, add/remove personal exercises and workouts

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `GET /current-user` - Get current logged-in user
- `GET /my-exercises` - Get current user's personal exercises
- `GET /my-workouts` - Get current user's personal workouts

### Users
- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /users/<id>` - Get user by ID
- `PATCH /users/<id>` - Update user
- `DELETE /users/<id>` - Delete user

### Exercises
- `GET /exercises` - Get all exercises
- `POST /exercises` - Create new exercise
- `GET /exercises/<id>` - Get exercise by ID
- `PATCH /exercises/<id>` - Update exercise
- `DELETE /exercises/<id>` - Delete exercise

### Workouts
- `GET /workouts` - Get all workouts
- `POST /workouts` - Create new workout
- `GET /workouts/<id>` - Get workout by ID
- `PATCH /workouts/<id>` - Update workout
- `DELETE /workouts/<id>` - Delete workout

### Workout Exercises
- `POST /workout-exercises` - Add exercise to workout
- `PATCH /workout-exercises/<id>` - Update workout exercise

### User Exercises
- `GET /user-exercises` - Get all user exercises
- `POST /user-exercises` - Create user exercise record
- `DELETE /user-exercises/<id>` - Remove exercise from user's profile

## Form Validation

All forms use Formik with Yup validation:

- **Data Type Validation**: Email format, number ranges
- **String/Number Format Validation**: Min/max lengths, required fields
- **Custom Validation**: Fitness levels, categories, muscle groups

## Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `pip install pipenv && pipenv install --system --deploy`
3. Set start command: `python app.py`
4. Add environment variables as needed

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set root directory to `client-side`
3. Build command: `npm run build`
4. Output directory: `dist`

## Key Features Implemented

### **Core Requirements (100% Complete)**
**Flask API backend with React frontend**
**5 database models** with proper relationships
**One-to-many relationships** (User→Workout, Exercise→WorkoutExercise)
**Many-to-many relationships** (User↔Exercise, Workout↔Exercise)
**User submittable attributes** in association models
**Full CRUD operations** for all resources
**RESTful API** with proper HTTP methods
**Form validation** with Formik and Yup
**Client-side routing** (6+ routes)
**Responsive navigation** with hamburger menu

### **Advanced Features (Bonus)**
**User authentication system** (register/login/logout)
**Session management** with Flask sessions
**Personal user profiles** with edit functionality
**Personal collection system** (add/remove exercises and workouts)
**Community content sharing** (browse other users' content)
**Database migrations** with Flask-Migrate
**Modern tech stack** (Flask-RESTful, SQLAlchemy-Serializer)
**Dark/Light theme toggle** (dark default with green accents)
**Mobile-first responsive design** with hamburger menu
**Professional UI/UX** with dark grey/black theme
**Formula 1 themed content** with real driver profiles
**Comprehensive error handling** and user feedback
**Data validation** on both frontend and backend

### **Technical Excellence**
**Separated concerns** (models.py, proper component structure)
**Environment management** with Pipenv
**CORS configuration** for secure API access
**Proper HTTP status codes** and error responses
**Clean, maintainable code** with consistent styling
**Comprehensive documentation**

## Performance & Scalability

- **Efficient API**: RESTful endpoints with proper HTTP methods
- **Optimized Frontend**: React hooks for state management
- **Database**: SQLite with proper indexing and relationships
- **Responsive**: Mobile-first design with CSS Grid and Flexbox
- **Modern Build**: Vite for fast development and optimized production builds

## Future Enhancements

- **Workout Tracking**: Timer functionality for active workouts
- **Progress Charts**: Visual representation of fitness progress
- **Social Features**: Follow other users and share workouts
- **Exercise Videos**: Integration with exercise demonstration videos
- **Mobile App**: React Native version for iOS/Android
- **Advanced Analytics**: Detailed workout and progress analytics
