"use client";

import { useState } from "react";
import type { Craft } from "@/types";
import { crafts } from "@/mocks/crafts";
import { Modal } from "@/components/ui/Modal";
import { CraftGrid } from "./CraftGrid";
import { OrderInquiryForm } from "./OrderInquiryForm";

const SHIPPING_NOTES = [
  "제작 기간: 주문 확인 후 7~14일",
  "배송 기간: 제작 완료 후 3~5일",
  "도자기·나전칠기는 파손 방지 포장으로 보내 드립니다.",
  "수공예 특성상 색과 무늬가 사진과 조금 다를 수 있습니다.",
];

export function CraftsSection() {
  const [selected, setSelected] = useState<Craft | null>(null);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);

  const handleInquire = (craft: Craft, triggerEl: HTMLButtonElement) => {
    setTrigger(triggerEl);
    setSelected(craft);
  };

  return (
    <section aria-labelledby="crafts-title" className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="max-w-2xl">
          <h2 id="crafts-title" className="font-serif text-2xl font-semibold sm:text-3xl">
            손으로 빚은 공예품
          </h2>
          <p className="mt-3 text-muted">
            온결 공방은 도자기, 나전칠기, 보자기, 목공예를 한 점씩 정성껏 만듭니다. 쓰임이 있는 아름다움을
            일상에 가만히 들여놓을 수 있도록, 단정한 선과 은은한 색을 지켜 갑니다.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-sand p-5">
          <h3 className="font-serif text-base font-semibold">
            가상 제작·배송 안내 <span className="ml-1 text-xs font-medium text-clay-strong">(실습용 가상 안내)</span>
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
            {SHIPPING_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            이 안내는 실습용으로 꾸민 내용이며 실제 제작·배송과 관련이 없습니다.
          </p>
        </div>
      </div>

      <CraftGrid items={crafts} onInquire={handleInquire} />

      <Modal
        open={selected !== null}
        title={selected ? `주문 문의 · ${selected.name}` : ""}
        onClose={() => setSelected(null)}
        returnFocusTo={trigger}
      >
        {selected ? (
          <OrderInquiryForm key={selected.id} initialCraftId={selected.id} onClose={() => setSelected(null)} />
        ) : null}
      </Modal>
    </section>
  );
}
