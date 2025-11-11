// 로그인 후 저장해둔 식별자에서 **항상 동일 키**를 꺼내도록 규격화
export function getCurrentUserId() {
    // 백엔드가 방 멤버 기준으로 쓰는 값과 '정확히 같은 것'을 리턴해야 함
    // 예) UUID를 표준으로 쓰기로 했으면 아래 uuid만 사용
    const uuid = localStorage.getItem("userUuid") || sessionStorage.getItem("userUuid");
  
    // 만약 백이 userAccount(아이디)를 기준으로 방에 넣었다면 그걸로 통일:
    const account = localStorage.getItem("userAccount") || sessionStorage.getItem("userAccount");
  
    // ✅ 여기서 **프로젝트 표준**을 딱 하나 정하세요. (예: UUID)
    // UUID가 없으면 account를 임시 대체 (둘 중 하나만 쓰이게!)
    return uuid || account || "GUEST-UNKNOWN";
  }