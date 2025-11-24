# PulseTrack Frontend

A modern React-Vite application for health monitoring and tracking. This frontend gives a clean interface for managing users, activities, meals, doctor appointments, and health reports.

## Features

- **Dashboard** - Overview of health metrics and recent activities
- **User Management** - Create and manage user profiles
- **Activity Tracking** - Log and view physical activities
- **Meal Logging** - Record and track meals
- **Doctor Management** - Browse and manage healthcare providers
- **Appointment Scheduling** - Book and manage appointments
- **Health Reports** - View and manage health reports
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Error Handling** - User-friendly error messages and loading states

## Tech Stack

- **Framework**: React 19.2
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone < https://github.com/ozavcodez/pulsetrack-frontend.git>
   cd pulsetrack-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

The application will open at `http://localhost:5173`

## Configuration

### API Base URL

The frontend is configured to connect to the backend at `http://localhost:5000`. If your backend is running on a different URL, update the API calls in the components.

Default API endpoint:
\`\`\`javascript
const API_BASE_URL = 'http://localhost:5000/api';
\`\`\`

## Project Structure

\`\`\`
pulsetrack-frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx
│   │   ├── UserForm.tsx
│   │   ├── ActivityForm.tsx
│   │   ├── MealForm.tsx
│   │   ├── DoctorForm.tsx
│   │   ├── AppointmentForm.tsx
│   │   └── ReportForm.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Activities.tsx
│   │   ├── Meals.tsx
│   │   ├── Doctors.tsx
│   │   ├── Appointments.tsx
│   │   └── Reports.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
\`\`\`

## Available Pages

### Dashboard
- Overview of health metrics
- Recent activities summary
- Quick access to main features

### Users
- View all users
- Create new user profiles
- Edit user information
- Delete users

### Activities
- Log physical activities
- View activity history
- Track calories burned
- Filter by activity type

### Meals
- Log meals and snacks
- Track nutritional information
- View meal history
- Monitor daily intake

### Doctors
- Browse available doctors
- View doctor specialties
- Add new doctors
- Manage doctor information

### Appointments
- Schedule appointments
- View appointment history
- Update appointment status
- Link appointments to reports

### Reports
- View health reports
- Create new reports
- Link reports to appointments
- Track diagnoses and prescriptions

## API Integration

The frontend communicates with the backend API using the Fetch API. All API calls include:

- Error handling with user-friendly messages
- Loading states during requests
- Proper HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response handling

Example API call:
\`\`\`javascript
const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    setUsers(data);
  } catch (error) {
    setError(error.message);
  }
};
\`\`\`


## Connecting to Backend

Before running the frontend, ensure:

1. Backend API is running on `http://localhost:5000`
2. MongoDB is connected and running







## License

MIT

## Support

For issues or questions, please open an issue in the repository.
