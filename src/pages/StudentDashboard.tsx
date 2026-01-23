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

  // Group slots by date for calendar view
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const selectedTutorData = tutors.find(t => t.id === selectedTutor);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>
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
        <h3 style={{ marginBottom: '20px' }}>👨‍🏫 Available Tutors</h3>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {tutors.map((tutor) => (
            <div 
              key={tutor.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: selectedTutor === tutor.id ? 'hsl(210 60% 97%)' : 'hsl(220 20% 98%)',
                borderRadius: '12px',
                border: selectedTutor === tutor.id ? '2px solid hsl(210 60% 45%)' : '1px solid hsl(220 15% 88%)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'hsl(210 60% 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: 'hsl(210 60% 40%)'
                }}>
                  {tutor.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{tutor.name}</div>
                  <div style={{ fontSize: '14px', color: 'hsl(220 10% 50%)' }}>
                    {tutor.subject} • <StarRating rating={tutor.rating} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'hsl(210 60% 45%)' }}>
                    ${tutor.hourlyRate}
                  </div>
                  <div style={{ fontSize: '12px', color: 'hsl(220 10% 50%)' }}>per hour</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to="/chat">
                    <button 
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '14px' }}
                    >
                      💬 Chat
                    </button>
                  </Link>
                  <button 
                    onClick={() => setSelectedTutor(selectedTutor === tutor.id ? null : tutor.id)}
                    style={{ padding: '8px 14px', fontSize: '14px' }}
                  >
                    {selectedTutor === tutor.id ? '✕ Close' : '📅 View Slots'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedTutor && selectedTutorData && (
        <section className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0 }}>📅 {selectedTutorData.name}'s Availability</h3>
              <p style={{ color: 'hsl(220 10% 50%)', fontSize: '14px', margin: '4px 0 0 0' }}>
                Select a time slot to book
              </p>
            </div>
            <Link to="/payment">
              <button>💳 Proceed to Payment</button>
            </Link>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {Object.entries(slotsByDate).map(([date, dateSlots]) => (
              <div 
                key={date}
                style={{
                  background: 'hsl(220 20% 98%)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid hsl(220 15% 88%)'
                }}
              >
                <div style={{
                  background: 'hsl(210 60% 45%)',
                  color: 'white',
                  padding: '12px 16px',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  📆 {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div style={{ padding: '12px' }}>
                  {dateSlots.map((slot) => (
                    <div 
                      key={slot.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        marginBottom: '8px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid hsl(220 15% 90%)'
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: '14px' }}>
                        🕐 {slot.time}
                      </span>
                      {slot.available ? (
                        <button 
                          onClick={() => handleBook(slot)}
                          style={{ 
                            padding: '5px 12px', 
                            fontSize: '12px',
                            background: 'hsl(145 60% 42%)'
                          }}
                        >
                          Book
                        </button>
                      ) : (
                        <span style={{ 
                          fontSize: '12px',
                          color: 'hsl(220 10% 60%)',
                          padding: '5px 12px',
                          background: 'hsl(220 15% 94%)',
                          borderRadius: '6px'
                        }}>
                          Booked
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
