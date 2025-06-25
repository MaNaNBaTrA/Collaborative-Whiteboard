import React, { useState, useEffect } from 'react';

function UserCursors({ socket }) {
  const [cursors, setCursors] = useState(new Map());

  useEffect(() => {
    if (!socket) return;

    const handleCursorMove = (data) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.set(data.userId, {
          x: data.x,
          y: data.y,
          lastSeen: Date.now()
        });
        return newCursors;
      });
    };

    socket.on('cursor-move', handleCursorMove);

    const cleanupInterval = setInterval(() => {
      setCursors(prev => {
        const newCursors = new Map();
        const now = Date.now();
        
        prev.forEach((cursor, userId) => {
          if (now - cursor.lastSeen < 5000) { 
            newCursors.set(userId, cursor);
          }
        });
        
        return newCursors;
      });
    }, 1000);

    return () => {
      socket.off('cursor-move', handleCursorMove);
      clearInterval(cleanupInterval);
    };
  }, [socket]);

  return (
    <div className="user-cursors">
      {Array.from(cursors.entries()).map(([userId, cursor]) => (
        <div
          key={userId}
          className="user-cursor"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="cursor-pointer">👆</div>
        </div>
      ))}
    </div>
  );
}

export default UserCursors;