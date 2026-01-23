import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { tutors, tutorAvailability, TimeSlot } from '@/data/mockData';
import StarRating from '@/components/StarRating';

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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '8px' }}>🎓 Student Dashboard</h2>
        <p style={{ color: 'hsl(220 10% 50%)' }}>Welcome back, {user?.name || 'Student'}</p>
      </div>

      {bookingConfirmed && (
        <div className="success-message" style={{ marginBottom: '20px' }}>
          ✅ {bookingConfirmed}
        </div>
      )}

      <section className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>👨‍🏫 Available Tutors</h3>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Rating</th>
              <th>Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor.id}>
                <td style={{ fontWeight: 500 }}>{tutor.name}</td>
                <td>{tutor.subject}</td>
                <td><StarRating rating={tutor.rating} /></td>
                <td style={{ color: 'hsl(210 60% 45%)', fontWeight: 600 }}>${tutor.hourlyRate}/hr</td>
                <td>
                  <button 
                    onClick={() => setSelectedTutor(selectedTutor === tutor.id ? null : tutor.id)}
                    className={selectedTutor === tutor.id ? '' : 'btn-secondary'}
                    style={{ padding: '6px 12px', fontSize: '13px' }}
                  >
                    {selectedTutor === tutor.id ? 'Hide' : 'View Slots'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedTutor && (
        <section className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>📅 Available Time Slots</h3>
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
                    {slot.available ? (
                      <button 
                        onClick={() => handleBook(slot)}
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        Book Now
                      </button>
                    ) : (
                      <span style={{ color: 'hsl(220 10% 60%)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '20px' }}>
            <Link to="/payment">
              <button>💳 Proceed to Payment</button>
            </Link>
          </div>
        </section>
      )}

      <Link to="/chat">
        <button className="btn-secondary">💬 Chat with Tutor</button>
      </Link>
    </div>
  );
}
