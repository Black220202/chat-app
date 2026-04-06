import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChannelBar from './ChannelBar';
import ChatArea from './ChatArea';
import './ChatLayout.css';

const channelsData = {
  server1: { name: 'Friend Circle', textChannels: ['general', 'memes', 'gaming'], directMessages: ['Alice', 'Bob'] },
  server2: { name: 'Gaming Group', textChannels: ['fps', 'rpg', 'voice-chat'], directMessages: ['Charlie'] },
  server3: { name: 'Work', textChannels: ['announcements', 'projects'], directMessages: ['Boss'] },
};

const ChatLayout = () => {
  const [currentServer, setCurrentServer] = useState({ id: 'server1', name: 'Friend Circle' });
  const [currentChannel, setCurrentChannel] = useState({ id: 'general', name: 'general', type: 'channel' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // When server changes, automatically select its first channel
  useEffect(() => {
    const activeData = channelsData[currentServer.id];
    if (activeData && activeData.textChannels.length > 0) {
      const firstChannel = activeData.textChannels[0];
      setCurrentChannel({ id: `${currentServer.id}_${firstChannel}`, name: firstChannel, type: 'channel' });
    }
  }, [currentServer.id]);

  useEffect(() => {
    // Request notification permissions for new messages
    if ("Notification" in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className={`chat-layout ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      <Sidebar currentServer={currentServer} setCurrentServer={setCurrentServer} />
      <ChannelBar 
        currentChannel={currentChannel} 
        setCurrentChannel={(channel) => {
          setCurrentChannel(channel);
          setIsMobileMenuOpen(false); // Close mobile drawer when channel selected
        }} 
        currentServer={currentServer}
        channelsData={channelsData}
      />
      <ChatArea 
        currentChannel={currentChannel} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
    </div>
  );
};

export default ChatLayout;
