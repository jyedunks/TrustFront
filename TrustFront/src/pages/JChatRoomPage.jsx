import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages, sendMessage } from "../api/chat";

export default function JChatRoomPage() {
  const { roomId } = useParams(); // 라우트가 /chat/:roomId 라고 가정
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  // TODO: 실제 로그인 사용자 ID로 교체
  const senderId = "Tester2";

  useEffect(() => {
    (async () => {
      const data = await getMessages(roomId);
      setMsgs(Array.isArray(data) ? data : []);
    })();
  }, [roomId]);

  const onSend = async () => {
    if (!text.trim()) return;
    await sendMessage({
      roomId,
      senderId,
      content: text.trim(),
      timestamp: Date.now(),
      read: false,
    });
    setText("");
    // 재조회(간단)
    const data = await getMessages(roomId);
    setMsgs(Array.isArray(data) ? data : []);
  };

  return (
    <div>
      <h3>Room: {roomId}</h3>
      <div style={{border:"1px solid #ddd", height:240, overflowY:"auto", padding:8}}>
        {msgs.map((m,i) => (
          <div key={i}><b>{m.senderId}</b>: {m.content}</div>
        ))}
      </div>
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="메시지 입력" />
      <button onClick={onSend}>전송</button>
    </div>
  );
}