import { TimeSlot } from '@/data/mockData';

interface SimpleCalendarProps {
  slots: TimeSlot[];
  onSlotClick?: (slot: TimeSlot) => void;
  editable?: boolean;
}

export default function SimpleCalendar({ slots, onSlotClick, editable = false }: SimpleCalendarProps) {
  const dates = [...new Set(slots.map(s => s.date))];
  
  return (
    <div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Time</th>
            <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Status</th>
            {onSlotClick && (
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.date}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{slot.time}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                {slot.available ? 'Available' : 'Booked'}
              </td>
              {onSlotClick && (
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {editable ? (
                    <button 
                      onClick={() => onSlotClick(slot)}
                      style={{ padding: '3px 8px' }}
                    >
                      {slot.available ? 'Set Unavailable' : 'Set Available'}
                    </button>
                  ) : slot.available ? (
                    <button 
                      onClick={() => onSlotClick(slot)}
                      style={{ padding: '3px 8px' }}
                    >
                      Book
                    </button>
                  ) : (
                    <span style={{ color: '#999' }}>Unavailable</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
