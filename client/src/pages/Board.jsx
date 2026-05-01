import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.port === "5173" ? "http://localhost:4000" : window.location.origin);

export default function Board() {
  const { roomId } = useParams();
  const [canvasAPI, setCanvasAPI] = useState(null);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [joined, setJoined] = useState(false);
  const [copied, setCopied] = useState(false);

  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);
  const hasInitialized = useRef(false);
  const debounceTimer = useRef(null);

  // Join room after nickname is set
  useEffect(() => {
    if (!joined || !nickname) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("join-room", { roomId, nickname });

    socket.on("init-state", (elements) => {
      if (canvasAPI && elements && elements.length > 0) {
        isRemoteUpdate.current = true;
        canvasAPI.updateScene({ elements });
        requestAnimationFrame(() => { isRemoteUpdate.current = false; });
      }
      hasInitialized.current = true;
    });

    socket.on("elements-updated", (elements) => {
      if (!canvasAPI) return;
      isRemoteUpdate.current = true;
      canvasAPI.updateScene({ elements });
      requestAnimationFrame(() => { isRemoteUpdate.current = false; });
    });

    socket.on("users-update", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [joined, nickname, roomId, canvasAPI]);

  const handleChange = useCallback((elements) => {
    if (isRemoteUpdate.current || !hasInitialized.current || !socketRef.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      socketRef.current.emit("update-elements", {
        roomId,
        elements: JSON.parse(JSON.stringify(elements)),
      });
    }, 100);
  }, [roomId]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      setNickname(nickname.trim());
      setJoined(true);
    }
  };

  // ─── Nickname Prompt ───
  if (!joined) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="w-full max-w-sm mx-4 p-8 bg-white rounded-2xl border border-gray-200 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6965db] mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Enter your nickname</h2>
            <p className="text-sm text-gray-400">This will be shown to other collaborators</p>
          </div>

          <form onSubmit={handleJoin}>
            <input
              autoFocus
              type="text"
              placeholder="Your name..."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#6965db] focus:ring-2 focus:ring-[#6965db]/10 transition-all mb-4"
            />
            <button
              type="submit"
              disabled={!nickname.trim()}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-[#6965db] text-white hover:bg-[#5a57cb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Join Board
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Room:</span>
            <code className="px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-600">{roomId}</code>
          </div>
        </div>
      </div>
    );
  }

  // ─── Board ───
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <style>{`
        a[href*="excalidraw"], a[href*="github.com/excalidraw"],
        a[href*="plus.excalidraw"], a[href*="blog.excalidraw"],
        .excalidraw a[target="_blank"],
        [data-testid="main-menu-item-github"],
        [data-testid="main-menu-item-excalidraw-blog"],
        [data-testid="main-menu-item-excalidraw-plus"] {
          display: none !important;
        }
      `}</style>

      {/* Top overlay bar */}
      <div className="absolute top-[60px] right-3 md:top-3 md:right-3 z-[100] flex flex-col md:flex-row items-end md:items-center gap-2 pointer-events-none" style={{ fontFamily: "'Inter', sans-serif" }}>
        {/* Room code + copy */}
        <button
          onClick={copyRoomId}
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm text-sm hover:bg-gray-50 transition-colors cursor-pointer pointer-events-auto"
        >
          <code className="font-mono text-gray-600 text-xs">{roomId}</code>
          <span className="text-gray-400">
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2f9e44" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
          </span>
        </button>

        {/* Connected users */}
        <div className="flex items-center gap-1 px-3 py-2 bg-white/90 backdrop-blur border border-gray-200 rounded-lg shadow-sm pointer-events-auto">
          <div className="flex -space-x-2">
            {users.map((u, i) => (
              <div
                key={i}
                title={u.name}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                style={{ backgroundColor: u.color, zIndex: users.length - i }}
              >
                {u.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">{users.length} online</span>
        </div>
      </div>

      <Excalidraw
        excalidrawAPI={(api) => setCanvasAPI(api)}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: { saveFileToDisk: true },
          },
          welcomeScreen: false,
        }}
      />
    </div>
  );
}
