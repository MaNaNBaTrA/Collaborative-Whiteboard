import React from 'react';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

function Whiteboard({ socket, roomData }) {
  return (
    <div className="whiteboard">
      <Toolbar socket={socket} />
      <div className="canvas-container">
        <DrawingCanvas socket={socket} roomData={roomData} />
        <UserCursors socket={socket} />
      </div>
    </div>
  );
}

export default Whiteboard;