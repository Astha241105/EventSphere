// useWebRTC.js
// Place in: EVENTSPHERE/src/videoCall/useWebRTC.js

import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // Add TURN server here for production (Twilio / Xirsys free tier):
    // { urls: "turn:YOUR_TURN_SERVER", username: "...", credential: "..." }
  ],
};

export function useWebRTC({ eventId, userId, userName, token }) {
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peersRef = useRef({}); // socketId -> RTCPeerConnection
  const pendingCandidates = useRef({}); // socketId -> [candidates]

  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState([]); // [{ socketId, userId, userName, stream }]
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [connectionState, setConnectionState] = useState("idle"); // idle | connecting | connected | error

  // ── Helper: create RTCPeerConnection for a peer ──────────────────────────
  const createPeer = useCallback((targetSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // ICE candidate → send to peer via signaling server
    pc.onicecandidate = ({ candidate }) => {
      if (candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          to: targetSocketId,
          candidate,
          from: socketRef.current.id,
        });
      }
    };

    // Remote stream arrived
    pc.ontrack = ({ streams }) => {
      const remoteStream = streams[0];
      setPeers((prev) =>
        prev.map((p) =>
          p.socketId === targetSocketId ? { ...p, stream: remoteStream } : p
        )
      );
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") {
        pc.restartIce();
      }
    };

    peersRef.current[targetSocketId] = pc;
    return pc;
  }, []);

  // ── Flush buffered ICE candidates ────────────────────────────────────────
  const flushCandidates = useCallback(async (socketId) => {
    const pc = peersRef.current[socketId];
    if (!pc) return;
    const candidates = pendingCandidates.current[socketId] || [];
    for (const c of candidates) {
      try { await pc.addIceCandidate(c); } catch (_) {}
    }
    delete pendingCandidates.current[socketId];
  }, []);

  // ── Init local media + connect socket ─────────────────────────────────────
  useEffect(() => {
    if (!eventId || !userId) return;

    let cancelled = false;
    setConnectionState("connecting");

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }

        localStreamRef.current = stream;
        setLocalStream(stream);

        // Connect socket
        const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000", {
          auth: { token },
          transports: ["websocket"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          setConnectionState("connected");
          socket.emit("join-room", { eventId, userId, userName });
        });

        socket.on("connect_error", () => setConnectionState("error"));

        // ── Existing peers list (sent on join) ───────────────────────────
        socket.on("existing-peers", async (existingPeers) => {
          for (const peer of existingPeers) {
            setPeers((prev) => [...prev, { socketId: peer.socketId, userId: peer.userId, userName: peer.userName, stream: null }]);
            const pc = createPeer(peer.socketId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { to: peer.socketId, offer, from: socket.id });
          }
        });

        // ── New peer joined ───────────────────────────────────────────────
        socket.on("user-joined", ({ socketId, userId: uid, userName: uName }) => {
          setPeers((prev) => {
            if (prev.find((p) => p.socketId === socketId)) return prev;
            return [...prev, { socketId, userId: uid, userName: uName, stream: null }];
          });
          createPeer(socketId);
        });

        // ── Receive offer → answer ────────────────────────────────────────
        socket.on("offer", async ({ from, offer }) => {
          if (!peersRef.current[from]) createPeer(from);
          const pc = peersRef.current[from];
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          await flushCandidates(from);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("answer", { to: from, answer, from: socket.id });
        });

        // ── Receive answer ────────────────────────────────────────────────
        socket.on("answer", async ({ from, answer }) => {
          const pc = peersRef.current[from];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            await flushCandidates(from);
          }
        });

        // ── ICE candidate ─────────────────────────────────────────────────
        socket.on("ice-candidate", async ({ from, candidate }) => {
          const pc = peersRef.current[from];
          if (pc && pc.remoteDescription) {
            try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (_) {}
          } else {
            if (!pendingCandidates.current[from]) pendingCandidates.current[from] = [];
            pendingCandidates.current[from].push(new RTCIceCandidate(candidate));
          }
        });

        // ── Peer left ─────────────────────────────────────────────────────
        socket.on("user-left", ({ socketId }) => {
          if (peersRef.current[socketId]) {
            peersRef.current[socketId].close();
            delete peersRef.current[socketId];
          }
          setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
        });

        // ── Chat messages ─────────────────────────────────────────────────
        socket.on("chat-message", (msg) => {
          setChatMessages((prev) => [...prev, msg]);
        });

        // ── Peer media toggles ────────────────────────────────────────────
        socket.on("peer-media-toggle", ({ userId: uid, type, enabled }) => {
          setPeers((prev) =>
            prev.map((p) =>
              p.userId === uid ? { ...p, [`${type}Enabled`]: enabled } : p
            )
          );
        });

      } catch (err) {
        console.error("Media/socket error:", err);
        setConnectionState("error");
      }
    })();

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      Object.values(peersRef.current).forEach((pc) => pc.close());
      socketRef.current?.disconnect();
    };
  }, [eventId, userId, userName, token, createPeer, flushCandidates]);

  // ── Toggle Mic ───────────────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!audioTrack.enabled);
    socketRef.current?.emit("media-toggle", { eventId, userId, type: "audio", enabled: audioTrack.enabled });
  }, [eventId, userId]);

  // ── Toggle Camera ────────────────────────────────────────────────────────
  const toggleCamera = useCallback(() => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setIsCamOff(!videoTrack.enabled);
    socketRef.current?.emit("media-toggle", { eventId, userId, type: "video", enabled: videoTrack.enabled });
  }, [eventId, userId]);

  // ── Screen Share ─────────────────────────────────────────────────────────
  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track in all peer connections
        Object.values(peersRef.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(screenTrack);
        });

        // Replace in local stream preview
        const localVideo = localStreamRef.current?.getVideoTracks()[0];
        if (localVideo) localStreamRef.current.removeTrack(localVideo);
        localStreamRef.current?.addTrack(screenTrack);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));

        screenTrack.onended = () => toggleScreenShare();
        setIsScreenSharing(true);
        socketRef.current?.emit("screen-share-start", { eventId, userId });
      } catch (_) {}
    } else {
      // Restore camera
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const camTrack = camStream.getVideoTracks()[0];

      Object.values(peersRef.current).forEach((pc) => {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(camTrack);
      });

      const screenTrack = localStreamRef.current?.getVideoTracks()[0];
      if (screenTrack) localStreamRef.current.removeTrack(screenTrack);
      localStreamRef.current?.addTrack(camTrack);
      setLocalStream(new MediaStream(localStreamRef.current.getTracks()));

      setIsScreenSharing(false);
      socketRef.current?.emit("screen-share-stop", { eventId, userId });
    }
  }, [isScreenSharing, eventId, userId]);

  // ── Send Chat ─────────────────────────────────────────────────────────────
  const sendChat = useCallback((message) => {
    if (!message.trim() || !socketRef.current) return;
    socketRef.current.emit("chat-message", { eventId, userId, userName, message });
    setChatMessages((prev) => [
      ...prev,
      { userId, userName, message, timestamp: new Date().toISOString(), self: true },
    ]);
  }, [eventId, userId, userName]);

  // ── Leave ─────────────────────────────────────────────────────────────────
  const leaveCall = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    Object.values(peersRef.current).forEach((pc) => pc.close());
    socketRef.current?.disconnect();
    setPeers([]);
    setLocalStream(null);
  }, []);

  return {
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
  };
}