import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { tutors, tutorAvailability, TimeSlot } from '@/data/mockData';
import StarRating from '@/components/StarRating';
import SimpleCalendar from '@/components/SimpleCalendar';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>(tutorAvailability);

  const handleBook = (slot: TimeSlot) => {
    setSlots(prev => 
      prev.map(s => 
        s.id === slot.id ? { ...s, available: false } : s
      )
    );
    setBookingConfirmed(`Booking confirmed for ${slot.date} at ${slot.time}`);
    setTimeout(() => setBookingConfirmed(null), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Student Dashboard</h2>
      <p>Welcome, {user?.name || 'Student'}</p>

      {bookingConfirmed && (
        <div style={{ backgroundColor: '#d4edda', padding: '10px', marginTop: '10px', border: '1px solid #c3e6cb' }}>
          {bookingConfirmed}
        </div>
      )}

      <section style={{ marginTop: '30px' }}>
        <h3>Available Tutors</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Subject</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Rating</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Rate ($/hr)</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tutor.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tutor.subject}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <StarRating rating={tutor.rating} />
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>${tutor.hourlyRate}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  <button 
                    onClick={() => setSelectedTutor(selectedTutor === tutor.id ? null : tutor.id)}
                    style={{ padding: '3px 8px' }}
                  >
                    {selectedTutor === tutor.id ? 'Hide' : 'View Availability'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedTutor && (
        <section style={{ marginTop: '30px' }}>
          <h3>Tutor Availability</h3>
          <SimpleCalendar slots={slots} onSlotClick={handleBook} />
          <div style={{ marginTop: '15px' }}>
            <Link to="/payment">
              <button style={{ padding: '8px 15px' }}>Proceed to Payment</button>
            </Link>
          </div>
        </section>
      )}

      <div style={{ marginTop: '30px' }}>
        <Link to="/chat">
          <button style={{ padding: '8px 15px' }}>Chat with Tutor</button>
        </Link>
      </div>
    </div>
  );
}
