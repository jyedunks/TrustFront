// src/pages/JChatListPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { getSavedUser, getMe } from "@/api/auth";
import { getUserRooms, listMyRooms, getMessages } from "@/api/chat";

/* ── JWT 디코더 ─────────────────────────────────────────────────────── */
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}
/* ─────────────────────────────────────────────────────────────────── */

/** 다양한 응답 → [roomId,...] 로 정규화 */
function normalizeRoomIds(raw) {
  if (!raw) return [];
  if (typeof raw === "string") return [raw];
  if (Array.isArray(raw)) {
    const arr = raw
      .map((v) =>
        typeof v === "string" ? v : v?.roomId || v?.id || v?.RID || v?.rid || null
      )
      .filter(Boolean);
    if (arr.length) return arr;
  }
  const cands = [
    raw.roomIds,
    raw.rooms,
    raw.list,
    raw.data?.roomIds,
    raw.data?.rooms,
    raw.data?.list,
    raw.data,
  ].filter(Boolean);
  for (const c of cands) {
    const n = normalizeRoomIds(c);
    if (n.length) return n;
  }
  return [];
}

/** 표시용 제목 생성 (UUID/ROOMID 안 보이게) */
function prettifyTitleFrom(rid, sampleMsgs = []) {
  const first = sampleMsgs[0] || {};
  // 백이 내려주는 필드가 있다면 우선 사용
  const byPayload =
    first.productTitle || first.itemName || first.productName || first.title;
  if (byPayload) return String(byPayload);

  try {
    const parts = decodeURIComponent(String(rid)).split(":");
    const looksUuid = (s) => typeof s === "string" && (s.match(/-/g) || []).length >= 3;

    // 흔한 패턴: seller:buyer:productId
    const seller = parts[0];
    const productIdPart = parts[2] || parts[1];

    if (seller && !seller.includes("GUEST") && !looksUuid(seller)) {
      // 판매자명이 깔끔하면 그걸 사용
      if (productIdPart && !looksUuid(productIdPart)) {
        return `${seller} · ${productIdPart}`;
      }
      return `${seller} 님과의 채팅`;
    }
    // 다 못 뽑으면 짧게
    const tail = productIdPart || parts[0] || String(rid);
    return `채팅방 (${String(tail).slice(0, 6)}…)`;
  } catch {
    return "채팅방";
  }
}

/** ✅ 사용자 UUID 복구: USER_UUID(로컬) → /auth/me → URL ?UUID/uuid → JWT */
async function resolveUserAndUuid(searchParams) {
  let uuid = localStorage.getItem("USER_UUID");
  let user = getSavedUser();

  if (!user) {
    try {
      user = await getMe(); // 백에서 uuid 포함해 내려준다고 가정
    } catch {}
  }
  if (!uuid) uuid = user?.uuid || null;

  const fromQuery =
    searchParams.get("UUID") ||
    searchParams.get("uuid") ||
    searchParams.get("userUuid") ||
    searchParams.get("user_uuid");
  if (fromQuery) uuid = fromQuery;

  if (!uuid) {
    const token =
      localStorage.getItem("ACCESS_TOKEN") || localStorage.getItem("accessToken");
    if (token) {
      const p = decodeJwt(token);
      uuid = p?.userUuid || p?.uuid || p?.sub || null;
    }
  }

  return { user, uuid };
}

export default function JChatListPage() {
  const nav = useNavigate();
  const { state } = useLocation(); // 상세에서 넘긴 낙관적 메타
  const [sp] = useSearchParams();

  // 상세 → 채팅으로 이동할 때 state.room.id를 싣고 왔다면 우선 반영
  const optimisticRoomId = state?.room?.id || localStorage.getItem("LAST_ROOM_ID") || null;

  const [items, setItems] = useState([]); // [{roomId, title, lastMsg, lastTime}]
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // /chat?UUID=... 로 진입해도 즉시 저장 (딥링크/리다이렉트용)
  useEffect(() => {
    const qUuid =
      sp.get("UUID") || sp.get("uuid") || sp.get("userUuid") || sp.get("user_uuid");
    if (qUuid) {
      localStorage.setItem("USER_UUID", qUuid);
      const raw = localStorage.getItem("AUTH_USER");
      const u = raw ? JSON.parse(raw) : {};
      localStorage.setItem("AUTH_USER", JSON.stringify({ ...u, uuid: qUuid }));
    }
  }, [sp]);

  const memoKey = useMemo(() => sp.toString(), [sp]); // 쿼리 변화 감지

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);

      // 사용자/UUID 복구
      const { user, uuid } = await resolveUserAndUuid(sp);
      setMe(user || null);

      if (!uuid) {
        throw new Error("로그인이 필요합니다. (사용자 UUID를 확인할 수 없습니다)");
      }

      // 1) 서버 목록
      let rawRooms;
      try {
        rawRooms = await (getUserRooms ? getUserRooms(uuid) : listMyRooms(uuid));
      } catch (e) {
        if (getUserRooms && listMyRooms) {
          rawRooms = await listMyRooms(uuid); // 호환 재시도
        } else {
          throw e;
        }
      }
      console.log("[rooms raw]", rawRooms);
      let roomIds = normalizeRoomIds(rawRooms);

      // 2) 로컬 캐시/낙관 병합 (서버가 빈 배열이어도 유저에게 보이게)
      const recent = JSON.parse(localStorage.getItem("RECENT_ROOMS") || "[]"); // [{roomId,lastTime,...}]
      const recentIds = recent.map((r) => r.roomId);
      const optimisticIds = optimisticRoomId ? [optimisticRoomId] : [];

      // 캐시/낙관 최우선, 중복 제거
      let unionIds = [...new Set([...optimisticIds, ...recentIds, ...roomIds])];

      if (!unionIds.length) {
        setItems([]);
        return;
      }

      // 3) 각 방의 마지막 메시지 & 보기 좋은 제목 만들기
      const previews = await Promise.all(
        unionIds.map(async (rid) => {
          try {
            const msgs = await getMessages(rid).catch(() => []);
            const list = Array.isArray(msgs) ? msgs : [];
            const last = list.length
              ? [...list].sort((a, b) => (b?.timestamp || 0) - (a?.timestamp || 0))[0]
              : null;

            return {
              roomId: rid,
              title: prettifyTitleFrom(rid, list),
              lastMsg: last?.content || "(메시지 없음)",
              lastTime: last?.timestamp || 0,
            };
          } catch {
            const cached = recent.find((r) => r.roomId === rid);
            return {
              roomId: rid,
              title: "채팅방",
              lastMsg: "(대화 시작)",
              lastTime: cached?.lastTime || 0,
            };
          }
        })
      );

      previews.sort((a, b) => b.lastTime - a.lastTime);
      setItems(previews);
    } catch (e) {
      console.error(e);
      setErr(e?.message || "채팅방을 불러오지 못했습니다.");

      // 에러여도 낙관/캐시 방은 보여주기
      const recent = JSON.parse(localStorage.getItem("RECENT_ROOMS") || "[]");
      const optimistic = optimisticRoomId
        ? [
            {
              roomId: optimisticRoomId,
              title: "새 채팅방",
              lastMsg: "(대화 시작)",
              lastTime: Date.now(),
            },
          ]
        : [];
      const fallback = [
        ...optimistic,
        ...recent.map((r) => ({
          roomId: r.roomId,
          title: r.title || "채팅방",
          lastMsg: "(대화 시작)",
          lastTime: r.lastTime || 0,
        })),
      ];

      setItems(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoKey, optimisticRoomId]);

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: "0 12px" }}>
      <h2 style={{ fontWeight: 700 }}>채팅방 목록</h2>

      {err ? (
        <div style={{ color: "tomato", marginBottom: 12 }}>
          {err}
          <button style={{ marginLeft: 8 }} onClick={load}>
            다시 시도
          </button>
          <button
            style={{ marginLeft: 8 }}
            onClick={() => (location.href = "/login")}
          >
            다시 로그인
          </button>
        </div>
      ) : items.length === 0 ? (
        <p>채팅방이 없습니다.</p>
      ) : null}

      {/* 리스트 */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map(({ roomId, title, lastMsg, lastTime }) => (
          <li
            key={roomId}
            onClick={() => nav(`/chat/${encodeURIComponent(roomId)}`)}
            style={{
              padding: "12px 8px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {title || "채팅방"}
            </div>
            <div style={{ fontSize: 14, color: "#555" }}>{lastMsg}</div>
            {lastTime ? (
              <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                {new Date(lastTime).toLocaleString()}
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {/* 개발 편의: 현재 UUID (배포 시 제거 가능) */}
      <div style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
        현재 사용자 UUID:{" "}
        <code>{localStorage.getItem("USER_UUID") || me?.uuid || "(없음)"}</code>
      </div>
    </div>
  );
}