// pages/ChatRoomPage.jsx
import { useParams } from 'react-router-dom';
import { useState } from 'react';

function ChatRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([
    { sender: '상대방', text: '안녕하세요~ 관심 있어요!' },
    { sender: '나', text: '네! 안녕하세요!' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: '나', text: input }]);
      setInput('');
    }
  };

  return (
    <div>
      <h3>채팅방 #{roomId}</h3>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px' }}>
        {messages.map((msg, i) => (
          <p key={i}><strong>{msg.sender}:</strong> {msg.text}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        placeholder="메시지를 입력하세요"
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
}

export default ChatRoomPage;