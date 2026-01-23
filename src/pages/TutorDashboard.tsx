import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { bookedSessions, tutorAvailability, TimeSlot } from '@/data/mockData';

export default function TutorDashboard() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<TimeSlot[]>(tutorAvailability);

  const toggleAvailability = (slot: TimeSlot) => {
    setSlots(prev => 
      prev.map(s => 
        s.id === slot.id ? { ...s, available: !s.available } : s
      )
    );
  };

  const mySession = bookedSessions.filter(s => s.tutorName === 'John Smith');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '8px' }}>👨‍🏫 Tutor Dashboard</h2>
        <p style={{ color: 'hsl(220 10% 50%)' }}>Welcome back, {user?.name || 'Tutor'}</p>
      </div>

      <section className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '8px' }}>📅 My Availability</h3>
        <p style={{ color: 'hsl(220 10% 50%)', fontSize: '14px', marginBottom: '16px' }}>
          Click to toggle your available time slots
        </p>
        
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.time}</td>
                <td>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: slot.available ? 'hsl(145 60% 94%)' : 'hsl(220 15% 92%)',
                    color: slot.available ? 'hsl(145 60% 30%)' : 'hsl(220 10% 50%)'
                  }}>
                    {slot.available ? 'Available' : 'Booked'}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => toggleAvailability(slot)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    {slot.available ? 'Set Unavailable' : 'Set Available'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>📋 Booked Sessions</h3>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mySession.map((session) => (
              <tr key={session.id}>
                <td>{session.studentName}</td>
                <td>{session.date}</td>
                <td>{session.time}</td>
                <td>{session.subject}</td>
                <td>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    background: session.status === 'upcoming' ? 'hsl(210 60% 95%)' : 'hsl(145 60% 94%)',
                    color: session.status === 'upcoming' ? 'hsl(210 60% 40%)' : 'hsl(145 60% 30%)'
                  }}>
                    {session.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Link to="/chat">
        <button>💬 Open Chat</button>
      </Link>
    </div>
  );
}
