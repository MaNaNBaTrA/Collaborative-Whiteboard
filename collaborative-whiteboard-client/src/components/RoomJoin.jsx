import React, { useState } from 'react';

function RoomJoin({ onJoinRoom }) {
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;

    setIsJoining(true);
    await onJoinRoom(roomId.trim().toUpperCase());
    setIsJoining(false);
  };

  const generateRandomRoom = () => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(randomId);
  };

  return (
    <div className="room-join">
      <div className="room-join-container">
        <h2>Join a Whiteboard Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              maxLength="8"
              className="room-input"
              disabled={isJoining}
            />
            <button 
              type="submit" 
              className="join-button"
              disabled={!roomId.trim() || isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>
        <div className="room-actions">
          <button 
            onClick={generateRandomRoom}
            className="generate-button"
            disabled={isJoining}
          >
            Generate Random Room
          </button>
        </div>
        <p className="room-help">
          Enter a room code to join an existing room, or create a new one by entering any code.
        </p>
      </div>
    </div>
  );
}

export default RoomJoin;