// VideoTile.jsx
// Place in: EVENTSPHERE/src/videoCall/VideoTile.jsx

import { useEffect, useRef } from "react";
import "./VideoCall.css";

export default function VideoTile({ stream, userName, isMuted, isCamOff, isLocal = false, isScreenSharing = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className={`video-tile ${isLocal ? "video-tile--local" : ""} ${isScreenSharing ? "video-tile--screen" : ""}`}>
      {isCamOff || !stream ? (
        <div className="video-tile__avatar">
          <span className="video-tile__initials">{initials}</span>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="video-tile__video"
        />
      )}

      <div className="video-tile__info">
        <span className="video-tile__name">
          {isLocal ? "You" : userName}
          {isScreenSharing && <span className="video-tile__badge">Screen</span>}
        </span>
        {isMuted && (
          <span className="video-tile__mic-off" title="Muted">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}