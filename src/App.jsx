//import { useState } from 'react'
import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SellForm from './pages/SellForm';
import SellList from './pages/SellList';
import BuyList from './pages/BuyList';
import AuctionList from './pages/AuctionList';
import Bid from './pages/Bid';
import SuccessBid from './pages/SuccessBid';
import Deposit from './pages/Deposit';
import AuctionRegister from './pages/AuctionRegister';
import FailBid from './pages/FailBid';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import SellerBid from './pages/SellerBid';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sellform" element={<SellForm />} />
        <Route path="/sell" element={<SellList />} />
        <Route path="/buy" element={<BuyList />} />
        <Route path="/auction" element={<AuctionList />} />
        <Route path="/bid:id" element={<Bid />} />
        <Route path="/bid/manage/:id" element={<SellerBid />} />
        <Route path="/success" element={<SuccessBid />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/auctionregister" element={<AuctionRegister />} />
        <Route path="/fail" element={<FailBid/>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-fail" element={<PaymentFail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

