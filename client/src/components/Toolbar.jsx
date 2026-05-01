import { useState } from "react";

const COLORS = [
  { name: "White", hex: "#ffffff" },
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Green", hex: "#22c55e" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Cyan", hex: "#06b6d4" },
];

export default function Toolbar({
  color, setColor, brushSize, setBrushSize,
  isEraser, setIsEraser, onClear, onExport,
  userCount, roomId,
}) {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Sep = () => <div className="w-px h-6 bg-white/[0.07]" />;

  return (
    <div className="glass-strong rounded-2xl px-4 py-2.5 flex items-center gap-4 flex-wrap justify-center">
      {/* Room ID */}
      <button id="copy-room-btn" onClick={copyRoomId} title="Copy Room ID"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                   bg-white/[0.04] border border-white/[0.08] text-slate-400
                   hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? <span className="text-emerald-400">Copied!</span> : roomId}
      </button>

      <Sep />

      {/* Colors */}
      <div className="flex items-center gap-1">
        {COLORS.map((c) => (
          <button key={c.hex} id={`color-${c.name.toLowerCase()}`} title={c.name}
            onClick={() => { setColor(c.hex); setIsEraser(false); }}
            className="w-6 h-6 rounded-full transition-all duration-200 cursor-pointer hover:scale-125 active:scale-95"
            style={{
              backgroundColor: c.hex,
              border: color === c.hex && !isEraser
                ? `2px solid rgba(255,255,255,0.9)` : `2px solid rgba(255,255,255,0.1)`,
              boxShadow: color === c.hex && !isEraser ? `0 0 12px ${c.hex}60` : "none",
            }}
          />
        ))}
      </div>

      <Sep />

      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
        <input id="brush-size-slider" type="range" min="1" max="30" value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-20 h-1 rounded-full appearance-none cursor-pointer bg-white/10
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
                     [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:shadow-indigo-500/30 [&::-webkit-slider-thumb]:cursor-pointer" />
        <span className="text-[10px] text-slate-500 w-4 text-center font-mono">{brushSize}</span>
      </div>

      <Sep />

      {/* Eraser */}
      <button id="eraser-btn" onClick={() => setIsEraser(!isEraser)} title="Eraser"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isEraser
            ? "bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shadow-lg shadow-indigo-500/10"
            : "bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08] hover:text-white"
        }`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Eraser
      </button>

      {/* Clear */}
      <button id="clear-board-btn" onClick={onClear} title="Clear entire board"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-red-500/[0.08] border border-red-500/[0.15] text-red-400
                   hover:bg-red-500/[0.15] hover:text-red-300 transition-all duration-200 cursor-pointer">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear
      </button>

      {/* Export */}
      <button id="export-png-btn" onClick={onExport} title="Export as PNG"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-emerald-500/[0.08] border border-emerald-500/[0.15] text-emerald-400
                   hover:bg-emerald-500/[0.15] hover:text-emerald-300 transition-all duration-200 cursor-pointer">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export
      </button>

      <Sep />

      {/* Users Online */}
      <div id="user-count-display"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                   bg-emerald-500/[0.08] border border-emerald-500/[0.15] text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {userCount} online
      </div>
    </div>
  );
}
