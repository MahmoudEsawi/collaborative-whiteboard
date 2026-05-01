import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Create from "./pages/Create";
import Board from "./pages/Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<Create />} />
        <Route path="/board/:roomId" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
