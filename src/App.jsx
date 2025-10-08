// src/App.jsx (상단 import 정리)
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation,
} from "react-router-dom";

/* 공개 라우트 */
import JLoginPage from "./pages/JLoginPage";
import JSignUpPage from "./pages/JSignUpPage";
import JOauthKakao from "./pages/JOauthKakao";

/* 보호 라우트 */
import Home from "./pages/Home";
import SellForm from "./pages/SellForm";
import SellList from "./pages/SellList";
import AuctionList from "./pages/AuctionList";
import AuctionRegister from "./pages/AuctionRegister";
import Bid from "./pages/Bid";
import SuccessBid from "./pages/SuccessBid";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import Deposit from "./pages/Deposit";
import FailBid from "./pages/FailBid";
import SellerBid from "./pages/SellerBid";

import JChatListPage from "./pages/JChatListPage";
import JChatRoomPage from "./pages/JChatRoomPage";   // ✅ 이것만 사용

import JMyPage from "./pages/JMyPage";
import JBusinessVerify from "./pages/JBusinessVerify";
import JWithdrawPage from "./pages/JWithdrawPage";
import JProfilePage from "./pages/JProfilePage";
import JSalesPage from "./pages/JSalesPage";
import JPurchasesPage from "./pages/JPurchasesPage";
import JAuctionsPage from "./pages/JAuctionsPage";

import JItemListPage from "./pages/JItemListPage";
import JItemDetailPage from "./pages/JItemDetailPage"; // 필요하면 유지

import JSellerItemPage from "./pages/JSellerItemPage";
import JSellerItemDetailPage from "./pages/JSellerItemDetailPage"; // ✅ 한 번만!
import JTossPayment from "./pages/JTossPayment";

/* 공통 */
import BottomNav from "./components/BottomNav";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  // Kakao SDK 초기화 (컴포넌트 안에서!)
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const key = import.meta.env.VITE_KAKAO_JS_KEY;
      try {
        if (key) window.Kakao.init(key);
      } catch (e) {
        console.warn("Kakao init failed:", e);
      }
    }
  }, []);

  // 다른 탭에서 토큰 변경되면 상태 동기화
  useEffect(() => {
    const onStorage = () =>
      setIsLoggedIn(!!localStorage.getItem("access_token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <Router>
      <Routes>
        {/* 진입 시: 로그인 여부에 따라 분기 */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
        />

        {/* ===== 공개 ===== */}
        <Route path="/login" element={<JLoginPage />} />
        <Route path="/signup" element={<JSignUpPage />} />
        <Route path="/oauth/kakao" element={<JOauthKakao />} />

        {/* ===== 보호(바텀내브 포함 레이아웃) ===== */}
        <Route
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <LayoutWithBottomNav />
            </Protected>
          }
        >
          <Route path="/home" element={<Home />} />

          {/* 상품 */}
          <Route path="/items" element={<JItemListPage />} />
          <Route path="/items/:id" element={<JItemDetailPage />} />
          <Route path="/my/seller-item/:id" element={<JSellerItemDetailPage />} />

          {/* 일반 거래 */}
          {/* 일반 거래 */}
          <Route path="/market/buy" element={<JSellerItemPage />} />
          <Route path="/market/buy/:id" element={<JSellerItemDetailPage />} />

          <Route path="/market/sell" element={<SellList />} />
          <Route path="/sellform" element={<SellForm />} />

          {/* 경매 */}
          <Route path="/market/auction" element={<AuctionList />} />
          <Route path="/auctionregister" element={<AuctionRegister />} />
          <Route path="/market/bid/:id" element={<Bid />} />
          <Route path="/success" element={<SuccessBid />} />
          <Route path="/failbid" element={<FailBid />} />
          <Route path="/bid/manage/:id" element={<SellerBid />} />

          {/* 결제 */}
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-fail" element={<PaymentFail />} />
          <Route path="/payment" element={<JTossPayment />} />

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
        </Route>

        {/* 그 외 경로 */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

/* 보호 래퍼 */
function Protected({ isLoggedIn, children }) {
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

/* 바텀내브가 깔린 레이아웃 */
function LayoutWithBottomNav() {
  return (
    <>
      <BottomNav />
      <div style={{ minHeight: "100dvh" }}>
        <Outlet />
      </div>
    </>
  );
}

export default App;