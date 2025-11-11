// src/pages/JItemListPage.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, getProductsByAddress } from "@/api/product";
console.count("RENDER JItemListPage");

export default function JItemListPage() {
  const [items, setItems] = useState([]);
  const [loading, setL] = useState(true);
  const [errMsg, setErr] = useState("");

  // 🔹 입력창과 실제 검색에 쓰는 주소를 분리 (타이핑 중엔 API 안 호출)
  const [inputAddress, setInputAddress] = useState("");
  const [address, setAddress] = useState(""); // 여기 값이 바뀔 때만 조회

  // 🔹 React 18 dev(StrictMode) 중복 호출 가드 + 요청 경쟁 방지
  const fetchedOnce = useRef(false);
  const reqIdRef = useRef(0);

  const mapToCard = useCallback((raw = []) => {
    return raw.map((it) => ({
      id: it.itemId ?? it.id,
      title: it.name ?? it.title ?? "제목 없음",
      description: it.description ?? "",
      price: it.price ?? 0,
      sellerNickname: it.sellerAccount ?? it.sellerNickname ?? it.sellerId ?? "판매자",
      // 상대경로는 카드/이미지 컴포넌트에서 처리하도록 null 유지(깜빡임 방지)
      thumbnailUrl: it.thumbnailUrl || null,
      status: it.status || "판매중",
      address: it.address || "",
    }));
  }, []);

  const load = useCallback(async (addr) => {
    const myReqId = ++reqIdRef.current; // 최신 요청만 반영
    setL(true);
    setErr("");

    try {
      const data = addr ? await getProductsByAddress(addr) : await getAllProducts();
      const raw = Array.isArray(data) ? data : data?.content || data?.list || data?.data || [];
      const list = mapToCard(raw);

      // 이전(늦게 도착한) 응답 무시
      if (myReqId !== reqIdRef.current) return;

      setItems(list);
    } catch (e) {
      if (myReqId !== reqIdRef.current) return;
      console.error("[API] error:", e);
      setErr("목록을 불러오지 못했습니다.");
      setItems([]);
    } finally {
      if (myReqId === reqIdRef.current) setL(false);
    }
  }, [mapToCard]);

  // 🔹 최초 1회만 전체 목록
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    load(""); // 전체
  }, [load]);

  // 🔹 주소가 “적용”될 때만 조회 (타이핑 중엔 호출 X)
  useEffect(() => {
    if (!fetchedOnce.current) return; // 첫 로드 후 동작
    load(address);
  }, [address, load]);

  const onSearch = () => setAddress(inputAddress.trim());
  const onKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-[18px] font-semibold mb-3">일반 물품</h1>

      {/* 주소 필터 */}
      <div className="flex gap-2 mb-3">
        <input
          placeholder="주소로 5km 내 검색 (예: 서울특별시 강남구 강남대로)"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          onKeyDown={onKeyDown}
          className="flex-1 border rounded-xl px-3 py-2"
        />
        <button onClick={onSearch} className="px-4 py-2 rounded-xl bg-black text-white">
          검색
        </button>
      </div>

      {loading && (
        <ul className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="p-4 rounded-2xl bg-gray-100 animate-pulse h-20" />
          ))}
        </ul>
      )}

      {!loading && errMsg && <div className="text-red-500 text-sm">{errMsg}</div>}

      {!loading && !errMsg && (
        <ul className="flex flex-col gap-3">
          {items.map((it) => (
            <ProductCard key={it.id} item={it} />
          ))}
          {items.length === 0 && (
            <div className="text-gray-500 text-sm">표시할 물품이 없습니다.</div>
          )}
        </ul>
      )}
    </div>
  );
}