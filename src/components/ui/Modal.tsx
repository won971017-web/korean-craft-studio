"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** 닫힌 뒤 포커스를 돌려줄 요소(보통 모달을 연 버튼). */
  returnFocusTo?: HTMLElement | null;
  children: ReactNode;
}

const FOCUSABLE = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href]';

export function Modal({ open, title, onClose, returnFocusTo, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const firstField = dialog.querySelector<HTMLElement>("input, select, textarea");
      (firstField ?? dialog.querySelector<HTMLElement>(FOCUSABLE))?.focus();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) return;
    returnFocusTo?.focus();
  }, [open, returnFocusTo]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(92vw,34rem)] max-h-[90dvh] overflow-y-auto rounded-2xl border border-line bg-paper p-0 text-ink shadow-xl backdrop:bg-ink/60"
    >
      {open ? (
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="font-serif text-xl font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="-mr-2 -mt-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl leading-none hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
