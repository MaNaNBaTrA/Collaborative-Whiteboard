import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('user-count-update', (count) => {
      setUserCount(count);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = async (roomId) => {
    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentRoom(data);
        socket.emit('join-room', roomId);
      } else {
        console.error('Failed to join room');
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
    setUserCount(0);
    if (socket) {
      socket.emit('leave-room');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Collaborative Whiteboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
          {currentRoom && (
            <div className="room-info">
              <span>Room: {currentRoom.roomId}</span>
              <span>Users: {userCount}</span>
              <button onClick={leaveRoom} className="leave-button">Leave Room</button>
            </div>
          )}
        </div>
      </header>

      {!currentRoom ? (
        <RoomJoin onJoinRoom={joinRoom} />
      ) : (
        <Whiteboard 
          socket={socket} 
          roomData={currentRoom}
        />
      )}
    </div>
  );
}

export default App;