import type { Craft } from "@/types";
import { CraftCard } from "./CraftCard";

interface CraftGridProps {
  items: readonly Craft[];
  onInquire: (craft: Craft, triggerEl: HTMLButtonElement) => void;
}

export function CraftGrid({ items, onInquire }: CraftGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((craft) => (
        <li key={craft.id} className="min-w-0">
          <CraftCard craft={craft} onInquire={onInquire} />
        </li>
      ))}
    </ul>
  );
}
