// src/pages/JItemDetailPage.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { createOrGetRoom } from "@/api/chat";
import { getCurrentUserId } from "@/utils/auth"; 

console.count("RENDER JItemDetailPage");

export default function JItemDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state } = useLocation();

  // 리스트에서 넘겨준 아이템 (JItemListPage에서 navigate 시 state로 전달)
  const [item, setItem] = useState(state?.item || null);
  const [busy, setBusy] = useState(false);

  // ✅ StrictMode(2회 렌더) 방지용
  const fetchedOnce = useRef(false);

  // ✅ 새로고침 진입 시, state에 아이템이 없을 경우만 fetch 실행
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    if (!item && id) {
      (async () => {
        try {
          const res = await fetch(`/api/product/${id}`);
          if (!res.ok) throw new Error("상품 조회 실패");
          const data = await res.json();
          setItem(data);
        } catch (err) {
          console.error("[상품 조회 실패]", err);
          alert("상품 정보를 불러올 수 없습니다.");
        }
      })();
    }
  }, [id, item]);

  // ✅ 로그인 사용자 ID (프로젝트 전역 규격으로 통일)
  const buyerId = getCurrentUserId();

  // ✅ 판매자 식별값 (백엔드 응답 구조에 따라 매핑)
  const sellerId = item?.sellerId || item?.sellerAccount || "businessuser";

  // ✅ 결제 페이지로 이동 (/payment)
  const goPay = () => {
    if (!item) return alert("상품 정보를 찾을 수 없습니다.");

    const qs = new URLSearchParams({
      productId: String(item.id),
      buyerId,
      sellerId: String(sellerId),
      amount: String(item.price),
      itemName: item.title || `상품 #${id}`,
    }).toString();

    nav(`/payment?${qs}`);
  };

  // ✅ 채팅방 생성/조회 후 바로 이동 (통일 ID 사용 + 파싱 보강)
  const goChat = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!item) return alert("상품 정보를 찾을 수 없습니다.");

    try {
      setBusy(true);

      const res = await createOrGetRoom({
        sellerId,
        buyerId,          // ✅ 전역 규격 ID
        itemId: item.id,
      });

      const roomId =
        (typeof res === "string" && res) ||
        res?.roomId ||
        res?.id ||
        (typeof res?.data === "string" && res.data) ||
        res?.data?.roomId ||
        res?.data?.id;

      if (!roomId) {
        console.error("[createOrGetRoom 응답]", res);
        throw new Error("채팅방 생성/조회 실패: roomId 없음");
      }

      // ✅ 방 생성 직후, 최근 방 로컬 
      try {
        const key = "RECENT_ROOMS";
        const now = Date.now();
        const meta = { roomId, productId: item.id, sellerId, buyerId, lastTime: now };
        const prev = JSON.parse(localStorage.getItem(key) || "[]");

  // 중복 제거 후 맨 앞 삽입
        const next = [meta, ...prev.filter((r) => r.roomId !== roomId)].slice(0, 30);
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}

      // ✅ 채팅방 이동 (낙관적 메타 동봉)
      nav(`/chat/${encodeURIComponent(roomId)}`, {
        state: {
          room: {
            id: roomId,
            title: item.title,
            productId: item.id,
            sellerId,
            buyerId,
          },
        },
      });
    } catch (err) {
      console.error("[goChat error]", err);
      alert("채팅방을 열 수 없습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  // ✅ item이 없으면 fallback
  if (!item) {
    return (
      <div style={{ padding: 24 }}>
        <h2>상품을 찾을 수 없습니다.</h2>
        <Link to="/">← 홈으로</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <Link to=".." relative="path" style={{ color: "#555" }}>
        ← 목록으로
      </Link>

      {/* 상품 정보 */}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <img
          src={item.thumbnailUrl?.split("?")[0] || "/placeholder.png"}
          alt={item.title}
          width="96"
          height="96"
          style={{
            borderRadius: 12,
            objectFit: "cover",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            background: "#f3f4f6",
          }}
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        <div>
          <h2 style={{ margin: 0 }}>{item.title}</h2>
          {item.description && (
            <p style={{ margin: "6px 0", color: "#666" }}>{item.description}</p>
          )}
          <p style={{ fontWeight: 700 }}>
            {Number(item.price).toLocaleString()}원
          </p>
          <div style={{ color: "#777", fontSize: 13 }}>
            판매자: {item.sellerNickname || "일반"} · 상태:{" "}
            {item.status || "판매중"}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 8,
        }}
      >
        <button
          type="button"
          onClick={goChat}
          disabled={busy}
          style={{
            height: 44,
            borderRadius: 12,
            border: "1px solid #e5e5e5",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? "채팅 여는 중..." : "채팅하기"}
        </button>

        <button
          type="button"
          onClick={goPay}
          style={{
            height: 44,
            borderRadius: 12,
            background: "#111",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          결제하기
        </button>
      </div>

      {/* 디버그 정보 */}
      <div
        style={{
          marginTop: 8,
          padding: 12,
          border: "1px dashed #ddd",
          borderRadius: 10,
          color: "#666",
          fontSize: 13,
        }}
      >
        <div>productId: {item.id}</div>
        <div>buyerId: {buyerId}</div>
        <div>sellerId: {sellerId}</div>
        <div>amount: {Number(item.price).toLocaleString()}원</div>
      </div>
    </div>
  );
}