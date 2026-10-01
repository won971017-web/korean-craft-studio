# Deep Interview Spec: 온결 공방 (한국 전통 공예 홍보 웹사이트 프로토타입)

## Metadata
- Rounds: 3 (+ Round 0 topology)
- Final Ambiguity Score: ~17%
- Type: greenfield (create-next-app 스캐폴드만 존재)
- Threshold: 0.2
- Threshold Source: default
- Initial Context Summarized: no
- Status: PENDING APPROVAL (PASSED)

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.90 | 0.40 | 0.360 |
| Constraint Clarity | 0.88 | 0.30 | 0.264 |
| Success Criteria | 0.68 | 0.30 | 0.204 |
| **Ambiguity** | | | **~17%** |

## Topology
| Component | Status | Description | Coverage |
|-----------|--------|-------------|----------|
| 공예품 전시·주문 탭 | active | 상품 카드 + 주문 문의 폼 | AC 1, 2, 3 |
| 공방 클래스 탭 | active | 클래스 카드 + 신청 폼 | AC 1, 4 |
| Mock API | active | `src/lib/mock-api.ts` 비동기 mock | AC 5, 6 |
| 실습용 안내 | active | 실명·실제 전화번호 입력 금지 안내 | AC 7 |
| 디자인·반응형 | active | 절제된 현대적 한국 공예 톤 | AC 8, 9 |

## Goal
로그인·DB·결제·외부 API 없이 동작하는 "온결 공방" 프론트엔드 실습용 프로토타입. 단일 페이지에서 상단 2개 탭(공예품 전시·주문 / 공방 클래스)을 전환하고, 각 카드의 버튼으로 모달 폼을 열어 Mock API로 제출하며 성공/실패 결과를 확인한다.

## Constraints
- Next.js App Router + TypeScript + Tailwind CSS (스캐폴드: Next 16.3.7, React 19, Tailwind v4)
- 상단 탭은 정확히 2개. 단일 페이지 + 클라이언트 상태 전환 (별도 라우트 없음)
- 폼은 모달(다이얼로그). 선택한 상품/클래스명을 폼 상단에 표시
- 상품/클래스 데이터는 TypeScript Mock Data 파일로 관리
- 폼 필드는 최소 구성
  - 주문 문의: 이름(닉네임), 연락처, 문의 내용
  - 클래스 신청: 이름(닉네임), 연락처, 인원(1~정원)
- 이미지는 로컬 SVG/CSS 일러스트 (외부 이미지·CDN·폰트 요청 없음)
- 제출은 `src/lib/mock-api.ts`의 비동기 함수 호출. ~700ms 지연 후 응답, 외부 요청·저장 없음
- 연락처 `010-0000-0000` 입력 시 Mock 오류 반환. 그 외에는 가짜 접수번호(예: `OG-xxxxxx`)와 완료 메시지
- 디자인: 차분하고 고급스러운 톤, 과한 장식·전통 문양 남발 금지
- 반응형 (모바일/PC)

## Non-Goals
회원가입, 로그인, DB, 실제 결제, 외부 API, 데이터 영속화, 관리자 화면, 장바구니, 다국어

## Acceptance Criteria
- [ ] 1. 헤더에 "온결 공방" 표기와 정확히 2개 탭이 있고, 클릭 시 URL 변경 없이 콘텐츠가 전환된다
- [ ] 2. 상품 카드에 이미지, 이름, 공예 종류, 간단 설명, 가격이 표시된다 (도자기·나전칠기·보자기·목공예 각 1개 이상)
- [ ] 3. "주문 문의하기" 클릭 시 모달이 열리고 ESC/닫기 버튼으로 닫힌다
- [ ] 4. 클래스 카드에 이름, 설명, 가격, 소요시간, 정원이 표시되고 "클래스 신청" 클릭 시 신청 모달이 열린다 (도자기·보자기 포함)
- [ ] 5. 제출 시 약 700ms 로딩 상태(버튼 비활성화) 후 결과가 표시된다
- [ ] 6. 성공 시 접수번호와 완료 메시지, 연락처 `010-0000-0000` 입력 시 오류 메시지가 표시되며 반복 테스트할 수 있다
- [ ] 7. 페이지 상단과 각 폼 근처에 실습용 안내(실명·실제 전화번호 입력 금지)가 있다
- [ ] 8. 320px~1440px에서 가로 스크롤 없이 사용할 수 있다
- [ ] 9. `npm run build`와 `npm run lint`가 통과하고, 네트워크 요청(fetch/XHR)이 코드에 없다

## Assumptions Exposed & Resolved
| Assumption | Resolution |
|------------|------------|
| 탭 = 라우트 | 단일 페이지 클라이언트 전환으로 결정 |
| 폼은 인라인 | 모달로 결정 |
| 이미지 = 사진 | 로컬 SVG/CSS로 결정 |
| 폼 필드 다수 | 최소 필드로 결정 |

## Open Items (기본값 제안, 계획 단계에서 확정)
- `src/` 디렉터리로 이동할지: 현재 `app/`이 루트에 있음. `src/lib/mock-api.ts` 요구와 맞추려면 `src/app/`으로 옮기는 것을 권장 (tsconfig `@/*` 경로 확인 필요)
- 상품/클래스 개수: 상품 6~8개, 클래스 3~4개 제안
- 연락처 형식 검증 정규식: 010-XXXX-XXXX 허용 제안
- 폰트: 시스템 폰트 스택 또는 `next/font` 로컬 사용 제안 (외부 요청 금지에 유의)
- 접근성: 포커스 트랩, `aria-modal`, 탭 `role="tablist"` 제안
- 가격 표기: `₩` + 천 단위 콤마 제안

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Product | core | id, name, craftType, description, price, illustration | 주문 문의의 대상 |
| ClassSession | core | id, name, description, price, duration, capacity | 신청의 대상 |
| OrderInquiry | core | name, contact, message, productId | Product를 참조 |
| ClassApplication | core | name, contact, headcount, classId | ClassSession을 참조 |
| MockResponse | supporting | ok, receiptNo, message | 두 폼의 결과 |
