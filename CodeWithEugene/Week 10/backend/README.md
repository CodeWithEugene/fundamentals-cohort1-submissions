# Real-time Tasks Backend

A GraphQL API server with WebSocket support for real-time task management. Built with Apollo Server v4, Express, TypeScript, and graphql-ws.

## 🚀 Features

- **GraphQL API**: Complete GraphQL API with queries, mutations, and subscriptions
- **Real-time Updates**: WebSocket-based subscriptions for live data synchronization
- **TypeScript**: Fully typed codebase for better maintainability
- **Task Management**: Full CRUD operations for tasks
- **Real-time Events**: Automatic notifications on task changes

## 📋 Prerequisites

- Node.js >= 18.17.0
- npm or yarn

## 🔧 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   WS_PORT=4001
   ```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

The server will start on `http://localhost:4000`
- GraphQL endpoint: `http://localhost:4000/graphql`
- WebSocket endpoint: `ws://localhost:4000/graphql`

### Production
```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📡 GraphQL API

### Queries

#### Get All Tasks
```graphql
query {
  tasks {
    id
    title
    description
    status
    priority
    assigneeName
    createdAt
    updatedAt
    dueDate
    tags
  }
}
```

#### Get Task by ID
```graphql
query {
  task(id: "task-id") {
    id
    title
    description
    status
    priority
  }
}
```

#### Get Tasks by Status
```graphql
query {
  tasksByStatus(status: TODO) {
    id
    title
    status
  }
}
```

#### Get Tasks by Assignee
```graphql
query {
  tasksByAssignee(assigneeId: "user-id") {
    id
    title
    assigneeName
  }
}
```

### Mutations

#### Create Task
```graphql
mutation {
  createTask(input: {
    title: "New Task"
    description: "Task description"
    priority: MEDIUM
    assigneeName: "John Doe"
    dueDate: "2024-12-31"
    tags: ["urgent", "frontend"]
  }) {
    id
    title
    status
  }
}
```

#### Update Task
```graphql
mutation {
  updateTask(input: {
    id: "task-id"
    title: "Updated Task"
    status: IN_PROGRESS
    priority: HIGH
  }) {
    id
    title
    status
    priority
  }
}
```

#### Delete Task
```graphql
mutation {
  deleteTask(id: "task-id")
}
```

### Subscriptions

#### Subscribe to Task Creation
```graphql
subscription {
  taskCreated {
    id
    title
    description
    status
    priority
    createdAt
  }
}
```

#### Subscribe to Task Updates
```graphql
subscription {
  taskUpdated {
    id
    title
    status
    updatedAt
  }
}
```

#### Subscribe to Task Deletion
```graphql
subscription {
  taskDeleted {
    id
    title
  }
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment configuration
│   ├── graphql/
│   │   ├── schema.ts              # GraphQL schema definitions
│   │   ├── resolvers.ts           # GraphQL resolvers
│   │   └── index.ts               # Apollo Server setup
│   ├── services/
│   │   └── task.service.ts         # Task business logic
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   └── server.ts                  # Express app entry point
├── tests/                         # Test files
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Data Models

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus; // TODO | IN_PROGRESS | COMPLETED | ARCHIVED
  priority: TaskPriority; // LOW | MEDIUM | HIGH
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
}
```

## 🔌 WebSocket Subscriptions

The server uses `graphql-ws` for WebSocket-based GraphQL subscriptions. Clients can subscribe to:

- `taskCreated`: Fired when a new task is created
- `taskUpdated`: Fired when a task is updated
- `taskDeleted`: Fired when a task is deleted

All connected clients receive these events in real-time.

## 🛡️ Security

- **Helmet**: Security headers middleware
- **CORS**: Configurable CORS policy
- **Input Validation**: GraphQL schema validation

## 📈 Performance Considerations

- **In-memory Store**: Current implementation uses in-memory storage
- **WebSocket Connections**: Efficient WebSocket connection management
- **GraphQL Caching**: Apollo Client handles caching on the frontend

## 🔄 Real-time Flow

1. Client sends mutation (e.g., `createTask`)
2. Server processes mutation and updates data
3. Server publishes event to PubSub
4. All subscribed clients receive update via WebSocket
5. Clients automatically update their UI

## 🚢 Deployment

### Environment Variables for Production

```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
WS_PORT=4001
```

### Deployment Platforms

- **Render**: Connect your GitHub repository and deploy
- **Railway**: Push to Railway for automatic deployment
- **Heroku**: Use the Node.js buildpack

**Important**: Ensure your hosting platform supports WebSocket connections.

### Build for Production

```bash
npm run build
npm start
```

## 📝 License

MIT

## 👥 Contributors

Real-time Task Manager Team





