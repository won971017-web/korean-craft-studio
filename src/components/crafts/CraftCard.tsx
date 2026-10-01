import Image from "next/image";
import type { Craft } from "@/types";
import { formatPrice } from "@/lib/format";

interface CraftCardProps {
  craft: Craft;
  onInquire: (craft: Craft, triggerEl: HTMLButtonElement) => void;
}

export function CraftCard({ craft, onInquire }: CraftCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white">
      <Image
        src={craft.image}
        alt={craft.imageAlt}
        width={800}
        height={600}
        unoptimized
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sand px-3 py-0.5 text-xs font-medium text-muted">{craft.kind}</span>
        </div>
        <h3 className="font-serif text-lg font-semibold">{craft.name}</h3>
        <p className="text-sm text-muted">{craft.description}</p>
        <p className="mt-auto pt-2 text-base font-semibold">{formatPrice(craft.price)}</p>
        <button
          type="button"
          aria-label={`${craft.name} 주문 문의하기`}
          onClick={(e) => onInquire(craft, e.currentTarget)}
          className="min-h-11 rounded-lg border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          주문 문의하기
        </button>
      </div>
    </article>
  );
}
