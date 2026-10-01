## Handoff: team-plan → team-exec

- **Decided**: 단일 페이지(`/`), 탭은 `Tabs`(Worker A)가 자체 상태로 관리, 탭 2개 모두 DOM 렌더(비활성 `hidden`). 각 Section(`CraftsSection`, `ClassesSection`)은 자체 모달·폼을 소유. Mock/외부요청 규칙: fetch·localStorage·Server Action·Route Handler 금지.
- **Rejected**: 라우트 분리, vitest 추가(미승인), next/font/google(외부 요청).
- **Risks**: 네이티브 `<dialog>` 포커스 복귀, 한글 폰트 폴백, 375px 가로 스크롤.
- **Files (Lead P0 완료)**: src/types/index.ts, src/lib/{mock-api,validation,format,use-mock-submit}.ts, src/components/ui/{Modal,FormField,SubmitResult}.tsx, src/components/PracticeNotice.tsx, src/app/{layout,page,globals.css}, tsconfig.json(paths)
- **Remaining**: Worker A(Header/Hero/Footer/Tabs), B(crafts), C(classes), Lead 통합(page.tsx)
