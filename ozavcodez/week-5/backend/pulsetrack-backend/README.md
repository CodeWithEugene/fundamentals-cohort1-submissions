# PulseTrack Backend API

A comprehensive health monitoring backend built with Node.js, Express, and MongoDB. This API provides full CRUD operations for managing users, health activities, meals, doctor appointments, and health reports.

## Features

- **User Management** - Create and manage user profiles with health metrics
- **Activity Tracking** - Log physical activities with duration, calories, and intensity
- **Meal Logging** - Record meals with nutritional information
- **Doctor Management** - Maintain a database of healthcare providers
- **Appointment Scheduling** - Book and manage doctor appointments
- **Health Reports** - Generate and store health reports linked to appointments
- **Comprehensive Validation** - Input validation and error handling across all endpoints
- **RESTful API** - Standard HTTP methods and status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: express-validator
- **Security**: bcryptjs, jsonwebtoken
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-backend-repo-url>
   cd pulsetrack-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Edit `.env` and add your configuration:
   \`\`\`
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pulsetrack
   NODE_ENV=development
   \`\`\`

4. **Start the server**
   \`\`\`bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

The server will start on `http://localhost:5000`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Meals
- `GET /api/meals` - Get all meals
- `GET /api/meals/:id` - Get meal by ID
- `POST /api/meals` - Create new meal
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

## Database Schema

### User
\`\`\`javascript
{
  name: String (required),
  email: String (required, unique),
  age: Number,
  weight: Number,
  height: Number,
  bloodType: String,
  activities: [ObjectId] (references Activity),
  meals: [ObjectId] (references Meal),
  appointments: [ObjectId] (references Appointment),
  createdAt: Date
}
\`\`\`

### Activity
\`\`\`javascript
{
  userId: ObjectId (required, references User),
  type: String (required),
  duration: Number (required),
  calories: Number,
  intensity: String,
  date: Date,
  createdAt: Date
}
\`\`\`

### Meal
\`\`\`javascript
{
  userId: ObjectId (required, references User),
  name: String (required),
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  date: Date,
  createdAt: Date
}
\`\`\`

### Doctor
\`\`\`javascript
{
  name: String (required),
  specialty: String (required),
  email: String,
  phone: String,
  hospital: String,
  appointments: [ObjectId] (references Appointment),
  createdAt: Date
}
\`\`\`

### Appointment
\`\`\`javascript
{
  userId: ObjectId (required, references User),
  doctorId: ObjectId (required, references Doctor),
  date: Date (required),
  time: String,
  reason: String,
  status: String (pending, completed, cancelled),
  reports: [ObjectId] (references Report),
  createdAt: Date
}
\`\`\`

### Report
\`\`\`javascript
{
  appointmentId: ObjectId (required, references Appointment),
  diagnosis: String,
  prescription: String,
  notes: String,
  followUpDate: Date,
  createdAt: Date
}
\`\`\`

## Testing with Postman

1. Import the `postman-collection.json` file into Postman
2. Set up the environment variables in Postman:
   - `base_url`: http://localhost:5000
   - `user_id`: (will be populated after creating a user)
   - `doctor_id`: (will be populated after creating a doctor)
3. Run the requests in the collection to test all endpoints

See `POSTMAN_SETUP.md` for detailed Postman setup instructions.

## Error Handling

The API returns standardized error responses:

\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
\`\`\`

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Project Structure

\`\`\`
pulsetrack-backend/
├── models/
│   ├── User.js
│   ├── Activity.js
│   ├── Meal.js
│   ├── Doctor.js
│   ├── Appointment.js
│   └── Report.js
├── routes/
│   ├── users.js
│   ├── activities.js
│   ├── meals.js
│   ├── doctors.js
│   ├── appointments.js
│   └── reports.js
├── middleware/
│   ├── validation.js
│   └── errorHandler.js
├── server.js
├── .env.example
├── package.json
└── README.md
\`\`\`

## Development

- Use `npm run dev` to start the development server with auto-reload
- The server uses nodemon for automatic restart on file changes
- All routes are prefixed with `/api`


## License

MIT

## Support


