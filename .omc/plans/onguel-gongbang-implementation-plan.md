# 온결 공방 구현 계획

- Status: **PENDING APPROVAL** (구현 미시작, 코드 수정 없음)
- Source spec: `.omc/specs/deep-interview-onguel-gongbang.md` (ambiguity ~17%)
- Mode: direct (consensus 미실행)

## 0. 현재 스캐폴드 사실 (구현 전 반드시 반영)

| 사실 | 근거 | 영향 |
|---|---|---|
| `app/`이 루트에 있고 `src/`가 없음 | `app/layout.tsx`, `app/page.tsx` | 요구 경로 `src/lib/mock-api.ts` 때문에 `src/app/`으로 이동 필요 |
| `@/*` → `./*` | `tsconfig.json` paths | `src/` 이동 시 `@/*` → `./src/*`로 변경 |
| 레이아웃이 `next/font/google`(Geist) 사용 | `app/layout.tsx:2` | 빌드 시 Google Fonts 요청 발생 → "외부 요청 없음" 위반, 오프라인 빌드 실패 가능. **제거하고 시스템 폰트 스택 사용** |
| `lang="en"`, 메타데이터가 "Create Next App" | `app/layout.tsx:16,22` | `lang="ko"`, 사이트 메타데이터로 교체 |
| 다크모드 미디어쿼리 존재 | `app/globals.css:14` | 단일 밝은 테마로 고정(범위 축소) 또는 토큰으로 정리 |
| 테스트 러너 없음 | `package.json` | 아래 §9 참고 |
| `LayoutProps<"/">` 사용 | `app/layout.tsx:19` | Next 16 타입 헬퍼. 이동 후에도 `next build`가 생성하는 타입에 의존하므로 유지 |

## 1. 결정 사항 요약 (스펙의 Open Items 확정안)

| 항목 | 결정 |
|---|---|
| 디렉터리 | `src/app`, `src/components`, `src/data`, `src/lib`, `src/types` |
| 탭 상태 | `page.tsx`가 서버 컴포넌트, 탭 셸 `CraftApp`(클라이언트)이 `useState` |
| 모달 | 네이티브 `<dialog>` + `showModal()` (포커스 트랩·ESC·inert 배경을 브라우저가 처리) |
| 상품/클래스 수 | 상품 8개(도자기2, 나전칠기2, 보자기2, 목공예2), 클래스 4개 |
| 연락처 검증 | `/^010-\d{4}-\d{4}$/` |
| 폰트 | 시스템 폰트 스택(한글: `"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif`), 명조 계열 제목은 `"Nanum Myeongjo","Batang",serif` 폴백 |
| 테마 | 라이트 단일. 다크 미디어쿼리 제거 |
| 테스트 | `vitest`(devDependency) 1개 추가하여 `mock-api` 단위 테스트. **의존성 추가는 승인 항목** |

## 2. 컴포넌트 목록과 책임 (요구 1, 4)

| 컴포넌트 | 종류 | 책임 (이것만 한다) |
|---|---|---|
| `src/app/layout.tsx` | Server | `<html lang="ko">`, 메타데이터, 전역 CSS 로드. 폰트 요청 없음 |
| `src/app/page.tsx` | Server | `<CraftApp>` 렌더, 데이터 import 후 props 전달 |
| `CraftApp` | Client | 활성 탭 상태(`shop`/`classes`), 모달 대상 상태, `Tabs` + 두 패널 + 모달 1개 조립 (§2.1) |
| `SiteHeader` | Server | "온결 공방" 표기, 한 줄 소개. 내비게이션 링크 없음 |
| `PracticeNotice` | Server | 실습용 안내 배너(`variant="page"`) 및 폼 근처 문구(`variant="form"`) |
| `Tabs` | Client | `tablist`/`tab`/`tabpanel` 시맨틱, 키보드 조작, 모든 패널을 렌더하고 비활성은 `hidden`. 패널 내용은 `children`으로 받아 모름 |
| `ProductGrid` | Server-safe | 상품 배열을 카드로 배치, 공예 종류 필터 없음(범위 외) |
| `ProductCard` | Server-safe | 이미지·이름·종류·설명·가격 + "주문 문의하기" 버튼(`onInquire(product)`) |
| `ClassGrid` / `ClassCard` | Server-safe | 이름·설명·가격·소요시간·정원 + "클래스 신청" 버튼(`onApply(cls)`) |
| `CraftIllustration` | Server | `kind` 별 인라인 SVG(도자기/나전칠기/보자기/목공예)와 톤 팔레트. `aria-hidden` |
| `Modal` | Client | `<dialog>` 래퍼: open/close, ESC, 배경 클릭 닫기, 제목·닫기 버튼, 포커스 복귀 |
| `OrderInquiryForm` | Client | 필드 상태·검증·제출·상태 표시(idle/loading/success/error) |
| `ClassApplyForm` | Client | 위와 동일 + 인원 검증(1~capacity) |
| `SubmitResult` | Client | success(접수번호·메시지) / error 메시지 표시, `role`/live region |
| `FormField` | Server-safe | label+input+에러 메시지 연결(`htmlFor`, `aria-describedby`, `aria-invalid`) |
| `src/lib/mock-api.ts` | 모듈 | Promise 기반 mock 두 함수, 700ms 지연, 외부 I/O 없음 |
| `src/lib/format.ts` | 모듈 | `formatPrice`, `formatDuration` |
| `src/lib/validation.ts` | 모듈 | 연락처/필수/인원 검증 순수 함수 |

### 2.1 단일 페이지·탭 구조 (확정)

- 라우트는 `/` 하나뿐이다. `src/app/` 아래에 다른 `page.tsx`, `[slug]`, 서브 라우트를 만들지 않는다.
- 탭 2개는 `CraftApp` 내부의 UI 상태(`useState<"shop" | "classes">("shop")`)이며 URL·해시·쿼리스트링을 바꾸지 않는다. 기본 탭은 `shop`.
- 탭 레이블은 정확히 "공예품 전시·주문"(id `shop`), "공방 클래스"(id `classes`). 다른 내비게이션 링크(홈·소개 등)는 두지 않는다.
- 배치: `SiteHeader`(사이트명) 바로 아래, 페이지 상단 영역에 `Tabs`를 두고 모바일에서도 두 탭이 한 줄에 들어가게 한다(각 `flex-1`).
- **두 패널은 모두 DOM에 렌더하고**, 비활성 패널은 `hidden` 속성으로 숨긴다. 이렇게 해야 모든 탭의 `aria-controls`가 실제 요소를 가리키고, 탭 전환 시 스크롤·상태가 보존된다. 카드가 정적 목록이라 렌더 비용은 무시할 수 있다.
- 폼 모달은 `CraftApp`이 **`Modal` 인스턴스 1개**로 관리한다. 상태는 `modal: { type: "order"; product: Product } | { type: "class"; item: CraftClass } | null`. 모달이 열려 있는 동안 탭 전환은 불가능하다(`<dialog>` 모달이 배경을 inert 처리).
- 폼 컴포넌트에는 `key={product.id}` / `key={item.id}`를 주고 모달을 닫을 때 `modal`을 `null`로 만들어 언마운트한다. 다시 열면 항상 idle 상태·빈 입력으로 시작한다.
- 모달을 연 버튼을 `CraftApp`이 `ref`로 기억했다가 닫힐 때 포커스를 복귀시킨다.

폼 두 개의 중복은 `useMockSubmit` 훅(`src/lib/use-mock-submit.ts`)으로 idle/loading/success/error 상태 머신을 공유한다.

## 3. 데이터 구조 (요구 2)

```ts
// src/types/index.ts
export type CraftKind = "도자기" | "나전칠기" | "보자기" | "목공예";

export interface Product {
  id: string;            // "p-ceramic-01"
  name: string;
  kind: CraftKind;
  description: string;   // 60자 내외
  price: number;         // KRW 정수
}

export interface CraftClass {
  id: string;            // "c-ceramic-01"
  name: string;
  kind: CraftKind;       // 일러스트 선택용
  description: string;
  price: number;
  durationMinutes: number; // 표시는 format.ts에서 "2시간 30분"
  capacity: number;
}

export interface OrderInquiryInput { productId: string; name: string; contact: string; message: string; }
export interface ClassApplicationInput { classId: string; name: string; contact: string; headcount: number; }

export type MockResult =
  | { ok: true; receiptNo: string; message: string }
  | { ok: false; code: "MOCK_ERROR" | "VALIDATION"; message: string };

export type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; receiptNo: string; message: string }
  | { status: "error"; message: string };
```

- 이미지 필드는 두지 않는다. `kind`로 `CraftIllustration`을 결정한다(로컬 SVG).
- Mock 데이터: `src/data/products.ts`, `src/data/classes.ts`. 각 파일은 `export const products: readonly Product[]`.
- 상수: `MOCK_ERROR_CONTACT = "010-0000-0000"`, `MOCK_DELAY_MS = 700`은 `mock-api.ts`에서 export한다(테스트가 재사용).

### Mock API 계약

```ts
export function submitOrderInquiry(input: OrderInquiryInput): Promise<MockResult>;
export function submitClassApplication(input: ClassApplicationInput): Promise<MockResult>;
```

- 항상 resolve한다(reject 금지). 실패는 `{ ok:false }`로 반환하여 UI 분기를 단순화한다.
- `contact === "010-0000-0000"` → `{ ok:false, code:"MOCK_ERROR", message:"[실습] 접수 중 오류가 발생했습니다. 다시 시도해 주세요." }`
- 그 외 → `{ ok:true, receiptNo: "OG-" + 6자리 영숫자 대문자, message }`
- 접수번호 난수는 `Math.random` 사용(암호학적 용도 아님). 저장 없음, `fetch`/`XMLHttpRequest`/`localStorage` 사용 금지.
- 지연: `new Promise(r => setTimeout(r, MOCK_DELAY_MS))`.

## 4. 파일 구조 (요구 3)

```
src/
  app/
    layout.tsx            # lang=ko, 메타, 폰트 없음
    page.tsx
    globals.css           # 토큰(@theme), 기본 타이포, 다크 제거
    favicon.ico           # 이동
  components/
    CraftApp.tsx
    SiteHeader.tsx
    PracticeNotice.tsx
    Tabs.tsx
    Modal.tsx
    FormField.tsx
    SubmitResult.tsx
    products/ProductGrid.tsx, ProductCard.tsx
    classes/ClassGrid.tsx, ClassCard.tsx
    forms/OrderInquiryForm.tsx, ClassApplyForm.tsx
    illustrations/CraftIllustration.tsx
  data/products.ts, classes.ts
  lib/mock-api.ts, use-mock-submit.ts, validation.ts, format.ts
  types/index.ts
  lib/mock-api.test.ts    # vitest (승인 시)
```

이동 작업(Phase 0): `app/` → `src/app/`, `tsconfig.json`의 `paths`를 `"@/*": ["./src/*"]`로 변경. 기본 `public/*.svg` 미사용 파일은 삭제하지 않고 남긴다(범위 외).

## 5. 구현 순서 (요구 5)

| 단계 | 내용 | 완료 조건 |
|---|---|---|
| P0 계약·골격 (Lead 단독) | `src/` 이동, tsconfig paths, `types`, `globals.css` 토큰, `layout.tsx`(폰트 제거), `mock-api.ts` 시그니처+구현, `format`, `validation` | `npm run build` 통과(빈 페이지) |
| P1 병렬 레인 | A: 데이터+일러스트+카드/그리드 / B: `Tabs`+`Modal`+`FormField` / C: 폼 2개+`useMockSubmit`+`SubmitResult`+`PracticeNotice` | 각 레인이 자기 파일만 수정, 단독 `tsc --noEmit` 통과 |
| P2 통합 (Lead 단독) | `CraftApp`, `page.tsx`, `SiteHeader` 조립, 스타일 정리 | 수동 체크리스트 §6 전부 통과 |
| P3 검증 | vitest, lint, build, 반응형·접근성 점검 | §10 조건 충족 |
| P4 독립 검토 | `code-reviewer`/`verifier`가 별도 패스로 승인 (작성자 자가 승인 금지) | 검토 결과 기록 |

레인이 1명일 경우 P1은 A→B→C 순차 진행해도 동일 계약을 따른다.

## 6. 검증 방법 (요구 6)

수동 체크리스트(모두 통과해야 함):
1. 초기 화면에 "온결 공방", 탭 2개, 실습용 안내 배너가 보인다.
2. 탭 클릭·키보드로 전환되고 URL(경로·해시·쿼리)이 바뀌지 않는다. 기본 탭은 "공예품 전시·주문"이며 탭은 정확히 2개, 레이블이 스펙과 일치한다. `src/app/`에 `page.tsx`가 하나뿐이다.
2-1. 다른 탭으로 전환했다 돌아와도 스크롤 위치와 카드 표시가 유지되고, 모달을 닫았다 다시 열면 폼이 초기 상태다.
3. 도자기·나전칠기·보자기·목공예 상품이 각 1개 이상 보이고, 카드에 이미지(SVG)·이름·종류·설명·가격이 있다.
4. 클래스 카드에 이름·설명·가격·소요시간·정원이 있고 도자기·보자기 클래스가 포함된다.
5. 두 종류 버튼이 각각 모달을 열고, 모달 상단에 선택한 상품/클래스명이 표시된다.
6. 성공/실패/로딩/중복 제출 방지가 §9 절차대로 동작한다.
7. 320px, 375px, 768px, 1280px에서 가로 스크롤이 없다(`document.documentElement.scrollWidth <= innerWidth`).
8. 코드 정적 점검: `fetch(`, `XMLHttpRequest`, `localStorage`, `next/font/google`, `https://` 외부 URL이 소스에 없다(`Grep`으로 확인).
9. 플레이스홀더 점검: TODO/`test.skip`/`.only`/미구현 분기 없음.

## 7. Agent 파일 소유권과 공용 파일 통합 (요구 7)

원칙: **파일당 소유자 1명**. 공용 파일은 Lead만 수정한다. 레인은 공용 파일 변경이 필요하면 Lead에게 요청 내용을 남기고 직접 수정하지 않는다.

| 소유자 | 소유 파일 |
|---|---|
| **Lead (executor, 통합자)** | `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/types/index.ts`, `src/lib/mock-api.ts`, `src/lib/format.ts`, `src/lib/validation.ts`, `src/components/CraftApp.tsx`, `SiteHeader.tsx`, `package.json` |
| **Lane A (designer/executor)** | `src/data/*`, `src/components/illustrations/*`, `src/components/products/*`, `src/components/classes/*` |
| **Lane B (executor)** | `src/components/Tabs.tsx`, `Modal.tsx`, `FormField.tsx` |
| **Lane C (executor)** | `src/components/forms/*`, `SubmitResult.tsx`, `PracticeNotice.tsx`, `src/lib/use-mock-submit.ts` |
| **test-engineer** | `src/lib/mock-api.test.ts`, vitest 설정 |
| **reviewer/verifier** | 수정 권한 없음(읽기 전용) |

통합 규칙:
- P0에서 Lead가 `types`, `mock-api`, `format`, `validation`, 토큰을 **먼저 확정·커밋 가능한 상태**로 만든다. 레인은 이를 import만 한다.
- 스타일은 Tailwind 유틸리티 클래스 + `globals.css`의 `@theme` 토큰(`--color-ink`, `--color-paper`, `--color-clay`, `--color-celadon`, `--color-line`)만 사용. 새 토큰이 필요하면 Lead에게 요청.
- 컴포넌트 props 계약(고정):
  - `ProductCard`: `{ product: Product; onInquire: (p: Product) => void }`
  - `ClassCard`: `{ item: CraftClass; onApply: (c: CraftClass) => void }`
  - `Tabs`: `{ tabs: readonly { id: string; label: string; panel: ReactNode }[]; activeId: string; onChange: (id: string) => void }` (`tabs.length === 2`는 `CraftApp`이 보장, 모든 `panel`을 렌더하고 비활성은 `hidden`)
  - `Modal`: `{ open: boolean; title: string; onClose: () => void; children: ReactNode }`
  - `OrderInquiryForm`: `{ product: Product; onDone?: () => void }`, `ClassApplyForm`: `{ item: CraftClass; onDone?: () => void }`
- P2 통합 시 Lead가 `npm run lint && npx tsc --noEmit && npm run build`를 돌려 충돌을 확인한다. 충돌 발생 시 계약(props/types)을 기준으로 소유 레인이 수정한다.
- 작성과 검토는 분리한다: 구현 레인 ≠ 승인 레인.

## 8. 접근성 조건 (요구 8)

**Tab**
- 컨테이너 `role="tablist"`(`aria-label="공방 메뉴"`), 각 탭 `role="tab"`, `aria-selected`, `aria-controls`, `id`; 패널 `role="tabpanel"`, `aria-labelledby`, `tabIndex={0}`.
- 활성 탭만 `tabIndex=0`, 나머지 `-1`(roving tabindex). ←/→ 이동, Home/End 첫·끝 탭, 이동 시 즉시 활성화(자동 활성화).
- 탭은 정확히 2개. 두 패널이 모두 DOM에 있으며 비활성 패널은 `hidden`이라 스크린리더에서 제외된다.
- 라우트·URL 변경 없음: 탭 전환 후에도 `location.pathname === "/"`, 해시·쿼리 없음.

**Modal**
- 네이티브 `<dialog>` + `showModal()`; `aria-labelledby`로 제목 연결. 열 때 첫 입력 필드(또는 제목)에 포커스, 닫으면 **열었던 버튼으로 포커스 복귀**.
- ESC로 닫힘, 닫기 버튼 존재(`aria-label="닫기"`), 배경 클릭 닫기. 제출 중(loading)에도 닫을 수 있으며, 닫으면 폼이 언마운트되어 진행 중이던 결과는 무시한다(언마운트 후 `setState` 방지를 `useMockSubmit`에서 처리). 다시 열면 항상 idle·빈 입력.
- 열려 있는 동안 배경 스크롤 잠금(`body` overflow hidden 대신 dialog 기본 동작+`overscroll-contain`), 모바일에서 화면 높이 초과 시 dialog 내부 스크롤.

**Form**
- 모든 입력에 보이는 `<label>`, `htmlFor`/`id` 연결. 필수 표시는 텍스트("필수")로도 제공(색만으로 전달 금지).
- 오류: 필드 아래 텍스트 + `aria-invalid="true"` + `aria-describedby`. 제출 실패 시 첫 오류 필드로 포커스.
- 제출 상태 안내: loading은 버튼 텍스트 "접수 중…"과 `disabled`+`aria-busy`; 결과는 `role="status"`(성공) / `role="alert"`(오류) live region.
- `input` 속성: 연락처 `type="tel"` `inputMode="numeric"` `autoComplete="off"`, 이름 `autoComplete="off"`(실제 개인정보 자동완성 방지), placeholder는 `홍길동(예시)` 같은 명백한 가짜값 아님 → 닉네임 예시 `공방친구`, 연락처 `010-0000-0000`은 **실패 트리거이므로 placeholder로 쓰지 않고** `010-1234-5678`로 표기.
- 폼 근처 실습용 안내 문구: "실습용 화면입니다. 실제 이름과 전화번호를 입력하지 마세요. 입력값은 저장되거나 전송되지 않습니다."

**공통**
- 대비 4.5:1 이상(본문), 포커스 링 가시(`focus-visible:outline`), 터치 타깃 44px 이상, `prefers-reduced-motion`에서 전환 애니메이션 제거, 장식 SVG는 `aria-hidden="true"`.

## 9. Mock API 성공·실패 테스트 방법 (요구 9)

**자동(vitest, `src/lib/mock-api.test.ts`)** — `vi.useFakeTimers()` 사용
1. 유효 입력 → 700ms 전에는 pending, `advanceTimersByTimeAsync(700)` 후 `{ ok:true }`, `receiptNo`가 `/^OG-[A-Z0-9]{6}$/`.
2. `contact:"010-0000-0000"` → `{ ok:false, code:"MOCK_ERROR" }`(두 함수 모두).
3. 연속 호출 시 접수번호가 형식을 만족(중복 불가 보장은 하지 않음).
4. 함수가 reject하지 않음.
5. 네트워크 미사용: `globalThis.fetch`를 `vi.fn()`으로 교체하고 호출 0회 확인.

**수동(브라우저)**
| 시나리오 | 입력 | 기대 |
|---|---|---|
| 성공 | 닉네임 `공방친구`, 연락처 `010-1234-5678`, 내용 입력 | 약 0.7초 로딩 후 접수번호+완료 메시지, 폼 입력 비활성 또는 닫기 버튼 노출 |
| 실패 | 연락처 `010-0000-0000` | 약 0.7초 후 오류 메시지, **입력값 유지**, 다시 제출 가능 |
| 반복 | 실패 → 연락처 수정 → 재제출 | 성공으로 전환 |
| 클라이언트 검증 | 빈 값, `01012345678`, 인원 0/정원 초과 | 제출 호출 없이 필드 오류 |
| 중복 제출 | 로딩 중 버튼 연타 | 호출 1회만 |
| 네트워크 | DevTools Network 탭 | 제출 시 요청 0건 |

## 10. lint/build 최종 통과 조건 (요구 10)

모두 만족해야 완료:
1. `npm run lint` — exit code 0, **error 0, warning 0**. `eslint-disable` 추가 금지.
2. `npx tsc --noEmit` — 오류 0 (`strict` 유지, `any` 금지).
3. `npm run build` — exit code 0, 빌드 중 외부 네트워크 접근 없이 성공(Google Fonts 제거 확인).
4. `npx vitest run` — 전체 통과, skip/only 없음(승인 시).
5. `/` 라우트가 정적으로 프리렌더된다(빌드 출력의 Route 표에서 `○ (Static)`).
6. 소스에 `fetch(`, `XMLHttpRequest`, `localStorage`, `next/font/google`, 외부 `http(s)://` 리소스 참조가 없다(문서 링크 제외).
7. TODO/스텁/`test.skip`/`.only` 없음.
8. §6 수동 체크리스트와 §9 시나리오 통과 기록을 verifier가 남긴다.
9. 별도 reviewer 패스 승인.

## 11. 위험과 대응

| 위험 | 대응 |
|---|---|
| `src/` 이동 후 `@/*` 경로/`LayoutProps` 타입 깨짐 | P0에서 즉시 `npm run build`로 확인 |
| 네이티브 `<dialog>` 테스트 환경(jsdom) 한계 | 모달은 수동·브라우저 점검, 단위 테스트는 mock-api에 한정 |
| SVG 일러스트 품질 편차 | Lane A가 단순 기하 도형 + 절제된 2~3색 팔레트로 제한, 전통 문양 사용 금지 |
| 한글 폰트가 환경마다 다름 | 시스템 폰트 스택 + 폴백, 줄바꿈은 `word-break: keep-all` |
| 레인 간 props 불일치 | §7 props 계약 고정, P2에서 `tsc`로 검출 |
| 사용자가 실제 개인정보 입력 | 배너 + 폼 근처 문구 + `autoComplete="off"` |

## 12. 승인 필요 항목

1. `app/` → `src/app/` 이동 및 `tsconfig.json` paths 변경
2. `next/font/google` 제거(시스템 폰트 사용)
3. `vitest` devDependency 추가 (거부 시 §9 수동 시나리오 + 임시 검증 스크립트로 대체)
4. 다크모드 제거(라이트 단일)
