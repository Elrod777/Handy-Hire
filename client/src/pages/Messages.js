import React, { useEffect, useState } from 'react';
import * as messagesService from '../services/messagesService';
import MessageBox from '../components/MessageBox';
import '../styles/messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messagesService.getConversations();
        setConversations(data);
      } catch (err) {
        setError('Error fetching conversations');
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const handleSelectConversation = async (bookingId) => {
    setSelectedConversation(bookingId);
    try {
      const data = await messagesService.getMessages(bookingId);
      setMessages(data);
    } catch (err) {
      setError('Error fetching messages');
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      await messagesService.sendMessage({
        booking_id: selectedConversation,
        recipient_id: 0,
        message_text: messageText
      });
      const data = await messagesService.getMessages(selectedConversation);
      setMessages(data);
    } catch (err) {
      setError('Error sending message');
      console.error('Error sending message:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="messages-page">
      <h1>Messages</h1>
      <div className="messages-container">
        <div className="conversations-list">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <strong>{conv.first_name} {conv.last_name}</strong>
                <small>{conv.message_text}</small>
              </div>
            ))
          ) : (
            <p>No conversations yet</p>
          )}
        </div>
        <div className="messages-view">
          {selectedConversation ? (
            <MessageBox messages={messages} onSendMessage={handleSendMessage} />
          ) : (
            <p>Select a conversation to start messaging</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;