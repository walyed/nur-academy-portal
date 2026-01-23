import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { bookedSessions, tutorAvailability, TimeSlot } from '@/data/mockData';
import SimpleCalendar from '@/components/SimpleCalendar';

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Tutor Dashboard</h2>
      <p>Welcome, {user?.name || 'Tutor'}</p>

      <section style={{ marginTop: '30px' }}>
        <h3>My Availability</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>Click to toggle availability</p>
        <SimpleCalendar 
          slots={slots} 
          onSlotClick={toggleAvailability}
          editable={true}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h3>Booked Sessions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Student</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Date</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Time</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Subject</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mySession.map((session) => (
              <tr key={session.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.studentName}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.date}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.time}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.subject}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{session.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div style={{ marginTop: '30px' }}>
        <Link to="/chat">
          <button style={{ padding: '8px 15px' }}>Open Chat</button>
        </Link>
      </div>
    </div>
  );
}
