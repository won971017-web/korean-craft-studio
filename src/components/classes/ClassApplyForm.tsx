"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { classes } from "@/mocks/classes";
import { submitClassApplication } from "@/lib/mock-api";
import { useMockSubmit } from "@/lib/use-mock-submit";
import { formatPrice } from "@/lib/format";
import {
  todayString,
  validateContact,
  validateFutureDate,
  validateIntRange,
  validateRequired,
} from "@/lib/validation";
import { FormField, inputClass } from "@/components/ui/FormField";
import { SubmitResult } from "@/components/ui/SubmitResult";
import { PracticeNotice } from "@/components/PracticeNotice";

interface ClassApplyFormProps {
  initialClassId: string;
  onClose: () => void;
}

type FieldName = "name" | "contact" | "classId" | "date" | "headcount" | "request";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string | null>>;

const FIELD_ORDER: readonly FieldName[] = ["name", "contact", "classId", "date", "headcount", "request"];
const REQUEST_MAX = 200;

function capacityOf(classId: string): number {
  return classes.find((c) => c.id === classId)?.capacity ?? 1;
}

function validateField(field: FieldName, values: Values): string | null {
  switch (field) {
    case "name":
      return validateRequired(values.name, "이름");
    case "contact":
      return validateContact(values.contact);
    case "classId":
      return classes.some((c) => c.id === values.classId) ? null : "클래스를 선택해 주세요.";
    case "date":
      return validateFutureDate(values.date);
    case "headcount":
      return validateIntRange(values.headcount, 1, capacityOf(values.classId), "인원");
    case "request":
      return values.request.length > REQUEST_MAX ? `요청사항은 ${REQUEST_MAX}자 이내로 입력해 주세요.` : null;
  }
}

export function ClassApplyForm({ initialClassId, onClose }: ClassApplyFormProps) {
  const [values, setValues] = useState<Values>({
    name: "",
    contact: "",
    classId: initialClassId,
    date: "",
    headcount: "1",
    request: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const touched = useRef<Set<FieldName>>(new Set());
  const refs = useRef<Partial<Record<FieldName, HTMLElement | null>>>({});
  const { state, run } = useMockSubmit(submitClassApplication);

  const capacity = capacityOf(values.classId);
  const loading = state.status === "loading";

  const setRef = (field: FieldName) => (el: HTMLElement | null) => {
    refs.current[field] = el;
  };

  const handleChange =
    (field: FieldName) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const next = { ...values, [field]: e.target.value };
      setValues(next);
      touched.current.add(field);
      const updated: Errors = { [field]: validateField(field, next) };
      // 클래스가 바뀌면 인원 상한도 달라지므로 입력한 적 있는 인원을 다시 검사한다.
      if (field === "classId" && touched.current.has("headcount")) {
        updated.headcount = validateField("headcount", next);
      }
      setErrors((prev) => ({ ...prev, ...updated }));
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const next: Errors = {};
    let firstInvalid: FieldName | null = null;
    for (const field of FIELD_ORDER) {
      touched.current.add(field);
      const message = validateField(field, values);
      next[field] = message;
      if (message && firstInvalid === null) firstInvalid = field;
    }
    setErrors(next);
    if (firstInvalid) {
      refs.current[firstInvalid]?.focus();
      return;
    }
    void run({
      name: values.name.trim(),
      contact: values.contact.trim(),
      classId: values.classId,
      date: values.date,
      headcount: Number(values.headcount),
      request: values.request.trim(),
    });
  };

  if (state.status === "success") {
    return (
      <div className="flex flex-col gap-4">
        <SubmitResult state={state} />
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-lg bg-ink px-4 py-2 text-base font-medium text-paper hover:bg-clay-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          닫기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="flex flex-col gap-4">
      <PracticeNotice />

      <FormField id="class-apply-name" label="이름" required error={errors.name}>
        {(a11y) => (
          <input
            {...a11y}
            ref={setRef("name")}
            type="text"
            autoComplete="off"
            value={values.name}
            onChange={handleChange("name")}
            className={inputClass}
          />
        )}
      </FormField>

      <FormField id="class-apply-contact" label="연락처" required error={errors.contact}>
        {(a11y) => (
          <input
            {...a11y}
            ref={setRef("contact")}
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="010-1234-5678"
            value={values.contact}
            onChange={handleChange("contact")}
            className={inputClass}
          />
        )}
      </FormField>

      <FormField id="class-apply-class" label="클래스" required error={errors.classId}>
        {(a11y) => (
          <select
            {...a11y}
            ref={setRef("classId")}
            autoComplete="off"
            value={values.classId}
            onChange={handleChange("classId")}
            className={inputClass}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({formatPrice(c.price)})
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField id="class-apply-date" label="희망 날짜" required error={errors.date}>
        {(a11y) => (
          <input
            {...a11y}
            ref={setRef("date")}
            type="date"
            autoComplete="off"
            min={todayString()}
            value={values.date}
            onChange={handleChange("date")}
            className={inputClass}
          />
        )}
      </FormField>

      <FormField
        id="class-apply-headcount"
        label="인원"
        required
        hint={`최대 ${capacity}명`}
        error={errors.headcount}
      >
        {(a11y) => (
          <input
            {...a11y}
            ref={setRef("headcount")}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={1}
            max={capacity}
            step={1}
            value={values.headcount}
            onChange={handleChange("headcount")}
            className={inputClass}
          />
        )}
      </FormField>

      <FormField
        id="class-apply-request"
        label="요청사항"
        hint={`선택 입력 · ${values.request.length}/${REQUEST_MAX}자`}
        error={errors.request}
      >
        {(a11y) => (
          <textarea
            {...a11y}
            ref={setRef("request")}
            autoComplete="off"
            rows={3}
            value={values.request}
            onChange={handleChange("request")}
            className={inputClass}
          />
        )}
      </FormField>

      <SubmitResult state={state} />

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="min-h-11 rounded-lg bg-ink px-4 py-2 text-base font-medium text-paper hover:bg-clay-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-muted"
      >
        {loading ? "접수 중…" : "신청하기"}
      </button>
    </form>
  );
}
