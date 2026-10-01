import type { CraftClass } from "@/types";
import { ClassCard } from "./ClassCard";

interface ClassGridProps {
  items: readonly CraftClass[];
  onApply: (item: CraftClass, triggerEl: HTMLButtonElement) => void;
}

export function ClassGrid({ items, onApply }: ClassGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <ClassCard item={item} onApply={onApply} />
        </li>
      ))}
    </ul>
  );
}
