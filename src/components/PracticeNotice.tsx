export const PRACTICE_NOTICE_TEXT =
  "이 사이트는 실습용 프로토타입입니다. 입력한 정보는 저장되거나 전송되지 않으므로 실제 개인정보를 입력하지 마세요.";

export function PracticeNotice({ className = "" }: { className?: string }) {
  return (
    <p
      role="note"
      className={`rounded-lg border border-line bg-sand px-4 py-3 text-sm text-ink ${className}`}
    >
      <strong className="mr-1 font-semibold">실습 안내</strong>
      {PRACTICE_NOTICE_TEXT}
    </p>
  );
}
