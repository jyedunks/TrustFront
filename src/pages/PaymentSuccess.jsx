import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/Client';
import auctionService from '../api/AuctionService';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('processing');
  const [serverMessage, setServerMessage] = useState('');

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');
  const auctionId = searchParams.get('auctionId');
  const userId = 'ffd9c396-b70e-4d59-8d04-fad7b1fa1df2'; // 실제 로그인 사용자 ID로 교체 필요
  const bidAmount = searchParams.get('bidAmount');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const response = await apiClient.post(
          '/depositPayments/confirm',
          { orderId, amount: Number(amount), paymentKey },
          { validateStatus: (status) => status < 500 }
        );

        console.log('서버 응답:', response.data);

        if (response.status >= 200 && response.status < 300) {
          console.log('결제 승인 성공:', response.data);

          // 결제 성공 후 입찰 등록
          if (auctionId && bidAmount) {
            try {
              const bidRes = await auctionService.createBid(auctionId, userId, Number(bidAmount));
              console.log('입찰 등록 완료:', bidRes);
            } catch (bidErr) {
              console.error('입찰 등록 실패:', bidErr);
            }
          }

          // 결제 완료 후 Bid 페이지로 이동 (갱신)
          navigate(`/market/bid/${auctionId}`, { replace: true, state: { refresh: true } });
        } else {
          console.warn('서버에서 경고 응답 반환:', response.data);
          setStatus('error');
          setServerMessage(response.data?.message || '결제 승인 중 오류 발생');
        }
      } catch (error) {
        console.error('결제 승인 중 예외 발생:', error);
        setStatus('error');
        navigate('/payment-fail');
      }
    };

    if (paymentKey && orderId && amount) confirmPayment();
  }, [paymentKey, orderId, amount, navigate, auctionId]);

  return (
    <div style={{ maxWidth: '393px', margin: '120px auto', padding: '20px', textAlign: 'center' }}>
      {status === 'processing' && (
        <>
          <h2>보증금 예치 승인 중...</h2>
          <p>잠시만 기다려 주세요</p>
        </>
      )}

      {status === 'success' && (
        <>
          <h2>보증금 예치 완료</h2>
          <p>{serverMessage}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <h2>결제 승인 실패</h2>
          <p>{serverMessage}</p>
        </>
      )}
    </div>
  );
}

export default PaymentSuccess;
