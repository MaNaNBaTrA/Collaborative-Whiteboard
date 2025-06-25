import express from 'express';
import Room from '../models/Room.js';
const router = express.Router();

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post('/join', async (req, res) => {
  try {
    const { roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    let room = await Room.findOne({ roomId });
    
    if (!room) {
      room = new Room({ roomId });
      await room.save();
    } else {
      room.lastActivity = new Date();
      await room.save();
    }

    res.json({ 
      roomId: room.roomId, 
      drawingData: room.drawingData 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ 
      roomId: room.roomId, 
      drawingData: room.drawingData 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;