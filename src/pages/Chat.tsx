import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockMessages, Message } from '@/data/mockData';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: user?.role === 'tutor' ? 'tutor' : 'student',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Chat</h2>
      <p style={{ color: '#666' }}>
        {user?.role === 'tutor' ? 'Chatting with: Alice Cooper (Student)' : 'Chatting with: John Smith (Tutor)'}
      </p>

      <div style={{ 
        border: '1px solid #ccc', 
        height: '400px', 
        overflowY: 'auto', 
        padding: '10px',
        marginTop: '15px'
      }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              marginBottom: '10px',
              textAlign: msg.sender === (user?.role || 'student') ? 'right' : 'left'
            }}
          >
            <div style={{ 
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: msg.sender === (user?.role || 'student') ? '#e3e3e3' : '#f5f5f5',
              border: '1px solid #ccc',
              maxWidth: '70%',
              textAlign: 'left'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '3px' }}>
                {msg.sender === 'tutor' ? 'Tutor' : 'Student'} - {msg.timestamp}
              </div>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={handleSend} style={{ padding: '8px 20px' }}>
          Send
        </button>
      </div>
    </div>
  );
}
