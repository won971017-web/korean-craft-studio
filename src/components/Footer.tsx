export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-sand">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <p className="font-serif text-lg font-bold text-ink">온결 공방</p>
        <p className="mt-1 text-sm font-medium text-clay-strong">
          아래 모든 정보는 실습용 가상 정보이며 실제 장소와 연락처가 아닙니다.
        </p>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-ink">주소</dt>
            <dd className="text-muted">서울시 가상구 온결로 1 (가상 주소)</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">운영시간</dt>
            <dd className="text-muted">화~일 10:00–18:00, 월요일 휴무 (가상)</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">문의</dt>
            <dd className="text-muted">02-000-0000 (가상)</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-muted">
          © 온결 공방 개발 실습용 프로토타입. 작품, 가격, 일정은 모두 가상의 Mock 데이터입니다.
        </p>
      </div>
    </footer>
  );
}
