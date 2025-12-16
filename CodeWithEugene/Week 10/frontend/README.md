# Real-time Tasks Frontend

A modern React application with GraphQL and WebSocket support for real-time task management. Built with React, TypeScript, Apollo Client, and Vite.

## 🚀 Features

- **Modern UI**: Clean, responsive design with loading, error, and success states
- **GraphQL Integration**: Apollo Client for queries, mutations, and subscriptions
- **Real-time Updates**: WebSocket subscriptions for live task synchronization
- **Task Management**: Create, read, update, and delete tasks
- **Filtering**: Filter tasks by status (All, Todo, In Progress, Completed, Archived)
- **TypeScript**: Fully typed codebase for better developer experience

## 📋 Prerequisites

- Node.js >= 18.17.0
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables** (optional)
   ```bash
   # Create .env file
   VITE_GRAPHQL_URL=http://localhost:4000/graphql
   VITE_WS_URL=ws://localhost:4000/graphql
   ```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📱 Features

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, assignee, due date, and tags
- **Edit Tasks**: Update existing tasks
- **Delete Tasks**: Remove tasks with confirmation
- **Status Management**: Change task status (Todo, In Progress, Completed, Archived)
- **Priority Management**: Set task priority (Low, Medium, High)

### Real-time Updates
- **Live Synchronization**: See task changes from other users instantly
- **Subscription Indicators**: Visual indicator showing real-time connection status
- **Automatic Refresh**: UI updates automatically when tasks change

### Filtering
- Filter tasks by status
- View all tasks or specific status categories

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TaskCard.tsx          # Task card component
│   │   ├── TaskCard.css
│   │   ├── TaskForm.tsx           # Task form component
│   │   └── TaskForm.css
│   ├── graphql/
│   │   └── queries.ts             # GraphQL queries, mutations, subscriptions
│   ├── lib/
│   │   └── apollo-client.ts       # Apollo Client configuration
│   ├── pages/
│   │   ├── TasksPage.tsx          # Main tasks page
│   │   └── TasksPage.css
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   ├── App.css
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 GraphQL Integration

The frontend uses Apollo Client with:

- **HTTP Link**: For queries and mutations
- **WebSocket Link**: For subscriptions
- **Automatic Caching**: Apollo Client handles caching

### Example Usage

```typescript
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_TASKS, CREATE_TASK, TASK_CREATED_SUBSCRIPTION } from './graphql/queries';

// Query
const { data, loading, error } = useQuery(GET_TASKS);

// Mutation
const [createTask] = useMutation(CREATE_TASK, {
  refetchQueries: [{ query: GET_TASKS }],
});

// Subscription
useSubscription(TASK_CREATED_SUBSCRIPTION, {
  onData: () => {
    refetch();
  },
});
```

## 🎨 UI Components

### TaskCard
Displays a single task with:
- Task title and description
- Status and priority badges
- Assignee information
- Due date
- Tags
- Status dropdown
- Edit and delete actions

### TaskForm
Form for creating/editing tasks with:
- Title (required)
- Description
- Priority selector
- Due date picker
- Assignee input
- Tags input (comma-separated)

### TasksPage
Main page containing:
- Task list/grid
- Filter dropdown
- Create task button
- Real-time indicator

## 🔄 Real-time Flow

1. **User Action**: User creates/updates/deletes a task
2. **Mutation**: Frontend sends GraphQL mutation via HTTP
3. **Backend Processing**: Server processes mutation
4. **Subscription Event**: Server publishes event via WebSocket
5. **Client Update**: Frontend receives event via subscription
6. **UI Refresh**: Apollo Client automatically updates cache and UI

## 🚢 Deployment

### Environment Variables

For production, set the API URLs:

```env
VITE_GRAPHQL_URL=https://your-backend-url.com/graphql
VITE_WS_URL=wss://your-backend-url.com/graphql
```

### Deployment Platforms

- **Vercel**: Connect your GitHub repository and deploy
- **Netlify**: Push to Netlify for automatic deployment
- **Render**: Deploy as a static site

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory, ready to be deployed to any static hosting service.

## 🎯 Features in Detail

### Status Badges
- **Todo**: Orange
- **In Progress**: Blue
- **Completed**: Green
- **Archived**: Gray

### Priority Badges
- **Low**: Green
- **Medium**: Orange
- **High**: Red

### Real-time Indicator
Shows a pulsing green dot when WebSocket connection is active, indicating real-time updates are enabled.

### Responsive Design
- Mobile-friendly layout
- Adapts to different screen sizes
- Touch-friendly buttons and inputs

## 🔗 Backend Integration

This frontend requires the Real-time Tasks backend to be running. Make sure:

1. Backend is running on the configured port (default: 4000)
2. CORS is properly configured in the backend
3. WebSocket endpoint is accessible
4. GraphQL endpoint is accessible

## 📝 License

MIT

## 👥 Contributors

Real-time Task Manager Team





