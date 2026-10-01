"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

interface TabsProps {
  tabs: readonly TabItem[];
  defaultId?: string;
  ariaLabel: string;
}

export function Tabs({ tabs, defaultId, ariaLabel }: TabsProps) {
  const [activeId, setActiveId] = useState<string>(defaultId ?? tabs[0]?.id ?? "");
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const moveTo = (index: number) => {
    const target = tabs[index];
    if (!target) return;
    setActiveId(target.id);
    buttonRefs.current[target.id]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTo(index === last ? 0 : index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTo(index === 0 ? last : index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(last);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-line bg-paper">
        <div
          role="tablist"
          aria-label={ariaLabel}
          className="mx-auto flex max-w-5xl px-2 sm:px-6"
        >
          {tabs.map((tab, index) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                ref={(node) => {
                  buttonRefs.current[tab.id] = node;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`min-h-11 flex-1 border-b-4 px-3 py-3 text-base transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-clay-strong sm:flex-none sm:px-8 ${
                  selected
                    ? "border-clay-strong font-bold text-ink"
                    : "border-transparent font-medium text-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
          hidden={tab.id !== activeId}
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-clay-strong"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
