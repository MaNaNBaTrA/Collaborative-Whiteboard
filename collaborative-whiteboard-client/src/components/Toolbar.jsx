import React, { useState } from 'react';

function Toolbar({ socket }) {
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);

  const colors = ['#000000', '#FF0000', '#0000FF', '#00FF00'];

  const handleColorChange = (color) => {
    setStrokeColor(color);
    if (window.whiteboardControls) {
      window.whiteboardControls.setStrokeColor(color);
    }
  };

  const handleWidthChange = (e) => {
    const width = parseInt(e.target.value);
    setStrokeWidth(width);
    if (window.whiteboardControls) {
      window.whiteboardControls.setStrokeWidth(width);
    }
  };

  const handleClear = () => {
    if (window.whiteboardControls) {
      window.whiteboardControls.clearCanvas();
    }
  };

  return (
    <div className="toolbar">
      <div className="tool-group">
        <label>Colors:</label>
        <div className="color-palette">
          {colors.map((color) => (
            <button
              key={color}
              className={`color-button ${strokeColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="tool-group">
        <label htmlFor="stroke-width">Width: {strokeWidth}px</label>
        <input
          id="stroke-width"
          type="range"
          min="1"
          max="20"
          value={strokeWidth}
          onChange={handleWidthChange}
          className="width-slider"
        />
      </div>

      <div className="tool-group">
        <button onClick={handleClear} className="clear-button">
          Clear Canvas
        </button>
      </div>
    </div>
  );
}

export default Toolbar;