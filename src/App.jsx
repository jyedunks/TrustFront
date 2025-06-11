import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import BuyList from './pages/BuyList';
import SellForm from './pages/SellForm';
import SellList from './pages/SellList';
import AuctionList from './pages/AuctionList';
import Bid from './pages/Bid';
import SuccessBid from './pages/SuccessBid';
import AuctionRegister from './pages/AuctionRegister';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import Deposit from './pages/Deposit';
import FailBid from './pages/FailBid';
import SellerBid from './pages/SellerBid';

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
import JSellerItemDetailPage from './pages/JSellerItemDetailPage';
import JLoginPage from './pages/JLoginPage';
import JItemDetailPage from './pages/JItemDetailPage';
import JTossPayment from './pages/JTossPayment';
import JItemListPage from './pages/JItemListPage';





function App() {
  return (
    <Router>
      <BottomNav />
      <Routes>
        {/* 홈 */}

<Route path="/items" element={<JItemListPage />} />

<Route path="/payment" element={<JTossPayment />} />
        <Route path="/items/:id" element={<JItemDetailPage />} />
        <Route path="/login" element={<JLoginPage />} />
        <Route path="/my/seller-item/:id" element={<JSellerItemDetailPage />} />
        <Route path="/" element={<Home />} />

        {/* 거래 메뉴 */}
        <Route path="/market/buy" element={<BuyList />} />
        <Route path="/sellform" element={<SellForm />} />
        <Route path="/market/sell" element={<SellList />} />
        <Route path="/market/auction" element={<AuctionList />} />
        <Route path="/market/auction/register" element={<AuctionRegister />} />
        <Route path="/market/bid/:id" element={<Bid />} />
        <Route path="/success" element={<SuccessBid />} />
        <Route path="/failbid" element={<FailBid />} />
        <Route path="/bid/manage/:id" element={<SellerBid />} />

        {/* 보증금예치 */}    
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/payment-success" element={<PaymentSuccess />}/>
        <Route path="/payment-fail" element={<PaymentFail />}/>

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