export type CraftKind = "도자기" | "나전칠기" | "보자기" | "목공예";

export interface Craft {
  id: string;
  name: string;
  kind: CraftKind;
  description: string;
  price: number;
  image: string;
  imageAlt: string;
}

export interface CraftClass {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  capacity: number;
  image: string;
  imageAlt: string;
}

export interface OrderInquiry {
  name: string;
  contact: string;
  craftId: string;
  quantity: number;
  request: string;
}

export interface ClassApplication {
  name: string;
  contact: string;
  classId: string;
  date: string;
  headcount: number;
  request: string;
}

export type MockApiResult =
  | { success: true; receiptNo: string; message: string }
  | { success: false; message: string };

export type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; receiptNo: string; message: string }
  | { status: "error"; message: string };
