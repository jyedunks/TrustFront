// src/pages/ChatRoomPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function ChatRoomPage() {
  const { roomId } = useParams();

  return (
    <div>
      <h2>채팅방</h2>
      <p>채팅방 ID: {roomId}</p>
    </div>
  );
}

export default ChatRoomPage;