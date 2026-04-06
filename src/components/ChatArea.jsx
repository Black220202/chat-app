import React, { useState, useEffect, useRef } from 'react';
import { Hash, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';

const ChatArea = ({ currentChannel }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [firebaseError, setFirebaseError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    if (!currentChannel?.id) return;
    
    // Create a query against the collection, focusing on the current channel.
    const q = query(
      collection(db, 'messages'),
      where('channelId', '==', currentChannel.id),
      orderBy('timestamp')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFirebaseError(null);
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setFirebaseError(error.message);
    });
    return unsubscribe;
  }, [currentChannel]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userPhoto: currentUser.photoURL || '',
        channelId: currentChannel.id,
        timestamp: serverTimestamp(),
      });
      setFirebaseError(null);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
      setFirebaseError(error.message);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-area">
      <div className="chat-header">
        {currentChannel.type === 'channel' ? (
          <Hash size={24} color="var(--text-muted)" />
        ) : (
          <MessageSquare size={24} color="var(--text-muted)" />
        )}
        <h2>{currentChannel.name}</h2>
      </div>

      <div className="message-list">
        {messages.map((msg) => (
          <div key={msg.id} className="message-wrapper">
            {msg.userPhoto ? (
              <img src={msg.userPhoto} alt="avatar" className="message-avatar placeholder" />
            ) : (
              <div className="message-avatar placeholder flex-center" style={{color: 'white'}}>
                {msg.userName ? msg.userName[0] : '?'}
              </div>
            )}
            
            <div className="message-content">
              <div className="message-header">
                <span className="message-author">{msg.userName}</span>
                <span className="message-timestamp">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        ))}
        {firebaseError && (
          <div style={{ padding: '16px', color: 'var(--danger)', backgroundColor: 'rgba(218,55,60,0.1)', borderRadius: '8px', margin: '16px 0', fontSize: '14px' }}>
            <strong>Database Error:</strong> {firebaseError}
            <br/><br/>
            If you see an "index" error, check your browser console for a clickable link to create it.
            <br/>
            If you see a "Missing or insufficient permissions" error, please go to your Firebase Console -&gt; Firestore Database -&gt; Rules, and ensure it is set to "allow read, write: if request.auth != null;".
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <form onSubmit={handleSendMessage} className="chat-input-container">
          <input 
            type="text" 
            placeholder={`Message ${currentChannel.type === 'channel' ? '#' : '@'}${currentChannel.name}`}
            className="chat-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
