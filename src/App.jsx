import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import BuyList from './pages/BuyList';
import SellList from './pages/SellList';
import AuctionList from './pages/AuctionList';
import Bid from './pages/Bid';
import AuctionRegister from './pages/AuctionRegister';

import JChatListPage from './pages/JChatListPage';
import JChatRoomPage from './pages/JChatRoomPage';

import JMyPage from './pages/JMyPage';
import JBusinessVerify from './pages/JBusinessVerify';
import JWithdrawPage from './pages/JWithdrawPage';
import JProfilePage from './pages/JProfilePage';
import JSalesPage from './pages/JSalesPage'; // 선택적
import JPurchasesPage from './pages/JPurchasesPage';
import JAuctionsPage from './pages/JAuctionsPage';

import BottomNav from './components/BottomNav'; 

function App() {
  return (
    <Router>
      <BottomNav />
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 거래 메뉴 */}
        <Route path="/market/buy" element={<BuyList />} />
        <Route path="/market/sell" element={<SellList />} />
        <Route path="/market/auction" element={<AuctionList />} />
        <Route path="/market/auction/register" element={<AuctionRegister />} />
        <Route path="/market/bid/:id" element={<Bid />} />

        {/* 채팅 */}
        <Route path="/chat" element={<JChatListPage />} />
        <Route path="/chat/:roomId" element={<JChatRoomPage />} />

        {/* 마이페이지 */}
        <Route path="/my" element={<JMyPage />} />
        <Route path="/my/profile" element={<JProfilePage />} />
        <Route path="/my/sell" element={<SellList />} />
        <Route path="/my/purchase" element={<JPurchasesPage />} />
        <Route path="/my/auction" element={<JAuctionsPage />} />
        <Route path="/my/verify" element={<JBusinessVerify />} />
        <Route path="/my/withdraw" element={<JWithdrawPage />} />
      </Routes>
    </Router>
  );
}

export default App;