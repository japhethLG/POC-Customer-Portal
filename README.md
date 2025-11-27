# ServiceM8 Customer Portal - Frontend

Modern customer portal built with Next.js 15, React 19, and TypeScript. Allows customers to view their bookings, access details, and communicate with service providers.

## Features

- ✅ Customer authentication (email + phone)
- ✅ Booking list view
- ✅ Booking detail view
- ✅ File attachments gallery
- ✅ Real-time messaging
- ✅ Responsive design
- ✅ Dark mode support

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **API Integration** - Backend REST API

## Prerequisites

- Node.js v18 or higher
- Backend API running on port 4000

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
client/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (public)/     # Public routes
│   │   │   └── login/
│   │   ├── (protected)/  # Protected routes
│   │   │   ├── dashboard/
│   │   │   └── booking/[id]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/       # React components
│   │   ├── ChatInterface.tsx
│   │   └── ...
│   ├── lib/             # Utilities
│   │   ├── api.ts       # API client
│   │   ├── auth.ts      # Auth helpers
│   │   └── data.ts      # Data helpers
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── middleware.ts    # Route protection
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Pages

### Login (`/login`)
- Email + phone authentication
- Form validation
- Error handling
- Auto-redirect on success

### Dashboard (`/dashboard`)
- List all customer bookings
- Status badges (Scheduled, In Progress, Complete)
- Click to view details
- Refresh button
- Logout functionality

### Booking Detail (`/booking/[id]`)
- Complete booking information
- Service address
- Assigned technician
- Scheduled date/time
- File attachments gallery
- Real-time messaging interface

## API Integration

The frontend uses a custom API client (`src/lib/api.ts`) that handles:

- Token management (localStorage)
- Request/response handling
- Error handling
- Authentication headers

### API Client Usage

```typescript
import { apiClient } from '@/lib/api';

// Login
const response = await apiClient.login(email, phone);

// Get bookings
const bookings = await apiClient.getBookings();

// Get booking details
const booking = await apiClient.getBookingById(id);

// Get messages
const messages = await apiClient.getMessages(jobId);

// Send message
const result = await apiClient.sendMessage(jobId, message);

// Logout
await apiClient.logout();
```

## Authentication Flow

1. User enters email and phone on login page
2. API client sends credentials to backend
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. All subsequent requests include token in Authorization header
6. Middleware protects routes by checking for token
7. Invalid/expired tokens redirect to login

## Styling

The app uses TailwindCSS with a custom color scheme:

- **Primary**: Teal/Ocean Blue (#0d8282)
- **Background**: Light gray / Dark gray
- **Text**: Dark / Light (for dark mode)
- **Accents**: Teal for interactive elements

### Dark Mode

Dark mode is supported via TailwindCSS's `dark:` prefix. The system automatically adapts to user preferences.

## Building for Production

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000/api` |

## Testing

### Manual Testing

1. Start backend server
2. Start frontend server
3. Navigate to `http://localhost:3000`
4. Login with test credentials:
   - Email: `john@example.com`
   - Phone: `+1234567890`
5. View bookings (fetched from ServiceM8)
6. Click on a booking
7. Send a message
8. Logout

## Common Issues

### API Connection Error
- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Login Failed
- Verify credentials match seeded data
- Check backend logs for errors
- Ensure MongoDB is connected

### No Bookings Displayed
- Ensure ServiceM8 API is configured correctly in backend
- Check that customer email/phone matches job contacts
- Look at Network tab in browser DevTools

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Performance

- Server-side rendering for fast initial load
- Client-side navigation for instant page transitions
- Optimistic UI updates for messaging
- Efficient re-rendering with React 19

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
