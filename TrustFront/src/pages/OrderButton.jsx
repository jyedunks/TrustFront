import React from 'react';

function OrderButton() {
  const handleOrder = () => {
    fetch("http://10.210.8.226:8080/orders/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: 7,
        buyerId: "28a95534-f876-4656-a577-1556461c2889",
        sellerId: "8058f974-accc-4c13-ae13-c62187e0ca2c"
      })
    })
      .then(response => {
        if (!response.ok) throw new Error("서버 응답 실패");
        return response.text(); // 또는 response.json() 백엔드 응답 형식에 따라
      })
      .then(data => {
        console.log("주문 성공:", data);
        alert("주문 완료!");
      })
      .catch(error => {
        console.error("주문 실패:", error);
        alert("주문 실패 ㅠㅠ");
      });
  };

  return (
    <button onClick={handleOrder}>
      주문하기
    </button>
  );
}

export default OrderButton;