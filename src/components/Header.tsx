export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-5xl flex-col gap-0.5 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
        <p className="font-serif text-xl font-bold tracking-wide text-ink">온결 공방</p>
        <p className="text-sm text-muted">손의 결을 담아, 오래 쓰는 우리 공예</p>
      </div>
    </header>
  );
}
