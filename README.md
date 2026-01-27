# Nur Academy Portal

A Next.js frontend for the Nur Academy tutoring platform.

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

### 4. Build for Production

```bash
npm run build
npm start
```

## Pages

| Route | Description |
|-------|-------------|
| / | Home page |
| /login | User login |
| /signup | User registration |
| /student-dashboard | Student dashboard |
| /tutor-dashboard | Tutor dashboard |
| /chat | Messaging system |
| /payment | Payment processing |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API URL | http://localhost:8000/api |

## Backend Requirements

This frontend requires the Django backend to be running at `http://localhost:8000`. See the backend README for setup instructions.

## Test Accounts

After seeding the backend database:

**Tutors:**
- john@example.com (password: password123)
- sarah@example.com (password: password123)

**Students:**
- alice@example.com (password: password123)
- bob@example.com (password: password123)
