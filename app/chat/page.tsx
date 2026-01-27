"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { MessageCircle, Search, Send } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  role: "student" | "tutor";
  lastMessage: string;
  unread: number;
}

interface Message {
  id: number;
  sender: number;
  receiver: number;
  sender_name: string;
  sender_role: string;
  text: string;
  timestamp: string;
  read: boolean;
}

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const refreshContacts = useCallback(async () => {
    try {
      const data = await api.getContacts();
      setContacts(data);
      if (selectedContact) {
        const updated = data.find((c: Contact) => c.id === selectedContact.id);
        if (updated) {
          setSelectedContact(updated);
        }
      }
    } catch (error) {
      console.error("Error refreshing contacts:", error);
    }
  }, [selectedContact]);

  useEffect(() => {
    api
      .getContacts()
      .then((data) => {
        setContacts(data);
        const contactParam = searchParams.get("contact");
        if (contactParam) {
          const contact = data.find(
            (c: Contact) => c.id === parseInt(contactParam),
          );
          if (contact) setSelectedContact(contact);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    if (selectedContact) {
      api
        .getMessages(selectedContact.id)
        .then((data) => {
          setMessages(data);
          if (data.length > 0) {
            lastMessageIdRef.current = data[data.length - 1].id;
          }
          setTimeout(scrollToBottom, 100);
        })
        .catch(console.error);
    }
  }, [selectedContact]);

  const checkNewMessages = useCallback(async () => {
    if (!selectedContact) return;

    try {
      const newMessages = await api.checkNewMessages(
        selectedContact.id,
        lastMessageIdRef.current,
      );
      if (newMessages.length > 0) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueNew = newMessages.filter(
            (m: Message) => !existingIds.has(m.id),
          );
          if (uniqueNew.length > 0) {
            return [...prev, ...uniqueNew];
          }
          return prev;
        });
        lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error checking messages:", error);
    }
  }, [selectedContact]);

  useEffect(() => {
    const messageInterval = setInterval(checkNewMessages, 2000);
    const contactInterval = setInterval(refreshContacts, 5000);
    return () => {
      clearInterval(messageInterval);
      clearInterval(contactInterval);
    };
  }, [checkNewMessages, refreshContacts]);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setMessages([]);
    lastMessageIdRef.current = 0;
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const message = await api.sendMessage(selectedContact.id, messageText);
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        if (existingIds.has(message.id)) {
          return prev;
        }
        return [...prev, message];
      });
      lastMessageIdRef.current = message.id;
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      setNewMessage(messageText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div
        style={{
          height: "calc(100vh - 70px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "320px",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(180deg, hsl(220 25% 97%) 0%, white 100%)",
          borderRight: "1px solid hsl(220 15% 90%)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid hsl(220 15% 90%)",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
              fontWeight: "600",
              color: "hsl(220 20% 20%)",
              marginBottom: "16px",
            }}
          >
            <MessageCircle size={20} style={{ color: "hsl(210 60% 45%)" }} />
            {user?.role === "tutor" ? "My Students" : "My Tutors"}
          </h3>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "hsl(220 10% 55%)",
              }}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                fontSize: "14px",
                borderRadius: "12px",
                border: "1px solid hsl(220 15% 88%)",
                background: "white",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              style={{
                padding: "14px 16px",
                margin: "4px 0",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                cursor: "pointer",
                background:
                  selectedContact?.id === contact.id
                    ? "linear-gradient(135deg, hsl(210 60% 96%), hsl(210 50% 94%))"
                    : "transparent",
                borderRadius: "14px",
                border:
                  selectedContact?.id === contact.id
                    ? "1px solid hsl(210 60% 85%)"
                    : "1px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background:
                    selectedContact?.id === contact.id
                      ? "linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 35%))"
                      : "linear-gradient(135deg, hsl(220 15% 70%), hsl(220 15% 55%))",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "15px",
                  flexShrink: 0,
                }}
              >
                {contact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "hsl(220 20% 20%)",
                  }}
                >
                  <span>{contact.name}</span>
                  {contact.unread > 0 && (
                    <span
                      style={{
                        background: "hsl(0 70% 50%)",
                        color: "white",
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {contact.unread}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "hsl(220 10% 50%)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {contact.lastMessage || "No messages yet"}
                </div>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "hsl(220 10% 50%)",
              }}
            >
              No contacts found
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "white",
        }}
      >
        {selectedContact ? (
          <>
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid hsl(220 15% 92%)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background:
                  "linear-gradient(180deg, hsl(220 25% 98%) 0%, white 100%)",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 35%))",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {selectedContact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "hsl(220 20% 15%)",
                  }}
                >
                  {selectedContact.name}
                </h3>
                <span style={{ fontSize: "12px", color: "hsl(220 10% 50%)" }}>
                  {selectedContact.role}
                </span>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "24px",
                background:
                  "linear-gradient(180deg, hsl(220 20% 97%) 0%, hsl(220 15% 95%) 100%)",
              }}
            >
              {messages.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "hsl(220 10% 50%)",
                    padding: "40px",
                  }}
                >
                  No messages yet. Start the conversation!
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent:
                      msg.sender === user?.id ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 18px",
                      background:
                        msg.sender === user?.id
                          ? "linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 40%))"
                          : "white",
                      color:
                        msg.sender === user?.id ? "white" : "hsl(220 20% 20%)",
                      borderRadius: "20px",
                      borderBottomRightRadius:
                        msg.sender === user?.id ? "6px" : "20px",
                      borderBottomLeftRadius:
                        msg.sender === user?.id ? "20px" : "6px",
                      maxWidth: "70%",
                      boxShadow:
                        msg.sender === user?.id
                          ? "0 4px 12px hsla(210, 60%, 45%, 0.25)"
                          : "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        opacity: 0.7,
                        marginTop: "6px",
                        textAlign: "right",
                      }}
                    >
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                padding: "20px 24px",
                borderTop: "1px solid hsl(220 15% 92%)",
                background: "white",
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  fontSize: "14px",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  border: "1px solid hsl(220 15% 88%)",
                  background: "hsl(220 20% 98%)",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                style={{
                  padding: "14px 28px",
                  borderRadius: "14px",
                  background: newMessage.trim()
                    ? "linear-gradient(135deg, hsl(210 70% 50%), hsl(210 60% 40%))"
                    : "hsl(220 15% 85%)",
                  border: "none",
                  color: "white",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: newMessage.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Send size={18} />
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "hsl(220 10% 50%)",
              gap: "16px",
            }}
          >
            <MessageCircle size={48} style={{ opacity: 0.3 }} />
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "calc(100vh - 70px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Loading...
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
