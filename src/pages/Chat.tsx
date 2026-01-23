import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockMessages, Message } from '@/data/mockData';
import { MessageCircle, Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: 'student' | 'tutor';
  avatar: string;
  lastMessage: string;
  unread: number;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Alice Cooper', role: 'student', avatar: 'AC', lastMessage: 'Thanks for the help!', unread: 2 },
  { id: '2', name: 'Bob Wilson', role: 'student', avatar: 'BW', lastMessage: 'When is our next session?', unread: 0 },
  { id: '3', name: 'Carol Davis', role: 'student', avatar: 'CD', lastMessage: 'I have a question about...', unread: 1 },
  { id: '4', name: 'John Smith', role: 'tutor', avatar: 'JS', lastMessage: 'See you tomorrow!', unread: 0 },
  { id: '5', name: 'Sarah Johnson', role: 'tutor', avatar: 'SJ', lastMessage: 'Great progress today!', unread: 3 },
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact>(
    user?.role === 'tutor' ? mockContacts[0] : mockContacts[3]
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = mockContacts
    .filter(c => user?.role === 'tutor' ? c.role === 'student' : c.role === 'tutor')
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        
        {/* Sidebar */}
        <div style={{ 
          width: '280px', 
          background: 'white',
          borderRight: '1px solid hsl(220 15% 90%)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            padding: '20px', 
            borderBottom: '1px solid hsl(220 15% 90%)',
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={18} />
              {user?.role === 'tutor' ? 'Students' : 'Tutors'}
            </h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 10% 60%)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  paddingLeft: '36px',
                  fontSize: '14px',
                  padding: '10px 12px 10px 36px'
                }}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  background: selectedContact.id === contact.id ? 'hsl(210 60% 96%)' : 'transparent',
                  borderLeft: selectedContact.id === contact.id ? '3px solid hsl(210 60% 45%)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, hsl(210 60% 50%), hsl(210 60% 40%))',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  {contact.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: '500', 
                    fontSize: '14px',
                    marginBottom: '2px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{contact.name}</span>
                    {contact.unread > 0 && (
                      <span style={{
                        background: 'hsl(210 60% 45%)',
                        color: 'white',
                        fontSize: '11px',
                        padding: '2px 7px',
                        borderRadius: '10px',
                        fontWeight: '600'
                      }}>
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'hsl(220 10% 55%)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {contact.lastMessage}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white' }}>
          <div style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid hsl(220 15% 90%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, hsl(210 60% 50%), hsl(210 60% 40%))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '13px'
            }}>
              {selectedContact.avatar}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedContact.name}</h3>
              <p style={{ color: 'hsl(220 10% 55%)', margin: 0, fontSize: '13px' }}>
                {selectedContact.role === 'tutor' ? '👨‍🏫 Tutor' : '🎓 Student'}
              </p>
            </div>
          </div>

          <div style={{ 
            flex: 1,
            height: '380px', 
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
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: 0.7, 
                    marginBottom: '4px' 
                  }}>
                    {msg.timestamp}
                  </div>
                  <div style={{ fontSize: '14px' }}>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            padding: '16px 20px',
            borderTop: '1px solid hsl(220 15% 90%)',
            background: 'white'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              style={{ flex: 1, fontSize: '14px' }}
            />
            <button onClick={handleSend} style={{ padding: '10px 24px' }}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
