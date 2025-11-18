
import React, { useState, useRef } from 'react';
import './MessagingWidget.css';

/**
 * MessagingWidget
 * - Always-visible circular button.
 * - Draggable anywhere on screen (drag & drop).
 * - Clicking opens a simple messaging modal where users can see
 *   a fake conversation and type messages.
 * - This is UI-only; hooking to a real backend can come later.
 */
const MessagingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    { id: 1, from: 'System', text: 'Welcome to your inbox. This is where player messages will appear.' },
    { id: 2, from: 'SumoFriend', text: 'Yo! Ready for the next match?' }
  ]);
  const [draft, setDraft] = useState('');
  const widgetRef = useRef(null);

  const handleMouseDown = (e) => {
    // Only start drag with left mouse
    if (e.button !== 0) return;
    const rect = widgetRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: 'You', text: trimmed }
    ]);
    setDraft('');
  };

  // Attach mousemove / mouseup to whole window so drag doesn't break
  React.useEffect(() => {
    if (!dragging) return;
    const move = (e) => handleMouseMove(e);
    const up = () => handleMouseUp();
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging, offset]);

  return (
    <>
      {/* Draggable button */}
      <div
        ref={widgetRef}
        className="messaging-widget-button"
        style={{ right: position.x, bottom: position.y }}
        onMouseDown={handleMouseDown}
        onClick={() => {
          // If it was a drag, ignore click open
          if (!dragging) {
            setIsOpen(true);
          }
        }}
      >
        💬
      </div>

      {/* Messaging modal */}
      {isOpen && (
        <div className="messaging-widget-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="messaging-widget-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="messaging-header">
              <h2>Messages</h2>
              <button
                type="button"
                className="messaging-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="messaging-body">
              <div className="messaging-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      'messaging-item ' +
                      (msg.from === 'You' ? 'from-you' : 'from-them')
                    }
                  >
                    <div className="messaging-from">{msg.from}</div>
                    <div className="messaging-text">{msg.text}</div>
                  </div>
                ))}
              </div>
              <div className="messaging-input-row">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="button" onClick={handleSend}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessagingWidget;
