// src/pages/JBusinessVerify.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* =======================
   API URL 구성 (중복 /api 방지)
   - 로컬: VITE_API_BASE_URL 비워두고 /api 프록시 사용
   - 배포: VITE_API_BASE_URL=http://54.66.146.131:8080 (뒤에 /api 붙이지 않기)
======================= */
const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const CERTIFY_URL = RAW_BASE
  ? `${RAW_BASE.replace(/\/api\/?$/, "")}/api/business/certify`
  : `/api/business/certify`;

/* 공통 유틸 */
const onlyDigits = (s) => (s || "").replace(/\D/g, "");
const getLS = (k) => localStorage.getItem(k);
const pickToken = () =>
  getLS("ACCESS_TOKEN") || getLS("accessToken") || getLS("TOKEN") || null;
const pickUuid = () =>
  getLS("USER_UUID") || getLS("userUuid") || getLS("uuid") || null;

export default function JBusinessVerify() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    businessNumber: "", // 10자리 숫자
    companyName: "",
    ownerName: "",      // 대표자명 (pNm)
    startDt: "",        // YYYYMMDD 8자리
    phone: "",
    address: "",
    bizType: "",
    bankName: "",
    bankAccount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uuid = pickUuid();
    if (!uuid) {
      alert("로그인이 필요합니다.");
      nav("/login");
      return;
    }

    const bn = onlyDigits(form.businessNumber);
    if (bn.length !== 10) {
      alert("사업자등록번호는 숫자 10자리여야 합니다.");
      return;
    }

    const dt = onlyDigits(form.startDt).slice(0, 8);
    if (dt.length !== 8) {
      alert("개업일은 YYYYMMDD 8자리로 입력해주세요.");
      return;
    }

    const pNm = (form.ownerName || "").trim();
    if (!pNm) {
      alert("대표자명을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ 백엔드 스펙: 쿼리스트링만 사용, Body 전송하지 않음
      //    키: userId, businessNumber, startDt, pNm
      const qs = new URLSearchParams({
        userId: uuid,
        businessNumber: bn,
        startDt: dt,
        pNm,
      });

      const token = pickToken();
      const url = `${CERTIFY_URL}?${qs.toString()}`;
      console.log("📡 POST", url);

      const res = await fetch(url, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const text = await res.text().catch(() => "");
      if (!res.ok) {
        console.warn("❌ certify error:", res.status, text);
        alert(`사업자 인증 실패 (${res.status})\n${text || "요청 형식을 확인해주세요."}`);
        return;
      }

      alert("사업자 인증 신청이 접수되었습니다.");
      nav("/my", { replace: true });
    } catch (err) {
      console.error(err);
      alert("네트워크/서버 오류로 사업자 인증에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>사업자 인증</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>사업자등록번호 (10자리)</span>
          <input
            name="businessNumber"
            value={form.businessNumber}
            onChange={onChange}
            placeholder="예) 123-45-67890"
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>상호</span>
          <input
            name="companyName"
            value={form.companyName}
            onChange={onChange}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>대표자명</span>
          <input
            name="ownerName"
            value={form.ownerName}
            onChange={onChange}
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>개업일 (YYYYMMDD)</span>
          <input
            name="startDt"
            value={form.startDt}
            onChange={onChange}
            placeholder="예) 20010516"
            required
          />
        </label>

        {/* UI용 추가 필드 (서버 전송 안 함) */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>연락처</span>
          <input name="phone" value={form.phone} onChange={onChange} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>주소</span>
          <input name="address" value={form.address} onChange={onChange} />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          <span>업태/업종</span>
          <input name="bizType" value={form.bizType} onChange={onChange} />
        </label>

        <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>은행명</span>
            <input name="bankName" value={form.bankName} onChange={onChange} />
          </label>
          <label style={{ display: "grid", gap: 6 }}>
            <span>계좌번호</span>
            <input name="bankAccount" value={form.bankAccount} onChange={onChange} />
          </label>
        </div>

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
            {submitting ? "제출 중..." : "인증 신청"}
          </button>
          <button
            type="button"
            onClick={() => nav(-1)}
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
      </form>
    </div>
  );
}