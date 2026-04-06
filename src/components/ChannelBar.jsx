import React, { useState, useEffect } from 'react';
import { Hash, MessageSquare, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChannelBar = ({ currentChannel, setCurrentChannel, currentServer, channelsData }) => {
  const { currentUser, logout } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    }
  };

  const activeServerData = channelsData[currentServer.id];
  const textChannels = activeServerData?.textChannels || [];
  const directMessages = activeServerData?.directMessages || [];

  return (
    <div className="channel-bar">
      <div className="server-name">
        <h3>{activeServerData?.name || 'Friend Circle'}</h3>
      </div>
      
      <div className="channel-list">
        {deferredPrompt && (
          <div 
            className="channel-item highlight" 
            style={{backgroundColor: '#5865F2', color: 'white', marginBottom: '15px'}}
            onClick={handleInstallClick}
          >
            <Download size={18} />
            <span style={{fontWeight: 'bold'}}>Install App</span>
          </div>
        )}

        <div className="category-title">Text Channels</div>
        {textChannels.map(ch => (
          <div 
            key={ch} 
            className={`channel-item ${currentChannel.name === ch && currentChannel.type === 'channel' ? 'active' : ''}`}
            onClick={() => setCurrentChannel({ id: `${currentServer.id}_${ch}`, name: ch, type: 'channel' })}
          >
            <Hash size={18} />
            <span>{ch}</span>
          </div>
        ))}

        <div className="category-title" style={{ marginTop: '20px' }}>Direct Messages</div>
        {directMessages.map(dm => (
          <div 
            key={dm} 
            className={`channel-item ${currentChannel.name === dm && currentChannel.type === 'dm' ? 'active' : ''}`}
            onClick={() => setCurrentChannel({ id: `${currentServer.id}_${dm}`, name: dm, type: 'dm' })}
          >
            <MessageSquare size={18} />
            <span>{dm}</span>
          </div>
        ))}
      </div>

      <div className="user-controls">
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="user avatar" className="user-avatar placeholder" />
        ) : (
          <div className="user-avatar placeholder flex-center" style={{fontSize: '12px', color: 'white'}}>
            {currentUser?.displayName ? currentUser.displayName[0] : 'U'}
          </div>
        )}
        <div className="user-info">
          <div className="username">{currentUser?.displayName || 'MyUser'}</div>
          <div className="user-tag" onClick={() => logout()} style={{cursor: 'pointer', textDecoration: 'underline'}}>Logout</div>
        </div>
      </div>
    </div>
  );
};

export default ChannelBar;
