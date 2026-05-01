# InkSpace 🎨

A modern, real-time collaborative whiteboard built for sketching hand-drawn diagrams, brainstorming, and visual collaboration. 

InkSpace features a beautiful, distraction-free interface that lets you and your team focus on ideas.

## ✨ Features

- **Real-time Collaboration**: Instantly see changes as others draw using Socket.io.
- **Session Persistence**: Join late and instantly get the latest board state.
- **User Presence**: See exactly who is in the room with live online counters and color-coded avatars.
- **Custom Nicknames**: Easily identify your collaborators.
- **Rich Drawing Tools**: Supports freehand drawing, shapes (rectangles, diamonds, ellipses), arrows, lines, and text.
- **Export**: Save your boards directly to your device.
- **Responsive Design**: Works seamlessly across all devices.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MahmoudEsawi/collaborative-whiteboard.git
   cd collaborative-whiteboard
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm install
   npm start
   ```
   *The server will run on http://localhost:4000*

3. **Start the Frontend Client**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *The app will be available at http://localhost:5173*

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express
- **Real-time Engine**: Socket.io

## 💡 How to Collaborate

1. Start the app and click **Start Drawing**.
2. Enter your nickname.
3. Once in the board, copy the Room ID from the top right corner.
4. Share the ID with your team.
5. They can enter the ID on the homepage to join your session instantly!

---
*Built with ❤️ for seamless visual collaboration.*
