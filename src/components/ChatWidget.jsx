import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css'; // Import the CSS above

const ChatWidget = () => {
  // State for Window Visibility
  const [isOpen, setIsOpen] = useState(false);

  // State for Button Position (Defaulting to somewhat bottom-right area, 
  // but you can change initial x/y here)
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  // Handle Mouse Down (Start Drag)
  const handleMouseDown = (e) => {
    isDragging.current = false;
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const handleMouseMove = (moveEvent) => {
      // Calculate distance moved
      const moveX = Math.abs(moveEvent.clientX - dragStartPos.current.x);
      const moveY = Math.abs(moveEvent.clientY - dragStartPos.current.y);

      // If moved more than 5 pixels, consider it a drag, not a click
      if (moveX > 5 || moveY > 5) {
        isDragging.current = true;
      }

      // Update Position
      setPosition({
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Click (Toggle Window)
  const handleClick = () => {
    // Only toggle if we weren't dragging
    if (!isDragging.current) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Draggable Button */}
      <div
        className="draggable-chat-btn"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        title="Chat with us"
      >
        💬
      </div>

      {/* Chat Pop-up Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Global Chat</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className="chat-body">
            <div className="message received">
              Welcome back, SumoUser123!
            </div>
            <div className="message received">
              Don't forget to check the tournament brackets.
            </div>
            {/* Example Sent Message */}
            <div className="message sent">
              Looking for a team...
            </div>
          </div>

          <div className="chat-footer">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type a message..." 
            />
            <button className="send-btn">➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
