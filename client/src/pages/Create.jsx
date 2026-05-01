import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Create() {
  const [joinId, setJoinId] = useState("");
  const navigate = useNavigate();

  const createNewBoard = () => navigate(`/board/${uuidv4().slice(0, 8)}`);

  const joinBoard = (e) => {
    e.preventDefault();
    const trimmed = joinId.trim();
    if (trimmed) navigate(`/board/${trimmed}`);
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#fafafa] relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #d1d5db 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }} />

      {/* Back */}
      <Link to="/"
        className="absolute top-5 left-5 z-20 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Home
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/40 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 mb-1">Start a session</h1>
          <p className="text-sm text-gray-400">Create a new board or join an existing one</p>
        </div>

        {/* Create */}
        <button id="create-board-btn" onClick={createNewBoard}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-900 text-white
                     hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
          Create new board
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">or join</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Join */}
        <form onSubmit={joinBoard} className="flex gap-2">
          <input id="join-room-input" type="text" value={joinId} onChange={(e) => setJoinId(e.target.value)}
            placeholder="Paste Room ID..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400
                       focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all" />
          <button id="join-board-btn" type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700
                       hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
            Join
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-6">Share the Room ID with others to collaborate</p>
      </div>
    </div>
  );
}
