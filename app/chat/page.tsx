"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { mockMessages, Message } from '@/data/mockData';
import { MessageCircle, Search, Send } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  role: 'student' | 'tutor';
  avatar: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Alice Cooper', role: 'student', avatar: 'AC', lastMessage: 'Thanks for the help!', unread: 2, online: true },
  { id: '2', name: 'Bob Wilson', role: 'student', avatar: 'BW', lastMessage: 'When is our next session?', unread: 0, online: false },
  { id: '3', name: 'Carol Davis', role: 'student', avatar: 'CD', lastMessage: 'I have a question about...', unread: 1, online: true },
  { id: '4', name: 'John Smith', role: 'tutor', avatar: 'JS', lastMessage: 'See you tomorrow!', unread: 0, online: true },
  { id: '5', name: 'Sarah Johnson', role: 'tutor', avatar: 'SJ', lastMessage: 'Great progress today!', unread: 3, online: false },
];

export default function ChatPage() {
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
    <div className="max-w-5xl mx-auto p-5 animate-fade-in" style={{ marginTop: '40px' }}>
      <div className="flex rounded-2xl overflow-hidden shadow-xl" style={{ background: 'white', border: '1px solid hsl(220 15% 92%)' }}>
        
        {/* Sidebar */}
        <div className="flex flex-col" style={{ 
          width: '300px', 
          background: 'linear-gradient(180deg, hsl(220 25% 97%) 0%, white 100%)',
          borderRight: '1px solid hsl(220 15% 90%)'
        }}>
          <div style={{ padding: '24px 20px 16px' }}>
            <h3 className="flex items-center gap-2 mb-4" style={{ fontSize: '18px', fontWeight: '600', color: 'hsl(220 20% 20%)' }}>
              <MessageCircle size={20} style={{ color: 'hsl(210 60% 45%)' }} />
              {user?.role === 'tutor' ? 'My Students' : 'My Tutors'}
            </h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'hsl(220 10% 55%)' }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="transition-all duration-200"
                style={{ 
                  width: '100%', 
                  padding: '12px 14px 12px 42px',
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: '1px solid hsl(220 15% 88%)',
                  background: 'white'
                }}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 8px' }}>
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className="hover-scale"
                style={{
                  padding: '14px 16px',
                  margin: '4px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  background: selectedContact.id === contact.id 
                    ? 'linear-gradient(135deg, hsl(210 60% 96%), hsl(210 50% 94%))' 
                    : 'transparent',
                  borderRadius: '14px',
                  border: selectedContact.id === contact.id 
                    ? '1px solid hsl(210 60% 85%)' 
                    : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: selectedContact.id === contact.id 
                      ? 'linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 35%))' 
                      : 'linear-gradient(135deg, hsl(220 15% 70%), hsl(220 15% 55%))',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'hsl(145 70% 45%)',
                      border: '2px solid white'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '14px',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: 'hsl(220 20% 20%)'
                  }}>
                    <span>{contact.name}</span>
                    {contact.unread > 0 && (
                      <span className="animate-scale-in" style={{
                        background: 'linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 40%))',
                        color: 'white',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        boxShadow: '0 2px 6px hsla(210, 60%, 45%, 0.3)'
                      }}>
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'hsl(220 10% 50%)',
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
          {/* Header */}
          <div style={{ 
            padding: '16px 24px', 
            borderBottom: '1px solid hsl(220 15% 92%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, hsl(220 25% 98%) 0%, white 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 35%))',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                }}>
                  {selectedContact.avatar}
                </div>
                {selectedContact.online && (
                  <div style={{
                    position: 'absolute',
                    bottom: '1px',
                    right: '1px',
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: 'hsl(145 70% 45%)',
                    border: '2px solid white'
                  }} />
                )}
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'hsl(220 20% 15%)' }}>
                {selectedContact.name}
              </h3>
            </div>
          </div>

          {/* Messages */}
          <div style={{ 
            flex: 1,
            height: '400px', 
            overflowY: 'auto', 
            padding: '24px',
            background: 'linear-gradient(180deg, hsl(220 20% 97%) 0%, hsl(220 15% 95%) 100%)'
          }}>
            {messages.map((msg, index) => (
              <div 
                key={msg.id} 
                className="animate-fade-in"
                style={{ 
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: isOwnMessage(msg.sender) ? 'flex-end' : 'flex-start',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <div style={{ 
                  padding: '14px 18px',
                  background: isOwnMessage(msg.sender) 
                    ? 'linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 40%))' 
                    : 'white',
                  color: isOwnMessage(msg.sender) ? 'white' : 'hsl(220 20% 20%)',
                  borderRadius: '20px',
                  borderBottomRightRadius: isOwnMessage(msg.sender) ? '6px' : '20px',
                  borderBottomLeftRadius: isOwnMessage(msg.sender) ? '20px' : '6px',
                  maxWidth: '70%',
                  boxShadow: isOwnMessage(msg.sender) 
                    ? '0 4px 12px hsla(210, 60%, 45%, 0.25)' 
                    : '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{msg.text}</div>
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: 0.7, 
                    marginTop: '6px',
                    textAlign: 'right'
                  }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            padding: '20px 24px',
            borderTop: '1px solid hsl(220 15% 92%)',
            background: 'white'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{ 
                flex: 1, 
                fontSize: '14px',
                padding: '14px 18px',
                borderRadius: '14px',
                border: '1px solid hsl(220 15% 88%)',
                background: 'hsl(220 20% 98%)'
              }}
            />
            <button 
              onClick={handleSend} 
              className="hover-scale"
              style={{ 
                padding: '14px 28px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 40%))',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px hsla(210, 60%, 45%, 0.3)',
                cursor: 'pointer'
              }}
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
