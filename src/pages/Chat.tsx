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

  const isOwnMessage = (sender: string) => sender === (user?.role || 'student');

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid hsl(220 15% 85%)',
          background: 'hsl(220 20% 98%)'
        }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>💬 Chat</h2>
          <p style={{ color: 'hsl(220 10% 50%)', margin: '4px 0 0 0', fontSize: '14px' }}>
            {user?.role === 'tutor' ? 'Chatting with: Alice Cooper (Student)' : 'Chatting with: John Smith (Tutor)'}
          </p>
        </div>

        <div style={{ 
          height: '400px', 
          overflowY: 'auto', 
          padding: '20px',
          background: 'hsl(220 20% 98%)'
        }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              style={{ 
                marginBottom: '16px',
                display: 'flex',
                justifyContent: isOwnMessage(msg.sender) ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{ 
                padding: '12px 16px',
                backgroundColor: isOwnMessage(msg.sender) ? 'hsl(210 60% 45%)' : 'white',
                color: isOwnMessage(msg.sender) ? 'white' : 'hsl(220 20% 20%)',
                borderRadius: '16px',
                borderBottomRightRadius: isOwnMessage(msg.sender) ? '4px' : '16px',
                borderBottomLeftRadius: isOwnMessage(msg.sender) ? '16px' : '4px',
                maxWidth: '70%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  opacity: 0.7, 
                  marginBottom: '4px' 
                }}>
                  {msg.sender === 'tutor' ? '👨‍🏫 Tutor' : '🎓 Student'} • {msg.timestamp}
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '16px 20px',
          borderTop: '1px solid hsl(220 15% 85%)',
          background: 'white'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{ flex: 1 }}
          />
          <button onClick={handleSend} style={{ padding: '10px 24px' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
