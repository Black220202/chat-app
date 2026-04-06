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

  // When server changes, automatically select its first channel
  useEffect(() => {
    const activeData = channelsData[currentServer.id];
    if (activeData && activeData.textChannels.length > 0) {
      const firstChannel = activeData.textChannels[0];
      setCurrentChannel({ id: `${currentServer.id}_${firstChannel}`, name: firstChannel, type: 'channel' });
    }
  }, [currentServer.id]);

  return (
    <div className="chat-layout">
      <Sidebar currentServer={currentServer} setCurrentServer={setCurrentServer} />
      <ChannelBar 
        currentChannel={currentChannel} 
        setCurrentChannel={setCurrentChannel} 
        currentServer={currentServer}
        channelsData={channelsData}
      />
      <ChatArea currentChannel={currentChannel} />
    </div>
  );
};

export default ChatLayout;
