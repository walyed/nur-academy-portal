// Mock data for the application

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  hourlyRate: number;
}

export interface Session {
  id: string;
  studentName: string;
  tutorName: string;
  date: string;
  time: string;
  subject: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Message {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
}

export const tutors: Tutor[] = [
  { id: '1', name: 'John Smith', subject: 'Mathematics', rating: 4.5, hourlyRate: 30 },
  { id: '2', name: 'Sarah Johnson', subject: 'Physics', rating: 4.8, hourlyRate: 35 },
  { id: '3', name: 'Michael Brown', subject: 'Chemistry', rating: 4.2, hourlyRate: 28 },
  { id: '4', name: 'Emily Davis', subject: 'English', rating: 4.9, hourlyRate: 25 },
  { id: '5', name: 'David Wilson', subject: 'History', rating: 4.0, hourlyRate: 22 },
];

export const bookedSessions: Session[] = [
  { id: '1', studentName: 'Alice Cooper', tutorName: 'John Smith', date: '2026-01-25', time: '10:00 AM', subject: 'Mathematics', status: 'upcoming' },
  { id: '2', studentName: 'Bob Miller', tutorName: 'John Smith', date: '2026-01-26', time: '2:00 PM', subject: 'Mathematics', status: 'upcoming' },
  { id: '3', studentName: 'Carol White', tutorName: 'John Smith', date: '2026-01-20', time: '11:00 AM', subject: 'Mathematics', status: 'completed' },
];

export const tutorAvailability: TimeSlot[] = [
  { id: '1', date: '2026-01-25', time: '9:00 AM', available: true },
  { id: '2', date: '2026-01-25', time: '10:00 AM', available: false },
  { id: '3', date: '2026-01-25', time: '11:00 AM', available: true },
  { id: '4', date: '2026-01-25', time: '2:00 PM', available: true },
  { id: '5', date: '2026-01-26', time: '9:00 AM', available: true },
  { id: '6', date: '2026-01-26', time: '10:00 AM', available: true },
  { id: '7', date: '2026-01-26', time: '2:00 PM', available: false },
  { id: '8', date: '2026-01-27', time: '9:00 AM', available: true },
  { id: '9', date: '2026-01-27', time: '11:00 AM', available: true },
];

export const mockMessages: Message[] = [
  { id: '1', sender: 'student', text: 'Hi, I have a question about the homework.', timestamp: '10:00 AM' },
  { id: '2', sender: 'tutor', text: 'Sure, what do you need help with?', timestamp: '10:02 AM' },
  { id: '3', sender: 'student', text: 'I am stuck on problem 5.', timestamp: '10:03 AM' },
  { id: '4', sender: 'tutor', text: 'Let me explain. First you need to...', timestamp: '10:05 AM' },
];

export const currentUser = {
  student: { id: 's1', name: 'Alice Cooper', role: 'student' as const },
  tutor: { id: 't1', name: 'John Smith', role: 'tutor' as const },
};
