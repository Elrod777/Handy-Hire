import React, { useState } from 'react';
import '../styles/messagebox.css';

const MessageBox = ({ messages, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="message-box">
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.is_sent ? 'sent' : 'received'}`}>
            <p>{msg.message_text}</p>
            <small>{new Date(msg.created_at).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default MessageBox;