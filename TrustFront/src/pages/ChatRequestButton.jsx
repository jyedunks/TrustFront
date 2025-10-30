import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatRequestButton() {
  const navigate = useNavigate();

  const handleChatRequest = () => {
    fetch("http://10.210.11.204:8080/api/chat/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itemId: 7,
        buyerId: "28a95534-f876-4656-a577-1556461c2889",
        sellerId: "8058f974-accc-4c13-ae13-c62187e0ca2c"
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("채팅 생성 실패");
        return res.text(); // 채팅방 ID가 문자열로 반환됨
      })
      .then((chatRoomId) => {
        console.log("채팅방 ID:", chatRoomId);
        alert("채팅 요청 성공!");

        // ✅ 채팅방 페이지로 이동
        navigate(`/chat/${chatRoomId}`);
      })
      .catch((err) => {
        console.error(err);
        alert("채팅 요청 실패 ㅠㅠ");
      });
  };

  return (
    <button
      onClick={handleChatRequest}
      style={{
        padding: '10px',
        backgroundColor: '#ddd',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
      }}
    >
      채팅 요청하기
    </button>
  );
}

export default ChatRequestButton;