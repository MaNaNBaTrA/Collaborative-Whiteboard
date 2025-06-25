import React, { useRef, useEffect, useState, useCallback } from 'react';

function DrawingCanvas({ socket, roomData }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const drawLine = useCallback((ctx, from, to, color = strokeColor, width = strokeWidth) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, [strokeColor, strokeWidth]);

  const startDrawing = useCallback((e) => {
    setIsDrawing(true);
    const coords = getCanvasCoordinates(e);
    setCurrentPath([coords]);
    
    socket.emit('draw-start', {
      x: coords.x,
      y: coords.y,
      color: strokeColor,
      width: strokeWidth
    });
  }, [getCanvasCoordinates, socket, strokeColor, strokeWidth]);

  const draw = useCallback((e) => {
    if (!isDrawing) return;

    const coords = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (currentPath.length > 0) {
      const lastPoint = currentPath[currentPath.length - 1];
      drawLine(ctx, lastPoint, coords);
    }

    const newPath = [...currentPath, coords];
    setCurrentPath(newPath);

    socket.emit('draw-move', {
      x: coords.x,
      y: coords.y,
      color: strokeColor,
      width: strokeWidth
    });
  }, [isDrawing, getCanvasCoordinates, currentPath, drawLine, socket, strokeColor, strokeWidth]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    setCurrentPath([]);
    
    socket.emit('draw-end', {
      color: strokeColor,
      width: strokeWidth
    });
  }, [isDrawing, socket, strokeColor, strokeWidth]);

  const handleMouseMove = useCallback((e) => {
    const coords = getCanvasCoordinates(e);
    socket.emit('cursor-move', coords);
    
    if (isDrawing) {
      draw(e);
    }
  }, [getCanvasCoordinates, socket, isDrawing, draw]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-canvas');
  }, [socket]);

  useEffect(() => {
    if (roomData && roomData.drawingData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      let currentStroke = [];
      
      roomData.drawingData.forEach((command) => {
        if (command.type === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          currentStroke = [];
        } else if (command.type === 'stroke') {
          const { data } = command;
          
          if (data.type === 'start') {
            currentStroke = [{ x: data.x, y: data.y }];
          } else if (data.type === 'move' && currentStroke.length > 0) {
            const newPoint = { x: data.x, y: data.y };
            const lastPoint = currentStroke[currentStroke.length - 1];
            
            ctx.beginPath();
            ctx.moveTo(lastPoint.x, lastPoint.y);
            ctx.lineTo(newPoint.x, newPoint.y);
            ctx.strokeStyle = data.color || '#000000';
            ctx.lineWidth = data.width || 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            currentStroke.push(newPoint);
          }
        }
      });
    }
  }, [roomData]);

  useEffect(() => {
    if (!socket) return;

    let otherUserStrokes = new Map();

    const handleDrawStart = (data) => {
      otherUserStrokes.set(socket.id, [{ x: data.x, y: data.y }]);
    };

    const handleDrawMove = (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      let stroke = otherUserStrokes.get(socket.id) || [];
      if (stroke.length > 0) {
        const lastPoint = stroke[stroke.length - 1];
        const newPoint = { x: data.x, y: data.y };
        
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(newPoint.x, newPoint.y);
        ctx.strokeStyle = data.color || '#000000';
        ctx.lineWidth = data.width || 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        stroke.push(newPoint);
        otherUserStrokes.set(socket.id, stroke);
      }
    };

    const handleDrawEnd = () => {
      otherUserStrokes.delete(socket.id);
    };

    const handleClearCanvas = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      otherUserStrokes.clear();
    };

    socket.on('draw-start', handleDrawStart);
    socket.on('draw-move', handleDrawMove);
    socket.on('draw-end', handleDrawEnd);
    socket.on('clear-canvas', handleClearCanvas);

    return () => {
      socket.off('draw-start', handleDrawStart);
      socket.off('draw-move', handleDrawMove);
      socket.off('draw-end', handleDrawEnd);
      socket.off('clear-canvas', handleClearCanvas);
    };
  }, [socket]);

  useEffect(() => {
    window.whiteboardControls = {
      setStrokeColor,
      setStrokeWidth,
      clearCanvas
    };
  }, [clearCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      className="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}

export default DrawingCanvas;