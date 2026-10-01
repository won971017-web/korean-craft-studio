import Image from "next/image";
import type { CraftClass } from "@/types";
import { formatDuration, formatPrice } from "@/lib/format";

interface ClassCardProps {
  item: CraftClass;
  onApply: (item: CraftClass, triggerEl: HTMLButtonElement) => void;
}

export function ClassCard({ item, onApply }: ClassCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <Image
        src={item.image}
        alt={item.imageAlt}
        width={800}
        height={600}
        unoptimized
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-serif text-xl font-semibold">{item.name}</h3>
        <p className="text-sm text-muted">{item.description}</p>
        <dl className="mt-auto grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="text-muted">가격</dt>
          <dd className="font-semibold">{formatPrice(item.price)}</dd>
          <dt className="text-muted">소요시간</dt>
          <dd>{formatDuration(item.durationMinutes)}</dd>
          <dt className="text-muted">인원</dt>
          <dd>최대 {item.capacity}명</dd>
        </dl>
        <button
          type="button"
          aria-label={`${item.name} 신청하기`}
          onClick={(e) => onApply(item, e.currentTarget)}
          className="mt-2 min-h-11 rounded-lg bg-ink px-4 py-2 text-base font-medium text-paper hover:bg-clay-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          신청하기
        </button>
      </div>
    </article>
  );
}
