# Deployment Guide

## Backend Deployment (Render.com)

1. Push code to GitHub repository
2. Connect repository to Render.com
3. Use the included `render.yaml` configuration
4. Set environment variables:
   - `NODE_ENV=production`
   - `LEGACY_API_URL=https://jsonplaceholder.typicode.com`
   - `CACHE_TTL=300`

## Frontend Deployment (Netlify)

1. Push code to GitHub repository
2. Connect repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.render.com`

## Alternative Deployment Options

### Backend
- Railway.app
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run

### Frontend
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Local Development

1. Start backend: `cd legacybridge-backend && npm run dev`
2. Start frontend: `cd legacybridge-frontend && npm run dev`
3. Access application at `http://localhost:5173`