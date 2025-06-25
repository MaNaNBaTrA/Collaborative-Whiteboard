# 🎨 Whiteboard Collaborative App

A real-time collaborative whiteboard application built with React and Node.js, allowing multiple users to draw, sketch, and collaborate together in real-time.

## ✨ Features

- **Real-time Collaboration** - Multiple users can draw simultaneously
- **Interactive Drawing Tools** - Pencil, brush, shapes, and more
- **Live Cursor Tracking** - See where other users are drawing
- **Instant Sync** - Changes are synchronized across all connected clients
- **Clean Interface** - Intuitive and user-friendly design

## 🏗️ Architecture

```
whiteboard-app/
├── collaborative-whiteboard-client/    # React frontend (Create React App)
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   └── package.json
├── server/          # Node.js backend (Express + Socket.io)
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whiteboard-collaborative-app.git
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd collaborative-whiteboard-client
   npm install
   ```

### Running the Application

1. **Start the server** (from the `server` directory)
   ```bash
   cd server
   npm start
   ```
   The server will start on `http://localhost:5000`

2. **Start the client** (from the `collaborative-whiteboard-client` directory)
   ```bash
   cd client
   npm start
   ```
   The React app will start on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend (Client)
- **React** - UI library
- **Create React App** - Build toolchain
- **Socket.io Client** - Real-time communication
- **HTML5 Canvas** - Drawing surface
- **CSS3** - Styling and animations

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket library for real-time communication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

### Client Structure
```
collaborative-whiteboard-client/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── DrawingCanvas.jsx
│   │   ├── RoomJoin.jsx
│   │   ├── Toolbar.jsx
│   │   ├── UserCursors.jsx
│   │   └── Whiteboard.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.jsx
│   └── index.css
└── package.json
```

### Server Structure
```
server/
├── models/
│   └── Room.js
├── routes/
│   └── rooms.js
├── socket/
│   └── socketHandlers.js
├── server.js
├── .env
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/whiteboard-app
CLIENT_URL=http://localhost:3000
PORT=5000
```

## 🎮 Usage

1. **Start Drawing** - Click and drag on the canvas to start drawing
2. **Change Tools** - Use the toolbar to select different drawing tools
3. **Collaborate** - Share the URL with others to collaborate in real-time
4. **See Live Cursors** - Watch other users' cursors move in real-time
5. **Clear Canvas** - Use the clear button to reset the whiteboard


⭐ **Star this repository if you found it helpful!**
