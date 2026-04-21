// VideoCall.jsx
// Place in: EVENTSPHERE/src/videoCall/VideoCall.jsx

import { useState, useRef, useEffect } from "react";
import { useWebRTC } from "./useWebRTC";
import VideoTile from "./VideoTile";
import "./VideoCall.css";

export default function VideoCall({ eventId, eventTitle, userId, userName, token, onLeave }) {
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);

  const {
    localStream,
    peers,
    isMuted,
    isCamOff,
    isScreenSharing,
    chatMessages,
    connectionState,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendChat,
    leaveCall,
  } = useWebRTC({ eventId, userId, userName, token });

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!showChat && chatMessages.length > 0) {
      const last = chatMessages[chatMessages.length - 1];
      if (!last.self) setUnreadCount((c) => c + 1);
    }
  }, [chatMessages, showChat]);

  useEffect(() => {
    if (showChat) setUnreadCount(0);
  }, [showChat]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChat(chatInput);
    setChatInput("");
  };

  const handleLeave = () => {
    leaveCall();
    onLeave?.();
  };

  // Grid layout based on participant count
  const totalVideos = peers.length + 1; // +1 for local
  const gridClass = totalVideos === 1 ? "grid--solo"
    : totalVideos === 2 ? "grid--duo"
    : totalVideos <= 4 ? "grid--quad"
    : "grid--many";

  if (connectionState === "error") {
    return (
      <div className="vc-error">
        <div className="vc-error__icon">⚠️</div>
        <h3>Could not access camera/microphone</h3>
        <p>Please check your browser permissions and try again.</p>
        <button className="vc-btn vc-btn--danger" onClick={onLeave}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="vc-room">
      {/* Header */}
      <div className="vc-header">
        <div className="vc-header__left">
          <span className="vc-header__live-dot" />
          <span className="vc-header__title">{eventTitle}</span>
        </div>
        <div className="vc-header__right">
          <span className="vc-header__count">
            {peers.length + 1} participant{peers.length !== 0 ? "s" : ""}
          </span>
          {connectionState === "connecting" && (
            <span className="vc-header__status">Connecting…</span>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className={`vc-body ${showChat ? "vc-body--chat-open" : ""}`}>
        {/* Video Grid */}
        <div className={`vc-grid ${gridClass}`}>
          <VideoTile
            stream={localStream}
            userName={userName}
            isMuted={isMuted}
            isCamOff={isCamOff}
            isLocal
            isScreenSharing={isScreenSharing}
          />
          {peers.map((peer) => (
            <VideoTile
              key={peer.socketId}
              stream={peer.stream}
              userName={peer.userName}
              isMuted={!peer.audioEnabled}
              isCamOff={!peer.videoEnabled}
            />
          ))}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="vc-chat">
            <div className="vc-chat__header">
              <span>In-meeting Chat</span>
              <button className="vc-chat__close" onClick={() => setShowChat(false)}>✕</button>
            </div>
            <div className="vc-chat__messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`vc-chat__msg ${msg.self ? "vc-chat__msg--self" : ""}`}>
                  <span className="vc-chat__msg-name">{msg.self ? "You" : msg.userName}</span>
                  <span className="vc-chat__msg-text">{msg.message}</span>
                  <span className="vc-chat__msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="vc-chat__input-row" onSubmit={handleSendChat}>
              <input
                className="vc-chat__input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Send a message…"
                autoComplete="off"
              />
              <button className="vc-chat__send" type="submit" disabled={!chatInput.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="vc-controls">
        <button
          className={`vc-ctrl-btn ${isMuted ? "vc-ctrl-btn--off" : ""}`}
          onClick={toggleMic}
          title={isMuted ? "Unmute" : "Mute"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            {isMuted
              ? <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
              : <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V21h2v-3.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
            }
          </svg>
          <span>{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        <button
          className={`vc-ctrl-btn ${isCamOff ? "vc-ctrl-btn--off" : ""}`}
          onClick={toggleCamera}
          title={isCamOff ? "Start Video" : "Stop Video"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            {isCamOff
              ? <path d="M21 6.5l-4-4-9.19 9.19L4.5 8.5 3 10l2.31 2.31L3 14.5 4.5 16l2.81-2.81L9.5 15.5 7 18h12l-2.46-2.46L21 11V6.5zm-8 8l-4-4L16 3.5 20 7.5 13 14.5z"/>
              : <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            }
          </svg>
          <span>{isCamOff ? "Start Video" : "Stop Video"}</span>
        </button>

        <button
          className={`vc-ctrl-btn ${isScreenSharing ? "vc-ctrl-btn--active" : ""}`}
          onClick={toggleScreenShare}
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 16V6h16v10H4zm7-5.95v3.45l-3-3L5 13.5V10H4V9h1.5l3.5 3.5V7.05l2-2z"/>
          </svg>
          <span>{isScreenSharing ? "Stop Share" : "Share Screen"}</span>
        </button>

        <button
          className={`vc-ctrl-btn ${showChat ? "vc-ctrl-btn--active" : ""}`}
          onClick={() => setShowChat((v) => !v)}
          title="Chat"
        >
          <div className="vc-ctrl-btn__icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            {unreadCount > 0 && (
              <span className="vc-ctrl-btn__badge">{unreadCount}</span>
            )}
          </div>
          <span>Chat</span>
        </button>

        <button className="vc-ctrl-btn vc-ctrl-btn--leave" onClick={handleLeave} title="Leave">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          <span>Leave</span>
        </button>
      </div>
    </div>
  );
}