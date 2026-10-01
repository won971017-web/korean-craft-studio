"use client";

import { useId, useState, type FormEvent } from "react";
import { crafts } from "@/mocks/crafts";
import { submitOrderInquiry } from "@/lib/mock-api";
import { useMockSubmit } from "@/lib/use-mock-submit";
import { validateContact, validateIntRange, validateRequired } from "@/lib/validation";
import { FormField, inputClass } from "@/components/ui/FormField";
import { SubmitResult } from "@/components/ui/SubmitResult";
import { PracticeNotice } from "@/components/PracticeNotice";

interface OrderInquiryFormProps {
  initialCraftId: string;
  onClose: () => void;
}

const REQUEST_MAX = 200;

type FieldName = "name" | "contact" | "craftId" | "quantity" | "request";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: readonly FieldName[] = ["name", "contact", "craftId", "quantity", "request"];

function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = validateRequired(values.name, "이름");
  if (name) errors.name = name;
  const contact = validateContact(values.contact);
  if (contact) errors.contact = contact;
  if (!crafts.some((c) => c.id === values.craftId)) errors.craftId = "상품을 선택해 주세요.";
  const quantity = validateIntRange(values.quantity, 1, 10, "수량");
  if (quantity) errors.quantity = quantity;
  if (values.request.length > REQUEST_MAX) errors.request = `요청사항은 ${REQUEST_MAX}자 이내로 입력해 주세요.`;
  return errors;
}

export function OrderInquiryForm({ initialCraftId, onClose }: OrderInquiryFormProps) {
  const uid = useId();
  const [values, setValues] = useState<Values>({
    name: "",
    contact: "",
    craftId: initialCraftId,
    quantity: "1",
    request: "",
  });
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const { state, run } = useMockSubmit(submitOrderInquiry);

  const errors = validate(values);
  const shown = (field: FieldName) => (touched[field] ? errors[field] : undefined);
  const fieldId = (field: FieldName) => `${uid}-${field}`;
  const loading = state.status === "loading";
  const done = state.status === "success";

  const setValue = (field: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || done) return;
    setTouched({ name: true, contact: true, craftId: true, quantity: true, request: true });
    const firstInvalid = FIELD_ORDER.find((f) => errors[f]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    void run({
      name: values.name.trim(),
      contact: values.contact.trim(),
      craftId: values.craftId,
      quantity: Number(values.quantity),
      request: values.request.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="flex flex-col gap-4">
      <PracticeNotice />
      <fieldset disabled={loading || done} className="flex min-w-0 flex-col gap-4 border-0 p-0">
        <FormField id={fieldId("name")} label="이름" required error={shown("name")}>
          {(a11y) => (
            <input
              {...a11y}
              type="text"
              autoComplete="off"
              value={values.name}
              onChange={(e) => setValue("name", e.target.value)}
              className={inputClass}
            />
          )}
        </FormField>
        <FormField id={fieldId("contact")} label="연락처" required error={shown("contact")} hint="예: 010-1234-5678">
          {(a11y) => (
            <input
              {...a11y}
              type="tel"
              inputMode="numeric"
              autoComplete="off"
              placeholder="010-1234-5678"
              value={values.contact}
              onChange={(e) => setValue("contact", e.target.value)}
              className={inputClass}
            />
          )}
        </FormField>
        <FormField id={fieldId("craftId")} label="상품" required error={shown("craftId")}>
          {(a11y) => (
            <select
              {...a11y}
              autoComplete="off"
              value={values.craftId}
              onChange={(e) => setValue("craftId", e.target.value)}
              className={inputClass}
            >
              {crafts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField id={fieldId("quantity")} label="수량" required error={shown("quantity")} hint="1~10개까지 문의할 수 있습니다.">
          {(a11y) => (
            <input
              {...a11y}
              type="number"
              min={1}
              max={10}
              step={1}
              autoComplete="off"
              value={values.quantity}
              onChange={(e) => setValue("quantity", e.target.value)}
              className={inputClass}
            />
          )}
        </FormField>
        <FormField
          id={fieldId("request")}
          label="요청사항"
          error={shown("request")}
          hint={`선택 입력 · ${values.request.length}/${REQUEST_MAX}자`}
        >
          {(a11y) => (
            <textarea
              {...a11y}
              rows={3}
              autoComplete="off"
              value={values.request}
              onChange={(e) => setValue("request", e.target.value)}
              className={inputClass}
            />
          )}
        </FormField>
      </fieldset>

      <SubmitResult state={state} />

      {done ? (
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          닫기
        </button>
      ) : (
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="min-h-11 rounded-lg bg-ink px-5 py-2 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {loading ? "접수 중…" : "문의 접수하기"}
          </button>
        </div>
      )}
    </form>
  );
}
