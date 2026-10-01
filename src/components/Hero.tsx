import { PracticeNotice } from "@/components/PracticeNotice";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="bg-paper">
      <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-medium tracking-widest text-clay-strong">
          전통 공예 공방 (가상의 브랜드)
        </p>
        <h1
          id="hero-title"
          className="mt-4 font-serif text-3xl font-bold leading-snug text-ink sm:text-5xl"
        >
          천천히 빚고, 오래 곁에 두는 공예
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          온결 공방은 도자기, 나전칠기, 보자기, 목공예를 현대의 일상에 어울리는 모양으로
          다시 풀어내는 가상의 공방입니다. 재료의 결을 살린 작품을 전시하고, 직접 만들어
          보는 작은 클래스를 엽니다.
        </p>
        <PracticeNotice className="mt-8 max-w-2xl" />
      </div>
    </section>
  );
}
