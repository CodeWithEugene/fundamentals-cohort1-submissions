# Week 10: Real-time Task Management with GraphQL and WebSockets

This repository contains a complete real-time collaborative task management application built with GraphQL, WebSockets, TypeScript, React, and Apollo Client.

## 📁 Repository Structure

```
Week 10/
├── backend/          # GraphQL API with WebSocket subscriptions
└── frontend/         # React-Vite frontend application
```

## 🎯 Project Overview

**Real-time Task Manager** is a collaborative task management application that demonstrates:

- **GraphQL API**: Modern API architecture with queries, mutations, and subscriptions
- **Real-time Updates**: WebSocket-based subscriptions for live data synchronization
- **TypeScript**: Full type safety across the stack
- **Modern Frontend**: React with Apollo Client for GraphQL operations
- **Real-time Collaboration**: Multiple users can see updates instantly

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:4000`
- GraphQL endpoint: `http://localhost:4000/graphql`
- WebSocket endpoint: `ws://localhost:4000/graphql`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📦 Deliverables

### Backend (`realtime-tasks-backend`)

✅ **GraphQL API Server**
- Apollo Server v4 with Express
- GraphQL schema with queries, mutations, and subscriptions
- WebSocket server for real-time subscriptions
- TypeScript implementation
- In-memory data store (can be replaced with database)

✅ **Features**
- Task CRUD operations
- Real-time task updates via subscriptions
- Task filtering and querying
- Status and priority management
- Tag support

✅ **Testing**
- Ready for unit and integration tests
- Test structure in place

### Frontend (`realtime-tasks-frontend`)

✅ **React Application**
- TypeScript implementation
- Apollo Client for GraphQL operations
- WebSocket subscriptions for real-time updates
- Task management interface
- Task creation, editing, and deletion
- Status filtering
- Real-time update indicators

✅ **Features**
- Create, read, update, delete tasks
- Real-time synchronization across clients
- Status filtering (All, Todo, In Progress, Completed, Archived)
- Priority management (Low, Medium, High)
- Tag support
- Assignee management
- Due date tracking

## 🔗 GraphQL API

### Queries

```graphql
# Get all tasks
query GetTasks {
  tasks {
    id
    title
    description
    status
    priority
    assigneeName
    dueDate
    tags
  }
}

# Get task by ID
query GetTask($id: ID!) {
  task(id: $id) {
    id
    title
    description
    status
    priority
  }
}

# Get tasks by status
query GetTasksByStatus($status: TaskStatus!) {
  tasksByStatus(status: $status) {
    id
    title
    status
  }
}
```

### Mutations

```graphql
# Create task
mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    title
    description
    status
    priority
  }
}

# Update task
mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    id
    title
    status
  }
}

# Delete task
mutation DeleteTask($id: ID!) {
  deleteTask(id: $id)
}
```

### Subscriptions

```graphql
# Subscribe to task creation
subscription TaskCreated {
  taskCreated {
    id
    title
    status
  }
}

# Subscribe to task updates
subscription TaskUpdated {
  taskUpdated {
    id
    title
    status
  }
}

# Subscribe to task deletion
subscription TaskDeleted {
  taskDeleted {
    id
    title
  }
}
```

## 🏗️ Architecture

### Backend Architecture

```
Express Server
    ↓
Apollo Server (GraphQL)
    ├── HTTP Endpoint (/graphql)
    └── WebSocket Server (ws://localhost:4000/graphql)
        ↓
GraphQL Schema & Resolvers
    ├── Queries
    ├── Mutations
    └── Subscriptions
        ↓
Task Service
    └── In-memory Store
```

### Frontend Architecture

```
React App
    ↓
Apollo Client
    ├── HTTP Link (queries & mutations)
    └── WebSocket Link (subscriptions)
        ↓
Components
    ├── TasksPage
    ├── TaskCard
    └── TaskForm
```

## 🔄 Real-time Flow

1. **User Action**: User creates/updates/deletes a task
2. **Mutation**: Frontend sends GraphQL mutation
3. **Backend Processing**: Server processes mutation and updates data
4. **Subscription Notification**: Server publishes event to subscribers
5. **Real-time Update**: All connected clients receive update via WebSocket
6. **UI Update**: Frontend automatically updates UI

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### Frontend Tests

```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📊 Key Features

### Backend Features

- ✅ GraphQL API with Apollo Server v4
- ✅ WebSocket subscriptions for real-time updates
- ✅ TypeScript for type safety
- ✅ Task CRUD operations
- ✅ Real-time event publishing
- ✅ CORS configuration
- ✅ Security headers (Helmet)

### Frontend Features

- ✅ React with TypeScript
- ✅ Apollo Client for GraphQL
- ✅ WebSocket subscriptions
- ✅ Real-time task updates
- ✅ Task filtering by status
- ✅ Task creation and editing
- ✅ Responsive design
- ✅ Loading and error states
- ✅ Real-time indicator

## 🔧 Technology Stack

### Backend
- Node.js 18+
- Express.js
- Apollo Server v4
- GraphQL
- graphql-ws (WebSocket)
- TypeScript
- Jest (testing)

### Frontend
- React 18
- Vite
- TypeScript
- Apollo Client
- graphql-ws (WebSocket client)
- React Router

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend setup, GraphQL API documentation
- [Frontend README](./frontend/README.md) - Frontend setup and usage guide

## 🎓 Learning Objectives

This project demonstrates:

1. **GraphQL API Design**: Queries, mutations, and subscriptions
2. **Real-time Communication**: WebSocket-based subscriptions
3. **Apollo Server**: Setting up GraphQL server with subscriptions
4. **Apollo Client**: Using GraphQL client with subscriptions
5. **Type Safety**: TypeScript across the stack
6. **Modern Frontend**: React with modern patterns
7. **Real-time Collaboration**: Multi-user real-time updates

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to:
- **Render**: Connect GitHub repo, auto-deploy
- **Railway**: Push to Railway for deployment
- **Heroku**: Use Node.js buildpack

**Note**: Ensure WebSocket support is enabled on your hosting platform.

### Frontend Deployment

The frontend can be deployed to:
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Push to Netlify
- **Render**: Deploy as static site

**Environment Variables**:
```env
VITE_GRAPHQL_URL=https://your-backend-url.com/graphql
VITE_WS_URL=wss://your-backend-url.com/graphql
```

## 📝 License

MIT

## 👥 Contributors

Real-time Task Manager Team

---

**Note**: This is a learning project for Week 10 of the Software Engineering Fundamentals course. The application demonstrates GraphQL, WebSockets, and real-time collaboration patterns.





