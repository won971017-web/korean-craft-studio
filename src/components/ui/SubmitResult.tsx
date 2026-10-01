import type { SubmitState } from "@/types";

export function SubmitResult({ state }: { state: SubmitState }) {
  if (state.status === "success") {
    return (
      <div role="status" className="rounded-lg border border-celadon bg-celadon-soft p-4 text-sm text-ink">
        <p className="font-semibold">접수 완료 (실습용)</p>
        <p className="mt-1">
          접수번호: <span className="font-mono">{state.receiptNo}</span>
        </p>
        <p className="mt-1">{state.message}</p>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div role="alert" className="rounded-lg border border-danger bg-danger-soft p-4 text-sm text-ink">
        <p className="font-semibold">접수 실패 (실습용)</p>
        <p className="mt-1">{state.message}</p>
      </div>
    );
  }
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {state.status === "loading" ? "접수 중입니다." : ""}
    </p>
  );
}
