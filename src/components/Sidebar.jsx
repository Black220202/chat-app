import React from 'react';

const servers = [
  { id: 'server1', name: 'Friend Circle', icon: '💬', isHighlight: true },
  { id: 'server2', name: 'Gaming Group', icon: '🎮' },
  { id: 'server3', name: 'Work', icon: '💼' },
];

const Sidebar = ({ currentServer, setCurrentServer }) => {
  return (
    <div className="sidebar">
      {servers.map((server, idx) => (
        <React.Fragment key={server.id}>
          <div 
            className={`server-icon flex-center ${server.isHighlight ? 'highlight' : ''} ${currentServer.id === server.id ? 'active' : ''}`}
            onClick={() => setCurrentServer({ id: server.id, name: server.name })}
            title={server.name}
          >
            <span>{server.icon}</span>
          </div>
          {idx === 0 && <div className="separator"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Sidebar;
