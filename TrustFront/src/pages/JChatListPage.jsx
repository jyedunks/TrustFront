// src/pages/JChatListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserRooms, getMessages } from "../api/chat";

/** ─── 유틸: 현재 사용자 UUID 얻기 ───────────────────────────────────────── */
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
function resolveCurrentUserUuid(searchParams) {
  // 1) URL ?uuid=... 가 있으면 우선 사용(테스트용)
  const fromQuery = searchParams.get("uuid");
  if (fromQuery) return fromQuery;

  // 2) localStorage.userUuid (로그인 응답에서 저장했다면)
  const fromLS = localStorage.getItem("userUuid");
  if (fromLS) return fromLS;

  // 3) JWT(accessToken) payload에서 추출 (백엔드 클레임 키에 맞춰 변경)
  const token = localStorage.getItem("accessToken");
  if (token) {
    const p = decodeJwt(token);
    const uuid = p?.userUuid || p?.uuid || p?.sub;
    if (uuid) return uuid;
  }

  // 4) 실패 시 null
  return null;
}
/** ──────────────────────────────────────────────────────────────────────── */

export default function JChatListPage() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const currentUserUuid = useMemo(() => resolveCurrentUserUuid(sp), [sp]);

  const [items, setItems] = useState([]); // [{roomId, lastMsg, lastTime, lastSender}]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);

      if (!currentUserUuid) {
        throw new Error("로그인이 필요합니다. (사용자 UUID를 확인할 수 없습니다)");
      }

      // 1) 유저의 방 코드 배열
      const roomIds = await getUserRooms(currentUserUuid); // ["Tester1:Tester2:TestItem", ...]
      if (!Array.isArray(roomIds) || roomIds.length === 0) {
        setItems([]);
        return;
      }

      // 2) 각 방의 마지막 메시지 미리보기 병렬 조회
      const previews = await Promise.all(
        roomIds.map(async (rid) => {
          try {
            const msgs = await getMessages(rid);
            const list = Array.isArray(msgs) ? msgs : [];
            // 최신순 정렬 후 첫 번째
            const last = list.sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0))[0];
            return {
              roomId: rid,
              lastMsg: last?.content || "(메시지 없음)",
              lastTime: last?.timestamp || 0,
              lastSender: last?.senderId || "",
            };
          } catch {
            return { roomId: rid, lastMsg: "(불러오기 실패)", lastTime: 0, lastSender: "" };
          }
        })
      );

      // 3) 최근 시간순 정렬
      previews.sort((a, b) => b.lastTime - a.lastTime);
      setItems(previews);
    } catch (e) {
      setErr(e.message || String(e));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserUuid]);

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: "0 12px" }}>
      <h2 style={{ fontWeight: 700 }}>채팅방 목록</h2>

      {/* 상태 표시 */}
      {err && (
        <div style={{ color: "tomato", marginBottom: 12 }}>
          {err}
          <button style={{ marginLeft: 8 }} onClick={load}>
            다시 시도
          </button>
        </div>
      )}
      {!err && items.length === 0 && <p>채팅방이 없습니다.</p>}

      {/* 리스트 */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map(({ roomId, lastMsg, lastTime, lastSender }) => (
          <li
            key={roomId}
            onClick={() => nav(`/chat/${encodeURIComponent(roomId)}`)}
            style={{
              padding: "12px 8px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{roomId}</div>
            <div style={{ fontSize: 14, color: "#555" }}>
              {lastSender ? <b>{lastSender}: </b> : null}
              {lastMsg}
            </div>
            {lastTime ? (
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {new Date(lastTime).toLocaleString()}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {/* 개발 편의: 현재 UUID 표시(배포 시 제거 가능) */}
      <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
        현재 사용자 UUID: <code>{currentUserUuid ?? "(없음)"}</code>
      </div>
    </div>
  );
}