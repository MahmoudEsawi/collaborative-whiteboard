import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Landing() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const startDrawing = () => {
    navigate(`/board/${uuidv4().slice(0, 8)}`);
  };

  const joinSession = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/board/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-[#ececfb]">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#6965db] flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-800">InkSpace</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 text-center pb-20">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6 max-w-4xl leading-[1.1]">
          Virtual whiteboard for<br />sketching hand-drawn like diagrams
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-500 mb-8 sm:mb-12 max-w-2xl font-medium">
          Collaborate, sketch, and brainstorm in real-time with your team.
        </p>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center max-w-xl mx-auto">
          <button 
            onClick={startDrawing}
            className="w-full md:w-auto px-8 py-3.5 bg-[#6965db] hover:bg-[#5a57cb] text-white font-bold rounded-lg shadow-sm transition-colors text-base cursor-pointer whitespace-nowrap"
          >
            Start drawing
          </button>
          
          <div className="text-gray-400 font-medium hidden md:block">— or —</div>
          
          <form onSubmit={joinSession} className="w-full md:w-auto flex shadow-sm rounded-lg">
            <input 
              type="text" 
              placeholder="Enter Room ID" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full md:w-48 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-l-lg outline-none focus:border-[#6965db] transition-colors text-gray-700 text-base"
            />
            <button 
              type="submit"
              className="px-6 py-3.5 bg-white border border-l-0 border-gray-200 rounded-r-lg text-[#6965db] font-bold hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Join
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 font-medium w-full">
        Built with ❤️ by{" "}
        <a 
          href="https://github.com/MahmoudEsawi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#6965db] hover:underline"
        >
          Mahmoud Esawi
        </a>
      </footer>
    </div>
  );
}
