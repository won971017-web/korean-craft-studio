import type { ClassApplication, MockApiResult, OrderInquiry } from "@/types";

export const MOCK_DELAY_MS = 700;
export const MOCK_ERROR_CONTACT = "010-0000-0000";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function createReceiptNo(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${suffix}`;
}

async function respond(contact: string, prefix: string, successMessage: string): Promise<MockApiResult> {
  await wait(MOCK_DELAY_MS);
  if (contact.trim() === MOCK_ERROR_CONTACT) {
    return {
      success: false,
      message: "[실습용 오류] 접수 중 가짜 오류가 발생했습니다. 연락처를 바꿔 다시 시도해 보세요.",
    };
  }
  return { success: true, receiptNo: createReceiptNo(prefix), message: successMessage };
}

export function submitOrderInquiry(input: OrderInquiry): Promise<MockApiResult> {
  return respond(
    input.contact,
    "OG-ORD",
    "[실습용] 주문 문의가 접수된 것으로 처리되었습니다. 실제로 전송되거나 저장되지 않았습니다.",
  );
}

export function submitClassApplication(input: ClassApplication): Promise<MockApiResult> {
  return respond(
    input.contact,
    "OG-CLS",
    "[실습용] 클래스 신청이 접수된 것으로 처리되었습니다. 실제로 전송되거나 저장되지 않았습니다.",
  );
}
