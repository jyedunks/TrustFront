// src/pages/JSellForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_BASE_URL || "";
const REGISTER_URL = BASE
? `${BASE}/product/register`
: `/api/product/register`;

export default function JSellForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // 파일 선택 시 미리보기
  const onFiles = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    const urls = list.map((f) => URL.createObjectURL(f));
    setPreview(urls);
  };

  const getLS = (k) => localStorage.getItem(k);
  const pickToken = () =>
    getLS("ACCESS_TOKEN") || getLS("accessToken") || getLS("TOKEN") || null;
  const pickUuid = () =>
    getLS("USER_UUID") || getLS("userUuid") || getLS("uuid") || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("제목을 입력해 주세요.");
    if (!price || Number.isNaN(Number(price)))
      return alert("가격을 숫자로 입력해 주세요.");

    try {
      setSubmitting(true);

      // ✅ 로그인 식별자 확보
      const token = pickToken();
      const uuid = pickUuid();
      if (!uuid) {
        alert("로그인이 필요합니다. (회원 UUID 없음)");
        navigate("/login");
        return;
      }

      // ✅ 서버 스펙: item(JSON) + images(file…)
      const dto = {
        title: title.trim(),
        price: Number(price),
        description: description.trim(),
        sellerId: uuid,                 // 로그인한 사용자 UUID
        categoryIds: [1],               // TODO: 실제 선택값으로 교체
        address: "서울특별시 서초구 테스트로 100-1", // TODO: 실제 주소 입력으로 교체
        latitude: 37.4845,              // TODO: 실제 좌표로 교체
        longitude: 127.0235,            // TODO: 실제 좌표로 교체
      };

      const fd = new FormData();
      fd.append(
        "item",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
      );
      for (const f of files) fd.append("images", f);

      const res = await fetch(REGISTER_URL, {
        method: "POST",
        body: fd,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        alert(`등록 실패 (${res.status})\n${text}`);
        return;
      }

      alert("물품이 등록되었습니다!");
      navigate("/items"); // 필요 시 목록 경로 조정
    } catch (err) {
      console.error(err);
      alert("네트워크/서버 오류로 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>물품 등록</h2>

      {/* ✅ 폼 제출 구조: onSubmit + 버튼 type="submit" */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>제목</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예) 아이폰 14 프로 128GB"
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>가격(원)</span>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="예) 300000"
              inputMode="numeric"
              required
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>설명</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="상태, 구성품, 직거래/택배 등"
              rows={5}
              style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>이미지 (여러 장 가능)</span>
            <input type="file" accept="image/*" multiple onChange={onFiles} />
          </label>

          {/* 간단 미리보기 */}
          {preview.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 8,
              }}
            >
              {preview.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  style={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 8,
                    background: "#eee",
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "등록 중..." : "등록하기"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}