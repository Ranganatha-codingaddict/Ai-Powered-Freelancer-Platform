import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaTimes, FaPaperPlane, FaComments } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        type: 'bot',
        text: 'Hello! 👋 How can I assist you today?'
      }]);
    }
  }, []);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setMessages(prev => [...prev, { type: 'user', text: query.trim() }]);
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:8081/api/chatbot/text',
        query,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setMessages(prev => [...prev, { type: 'bot', text: res.data }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'bot', text: 'Error processing your request.' }]);
    }

    setLoading(false);
    setQuery('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#2563EB',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem'
          }}>
            <FaRobot />
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b'
            }}>AI Assistant</h1>
            <p style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#64748b'
            }}>Ask me anything</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease',
            ':hover': {
              background: '#f1f5f9',
              color: '#1e293b'
            }
          }}
        >
          <FaTimes size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              maxWidth: '80%',
              padding: '1rem 1.25rem',
              borderRadius: '1rem',
              fontSize: '1rem',
              lineHeight: 1.5,
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              background: msg.type === 'user' ? '#2563EB' : '#ffffff',
              color: msg.type === 'user' ? 'white' : '#1e293b',
              borderBottomRightRadius: msg.type === 'user' ? '0.25rem' : '1rem',
              borderBottomLeftRadius: msg.type === 'user' ? '1rem' : '0.25rem',
              boxShadow: msg.type === 'bot' ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: msg.type === 'user' ? 'auto' : '-8px',
              right: msg.type === 'user' ? '-8px' : 'auto',
              width: '16px',
              height: '16px',
              background: msg.type === 'user' ? '#2563EB' : '#ffffff',
              transform: 'rotate(45deg)'
            }} />
            <div>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            alignSelf: 'flex-start',
            background: '#ffffff',
            borderRadius: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#2563EB',
              borderRadius: '50%',
              animation: 'typing 1.4s infinite ease-in-out'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#2563EB',
              borderRadius: '50%',
              animation: 'typing 1.4s infinite ease-in-out 0.2s'
            }}></div>
            <div style={{
              width: '8px',
              height: '8px',
              background: '#2563EB',
              borderRadius: '50%',
              animation: 'typing 1.4s infinite ease-in-out 0.4s'
            }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div style={{
        padding: '1.5rem',
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        position: 'sticky',
        bottom: 0
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          gap: '1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '1rem',
          padding: '0.5rem',
          transition: 'all 0.2s ease',
          ':focus-within': {
            borderColor: '#2563EB',
            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
          }
        }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              padding: '1rem',
              fontSize: '1rem',
              color: '#1e293b',
              outline: 'none',
              '::placeholder': {
                color: '#94a3b8'
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            style={{
              background: loading || !query.trim() ? '#93C5FD' : '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              ':hover': {
                transform: loading || !query.trim() ? 'none' : 'translateY(-1px)',
                boxShadow: loading || !query.trim() ? 'none' : '0 4px 6px rgba(37, 99, 235, 0.1)'
              }
            }}
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes typing {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}
      </style>
    </div>
  );
};

export default Chatbot;