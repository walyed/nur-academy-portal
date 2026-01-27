# Nur Academy Portal

A Next.js frontend for the Nur Academy tutoring platform.

## 🔐 Quick Login Credentials

After seeding the backend, use these credentials to test the application:

**Students:**
- Email: `alice@example.com` | Password: `password123`
- Email: `bob@example.com` | Password: `password123`
- Email: `carol@example.com` | Password: `password123`

**Tutors:**
- Email: `john@example.com` | Password: `password123` (Mathematics - $30/hr)
- Email: `sarah@example.com` | Password: `password123` (Physics - $35/hr)
- Email: `michael@example.com` | Password: `password123` (Chemistry - $28/hr)
- Email: `emily@example.com` | Password: `password123` (English - $25/hr)
- Email: `david@example.com` | Password: `password123` (History - $22/hr)

## Features

- User authentication (login/signup)
- Student dashboard with tutor browsing
- Tutor dashboard with availability management
- Real-time chat messaging
- Booking and payment system
- Monthly calendar for scheduling

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React Icons

## Project Structure

```
nur-academy-portal/
├── app/
│   ├── chat/
│   ├── login/
│   ├── payment/
│   ├── signup/
│   ├── student-dashboard/
│   ├── tutor-dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── Header.tsx
│   ├── MonthlyCalendar.tsx
│   └── StarRating.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── api.ts
│   └── utils.ts
├── .env.local
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8000` (see backend README)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

**Note:** Make sure the backend server is running before starting the frontend.

### 4. Build for Production

```bash
npm run build
npm start
```

Or use Turbopack for faster builds:
```bash
npm run build -- --turbopack
```

## Pages

| Route | Description | Access |
|-------|-------------|--------|
| / | Home/Landing page | Public |
| /login | User login | Public |
| /signup | User registration | Public |
| /student-dashboard | Browse tutors and make bookings | Student only |
| /tutor-dashboard | Manage availability and view bookings | Tutor only |
| /chat | Real-time messaging system | Authenticated |
| /payment | Payment processing for bookings | Student only |
| /settings | Profile and password management | Authenticated |

## Features Overview

### For Students
- Browse available tutors by subject
- View tutor ratings and hourly rates
- Book tutoring sessions based on tutor availability
- Make payments for bookings
- Chat with tutors
- Rate tutors after completed sessions
- View and manage bookings on calendar
- Update profile information

### For Tutors
- Set availability with time ranges
- View upcoming and past bookings
- Manage schedule on calendar
- Chat with students
- View ratings and feedback
- Track earnings
- Update profile and rates

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8000/api |

## Backend Requirements

This frontend requires the Django backend to be running. Follow these steps:

1. **Start Backend Server** (in the `nur-academy-backend` directory):
   ```bash
   # Activate virtual environment
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # Mac/Linux
   
   # Run server
   python manage.py runserver
   ```

2. **Seed Database** (first time only):
   ```bash
   python seed_data.py
   ```

3. **Backend should be accessible at**: `http://localhost:8000`

See the backend README for detailed setup instructions.

## Quick Start Guide

### Complete Setup (Both Backend and Frontend)

1. **Setup Backend:**
   ```bash
   cd nur-academy-backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   python manage.py migrate
   python seed_data.py
   python manage.py runserver
   ```

2. **Setup Frontend** (in new terminal):
   ```bash
   cd nur-academy-portal
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin

## Test Accounts

After seeding the backend database with `python seed_data.py`:

### Tutors
| Email | Password | Subject | Hourly Rate |
|-------|----------|---------|-------------|
| john@example.com | password123 | Mathematics | $30 |
| sarah@example.com | password123 | Physics | $35 |
| michael@example.com | password123 | Chemistry | $28 |
| emily@example.com | password123 | English | $25 |
| david@example.com | password123 | History | $22 |

### Students
| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |
| carol@example.com | password123 |

**Testing Features:**
- Login as a student to browse tutors and make bookings
- Login as a tutor to manage availability and view bookings
- The seed data includes sample messages, bookings, and ratings
- Some messages are marked as unread to test the notification badge

## Common Issues

### API Connection Failed
- Ensure backend is running at `http://localhost:8000`
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Verify no CORS errors in browser console

### Port 3000 Already in Use
Run on a different port:
```bash
npm run dev -- -p 3001
```

### Build Errors
Clear Next.js cache:
```bash
rm -rf .next  # Mac/Linux
rmdir /s .next  # Windows
npm run build
```

### Authentication Issues
- Clear browser localStorage
- Logout and login again
- Verify token in localStorage: `localStorage.getItem('token')`

## Development Tips

- The app uses localStorage for authentication tokens
- Real-time features use polling (messages: 2s, contacts: 5s)
- All API calls are centralized in `lib/api.ts`
- Authentication context is managed in `context/AuthContext.tsx`
- Use browser DevTools Network tab to debug API calls

## Technologies Used

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icon library
- **Context API**: State management
- **Turbopack**: Fast bundler for development

## License

This project is for educational purposes.