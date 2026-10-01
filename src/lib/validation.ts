export const CONTACT_PATTERN = /^010-\d{4}-\d{4}$/;

export function validateRequired(value: string, label: string): string | null {
  return value.trim() === "" ? `${label}: 필수 입력 항목입니다.` : null;
}

export function validateContact(value: string): string | null {
  if (value.trim() === "") return "연락처: 필수 입력 항목입니다.";
  if (!CONTACT_PATTERN.test(value.trim())) return "연락처는 010-1234-5678 형식으로 입력해 주세요.";
  return null;
}

export function validateIntRange(raw: string, min: number, max: number, label: string): string | null {
  if (raw.trim() === "") return `${label}: 필수 입력 항목입니다.`;
  const n = Number(raw);
  if (!Number.isInteger(n)) return `${label}: ${min}~${max} 사이의 정수를 입력해 주세요.`;
  if (n < min || n > max) return `${label}: ${min}~${max} 사이로 입력해 주세요.`;
  return null;
}

/** date: "YYYY-MM-DD". 오늘 이후(오늘 포함)만 허용. */
export function validateFutureDate(value: string): string | null {
  if (value === "") return "희망 날짜: 필수 선택 항목입니다.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "날짜 형식이 올바르지 않습니다.";
  if (value < todayString()) return "과거 날짜는 선택할 수 없습니다.";
  return null;
}

export function todayString(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
