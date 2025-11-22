# LegacyBridge Frontend Dashboard

Welcome to my React dashboard! 🚀 This is the frontend interface I built to showcase modern payment data transformed from legacy systems.

## 🚀 Live Demo

**Live Site:** https://legacybrg.netlify.app
**Backend API:** https://legacybridge-backend-un5w.onrender.com

### Demo Credentials

**Admin Access:**
```
Email: sam@example.com
Password: mayowa123
Name: Samuel
```

**Regular User Access:**
```
Email: user@example.com
Password: mayowa123
Name: Regular User
```

**Access Differences:**
- **Admin**: Full dashboard, create forms, system stats, all payment/customer management
- **User**: Limited dashboard, account overview, restricted permissions

**Demo Flow:**
1. Go to https://legacybrg.netlify.app/signup
2. Create account with credentials above
3. Login and visit /dashboard
4. Use creation forms and action buttons

## What You'll See

I designed this dashboard to display Nigerian Naira (NGN) payments and customers in a clean, modern interface. It's like having a Stripe dashboard but for legacy system data!

### Features I Built
- 💳 **Payment Cards** - Beautiful display of payment data
- 👥 **Customer Management** - Clean customer information layout  
- 🔐 **Authentication** - Secure login/signup flow
- 📱 **Responsive Design** - Works on mobile and desktop
- ⚡ **Real-time Actions** - Refund and notify buttons that actually work
- 🎨 **Modern UI** - Clean, professional design

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

For production, update the API URL to your backend deployment.

## Pages I Created

### 🏠 Home
Landing page with hero section explaining the integration service.

### 📊 Dashboard  
Main interface showing:
- **Payments List** - All transactions with NGN amounts
- **Customers List** - User accounts from legacy system
- **Action Buttons** - Refund and notification features

### 📚 Docs
API documentation and integration guide.

### 🔐 Auth Pages
- **Signup** - Create new account
- **Login** - Access dashboard

## Key Components

### PaymentsList
Displays transformed payment data with:
- Payment IDs and amounts in NGN (₦)
- Customer information
- Status indicators
- Action buttons for refunds/notifications

### CustomersList  
Shows customer data including:
- Contact information
- Account status
- Legacy system metadata

## Deployment

### Netlify (Recommended)
1. Connect this GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL=your-backend-url`

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t legacybridge-frontend .
docker run -p 80:80 legacybridge-frontend
```

## Tech Stack
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - API calls
- **CSS3** - Styling
- **Docker** - Containerization

## API Integration

The frontend connects to my backend API for:
- Authentication (JWT tokens)
- Payment data fetching
- Customer information
- Refund processing
- Notification sending

## Live Features

✅ **Create Payment Forms** - Add real NGN transactions
✅ **Create Customer Forms** - Add customer accounts
✅ **Refund Buttons** - Process payment refunds
✅ **Notify Buttons** - Send customer notifications
✅ **NGN Currency** - All amounts in Nigerian Naira (₦)
✅ **Real-time Updates** - See changes immediately

The dashboard shows real Nigerian Naira amounts and provides a clean interface for managing legacy payment data. Users can easily refund payments and send notifications with just a click!

## Development Notes

I built this with modern React patterns:
- Functional components with hooks
- Context for authentication state
- Proper error handling
- Loading states
- Responsive design principles

Built with passion for Nigerian fintech! 🇳🇬

---
**Samuel** - Frontend Developer