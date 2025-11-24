# DevConnect Frontend

A modern React + Vite frontend for the DevConnect developer collaboration platform. Built with TypeScript, Tailwind CSS, and React Router for a seamless user experience.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Project Discovery**: Browse and explore projects from the community
- **Project Details**: View detailed information about projects with comments
- **User Profiles**: Explore developer profiles and their projects
- **Comments**: Engage with the community through project comments
- **Like System**: Star projects you find interesting
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with TypeScript support
- **Vitest** - Unit testing framework

## Prerequisites

- Node.js 16+ and npm/pnpm
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   pnpm install
   \`\`\`

3. **Configure environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

   Update `.env` with your API base URL:
   \`\`\`env
   VITE_API_BASE_URL=https://devconnect-o.up.railway.app
   VITE_DEV_API_BASE_URL=http://localhost:5000
   \`\`\`

## Development

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

### Hot Module Replacement (HMR)

Vite provides instant HMR - changes to your code will reflect immediately in the browser without full page reload.

## Building for Production

Build the optimized production bundle:

\`\`\`bash
npm run build
\`\`\`

The output will be in the `dist/` directory. The build process includes TypeScript compilation and optimization.

Preview the production build locally:

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/          # Reusable UI components (TypeScript)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Navbar.tsx
│   ├── pages/               # Page components (TypeScript)
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── UserProfile.tsx
│   ├── hooks/               # Custom React hooks (TypeScript)
│   │   └── useAuth.ts
│   ├── lib/                 # Utility functions and API client (TypeScript)
│   │   ├── api.ts           # Axios API client with full type definitions
│   │   └── utils.ts
│   ├── __tests__/           # Unit tests
│   │   └── api.test.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration (TypeScript)
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # TypeScript config for Vite
├── tailwind.config.js       # Tailwind CSS configuration
├── .env.example             # Environment variables template
└── package.json
\`\`\`

## API Integration

The frontend uses a centralized API client (`lib/api.ts`) that:

- **Configures baseURL** from environment variables
- **Automatically adds JWT tokens** to request headers
- **Handles authentication errors** by redirecting to login
- **Provides organized API methods** for auth, projects, comments, and users
- **Includes full TypeScript types** for all API responses

### API Types

The API client exports comprehensive TypeScript interfaces:

\`\`\`typescript
interface Project {
  _id: string
  title: string
  description: string
  author: { _id: string; username: string }
  likes: string[]
  comments: string[]
  createdAt: string
  updatedAt: string
}

interface Comment {
  _id: string
  text: string
  author: { _id: string; username: string }
  projectId: string
  likes: string[]
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  username: string
  email: string
  bio?: string
  location?: string
  skills?: string[]
  createdAt: string
  updatedAt: string
}
\`\`\`

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Production API base URL | `https://devconnect-o.up.railway.app` |
| `VITE_DEV_API_BASE_URL` | Development API base URL | `http://localhost:5000` |

The API client automatically uses the correct URL based on the environment.

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token and user data
3. Token is stored in localStorage
4. Token is automatically added to all API requests via interceptor
5. If token expires (401 error), user is redirected to login
6. User data is stored in localStorage and synced with `useAuth` hook

## Pages

### Home (`/`)
Landing page with platform overview, features, and call-to-action buttons.

### Login (`/login`)
User login form with email and password fields. Includes error handling and loading states.

### Register (`/register`)
User registration form with username, email, password confirmation, and validation.

### Projects (`/projects`)
Browse all projects with project cards showing title, description, author, likes, and comments. Authenticated users can create new projects.

### Project Detail (`/projects/:id`)
View detailed project information, comments section, like/comment functionality, and author information.

### User Profile (`/users/:username`)
View user profile with bio, location, skills, and all their projects.

## Testing

Run the test suite:

\`\`\`bash
npm run test
\`\`\`

Run tests in watch mode:

\`\`\`bash
npm run test:ui
\`\`\`

Tests cover:
- API client functionality with TypeScript types
- Authentication flows
- Data fetching and error handling

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` - Your production API URL
4. Deploy with a single click

### Deploy to Other Platforms

The `dist/` folder generated by `npm run build` can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Styling

The frontend uses Tailwind CSS with a custom dark theme configured in `index.css`. The design system includes:

- **Colors**: Dark background with light text for developer-friendly aesthetics
- **Components**: Reusable button, card, and input components with TypeScript props
- **Responsive**: Mobile-first design that scales to desktop
- **Accessibility**: Semantic HTML and ARIA attributes




## Common Issues

### API Connection Issues

If you see CORS errors or 404s:

1. Verify the backend is running
2. Check `VITE_API_BASE_URL` in `.env`
3. Ensure the backend API is accessible from your frontend URL
4. Check browser console for detailed error messages
5. Verify the API endpoint path includes `/api` prefix

### Authentication Issues

If you're logged out unexpectedly:

1. Check if token is stored in localStorage
2. Verify token hasn't expired
3. Check backend JWT secret configuration
4. Clear localStorage and try logging in again

### Build Issues

If `npm run build` fails:

1. Check for TypeScript errors: `npx tsc --noEmit`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Clear Vite cache: `rm -rf dist && npm run build`
4. Ensure all imports use correct file extensions (`.ts`, `.tsx`)

### TypeScript Errors

If you see TypeScript errors in your IDE:

1. Ensure TypeScript is installed: `npm install -D typescript`
2. Restart your IDE/editor
3. Check `tsconfig.json` is in the root directory
4. Verify all component props have proper type definitions


## License

MIT

## Support

For issues or questions:
1. Check the backend README for API documentation
2. Review the code comments and inline documentation
3. Check browser console for error messages
4. Verify environment variables are set correctly
5. Open an issue on GitHub

