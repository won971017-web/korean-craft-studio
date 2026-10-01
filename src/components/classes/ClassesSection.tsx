"use client";

import { useState } from "react";
import type { CraftClass } from "@/types";
import { classes } from "@/mocks/classes";
import { Modal } from "@/components/ui/Modal";
import { ClassGrid } from "./ClassGrid";
import { ClassApplyForm } from "./ClassApplyForm";

export function ClassesSection() {
  const [selection, setSelection] = useState<CraftClass | null>(null);
  const [returnTo, setReturnTo] = useState<HTMLButtonElement | null>(null);

  const handleApply = (item: CraftClass, trigger: HTMLButtonElement) => {
    setSelection(item);
    setReturnTo(trigger);
  };

  const handleClose = () => setSelection(null);

  return (
    <section aria-labelledby="classes-title" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 id="classes-title" className="font-serif text-2xl font-semibold sm:text-3xl">
          공방 클래스 소개
        </h2>
        <p className="max-w-2xl text-muted">
          흙, 천, 나무를 직접 만지며 천천히 하나의 작품을 완성하는 체험 수업입니다. 처음이어도 괜찮도록 강사가
          곁에서 과정을 함께합니다.
        </p>
      </div>

      <aside aria-labelledby="classes-guide-title" className="rounded-xl border border-line bg-sand p-5">
        <h3 id="classes-guide-title" className="flex flex-wrap items-center gap-2 font-semibold">
          가상 클래스 준비물·취소 안내
          <span className="whitespace-nowrap rounded-full border border-clay-strong px-2 py-0.5 text-xs font-medium text-clay-strong">
            실습용 가상 안내
          </span>
        </h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>준비물: 편한 복장으로 오세요. 앞치마는 공방에서 제공합니다.</li>
          <li>취소 규정(예): 수업 3일 전까지 취소하면 전액 환불됩니다.</li>
          <li>실제 운영 정책이 아니며 실습을 위해 꾸며낸 안내입니다.</li>
        </ul>
      </aside>

      <ClassGrid items={classes} onApply={handleApply} />

      <Modal
        open={selection !== null}
        title={selection ? `클래스 신청 · ${selection.name}` : "클래스 신청"}
        onClose={handleClose}
        returnFocusTo={returnTo}
      >
        {selection ? (
          <ClassApplyForm key={selection.id} initialClassId={selection.id} onClose={handleClose} />
        ) : null}
      </Modal>
    </section>
  );
}
