---

# Chat App 💬

A real-time chat application built using the **MERN Stack** (MongoDB, Express, React, Node.js) with **Socket.IO** for live messaging. The app supports user authentication, real-time messaging, and image upload via Cloudinary.

---

## 📁 Project Structure

```

/chat-app
│
├── frontend     # React + Vite frontend
└── backend      # Node.js + Express + MongoDB + Socket.IO backend

````

---

## 🚀 Features

- Realtime messaging with Socket.IO
- User authentication using JWT
- Cloud-based image uploads (Cloudinary)
- Fully separated client and server setup

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/minhtrannguyen-git/chat-app.git
cd chat-app
````

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## 📦 Running the App in Development

Make sure both the backend and frontend are running in separate terminals.

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🛠️ Environment Variables

### Backend (`/chat-app/backend/.env`)

Create a `.env` file and add the following:

```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONT_END_URL=http://localhost:5173

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`/chat-app/frontend/.env`)

Create a `.env` file and add the following:

```
VITE_BACKEND_SOCKET_URL=http://localhost:5001
```

---

## 📸 Screenshots
<img width="1362" alt="chat-app" src="https://github.com/user-attachments/assets/ac295a19-7682-4319-a1b3-66b4e93232bf" />


---

## 🙌 Acknowledgments

* [Socket.IO](https://socket.io/)
* [Cloudinary](https://cloudinary.com/)
* [MongoDB](https://www.mongodb.com/)
* [React](https://react.dev/)
* [Vite](https://vite.dev/)
* [Express](https://expressjs.com/)

---
