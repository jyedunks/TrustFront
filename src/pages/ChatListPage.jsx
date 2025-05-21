// pages/ChatListPage.jsx
import { Link } from 'react-router-dom';

const dummyChatRooms = [
  { id: 1, buyer: '김공주', lastMessage: '안녕하세요~ 관심 있어요!', itemTitle: '에어팟 프로' },
  { id: 2, buyer: '이용자', lastMessage: '혹시 직거래 가능할까요?', itemTitle: '맥북 에어' },
];

function ChatListPage() {
  return (
    <div>
      <h2>채팅 목록</h2>
      <ul>
        {dummyChatRooms.map(room => (
          <li key={room.id}>
            <Link to={`/chat/${room.id}`}>
              <strong>{room.itemTitle}</strong><br />
              {room.buyer}: {room.lastMessage}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatListPage;