import Room from '../models/Room.js';

const rooms = new Map(); 

function handleSocketConnection(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', async (roomId) => {
      try {
        socket.join(roomId);
        socket.roomId = roomId;

        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Set());
        }
        
        rooms.get(roomId).add(socket.id);

        
        await Room.findOneAndUpdate(
          { roomId },
          { lastActivity: new Date() },
          { upsert: true }
        );

        
        const userCount = rooms.get(roomId).size;
        io.to(roomId).emit('user-count-update', userCount);

        console.log(`User ${socket.id} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    socket.on('cursor-move', (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('cursor-move', {
          userId: socket.id,
          x: data.x,
          y: data.y
        });
      }
    });

    socket.on('draw-start', async (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('draw-start', data);
        
        
        try {
          await Room.findOneAndUpdate(
            { roomId: socket.roomId },
            { 
              $push: { 
                drawingData: {
                  type: 'stroke',
                  data: { ...data, type: 'start' },
                  timestamp: new Date()
                }
              },
              lastActivity: new Date()
            }
          );
        } catch (error) {
          console.error('Error saving draw-start:', error);
        }
      }
    });

    socket.on('draw-move', async (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('draw-move', data);
        
        try {
          await Room.findOneAndUpdate(
            { roomId: socket.roomId },
            { 
              $push: { 
                drawingData: {
                  type: 'stroke',
                  data: { ...data, type: 'move' },
                  timestamp: new Date()
                }
              },
              lastActivity: new Date()
            }
          );
        } catch (error) {
          console.error('Error saving draw-move:', error);
        }
      }
    });

    socket.on('draw-end', async (data) => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('draw-end', data);
        
        try {
          await Room.findOneAndUpdate(
            { roomId: socket.roomId },
            { 
              $push: { 
                drawingData: {
                  type: 'stroke',
                  data: { ...data, type: 'end' },
                  timestamp: new Date()
                }
              },
              lastActivity: new Date()
            }
          );
        } catch (error) {
          console.error('Error saving draw-end:', error);
        }
      }
    });

    socket.on('clear-canvas', async () => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('clear-canvas');
        
        try {
          await Room.findOneAndUpdate(
            { roomId: socket.roomId },
            { 
              drawingData: [{
                type: 'clear',
                data: {},
                timestamp: new Date()
              }],
              lastActivity: new Date()
            }
          );
        } catch (error) {
          console.error('Error clearing canvas:', error);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      if (socket.roomId && rooms.has(socket.roomId)) {
        rooms.get(socket.roomId).delete(socket.id);
        
        const userCount = rooms.get(socket.roomId).size;
        if (userCount === 0) {
          rooms.delete(socket.roomId);
        } else {
          socket.to(socket.roomId).emit('user-count-update', userCount);
        }
      }
    });
  });
}

export default handleSocketConnection;