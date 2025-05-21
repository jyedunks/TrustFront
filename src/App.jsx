import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import MyPage from './pages/MyPage';
import ItemListPage from './pages/ItemListPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ChatListPage from './pages/ChatListPage';
import ChatRoomPage from './pages/ChatRoomPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<ItemListPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomPage />} />
          <Route path="/my" element={<MyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;