# Next.js + TypeScript 아키텍처·유지보수 감사 리포트

- **스킬 실행**: `nextjs-ts-architecture-audit` (`.cursor/skills/nextjs-ts-architecture-audit/SKILL.md`)
- **범위**: 저장소 전체 (주력 `frontend/`, Next.js App Router + TypeScript)
- **갱신일**: 2026-03-28
- **방식**: 스킬 권장 탐색(`rg` 등)으로 **재검증** 후 정적 코드 검토. 코드 변경 없음.
- **참고**: 컴포넌트·함수 **50줄** 기준은 스킬에 정한 **휴리스틱**이며 절대 임계값이 아님.

## 스킬 점검 요약 (이번 실행)

| 스킬 체크 | 결과 (`frontend/src` 기준) |
|-----------|------------------------------|
| `\bany\b` | **일치 없음** |
| `formData.get` | `lib/actions/entry.ts`에서 `createEntry`·`updateEntry` 각 3회, `as string \| null` 단언 |
| `MOODS` 정의 | `lib/constants.ts`와 `mock/mockData.ts` **양쪽에 동일 구조** 존재 |
| `@/mock` / `mockData` import | 앱 코드에서 **미사용**(해당 파일 내부 export만 검색됨) |
| `npx eslint src` | **경고 0** (프로젝트 규칙 기준) |
| ` as ` (샘플) | `entry.ts` FormData, `[id]/page.tsx` `entry.mood as keyof typeof MOODS`, `MoodSelector` `Object.keys as Mood[]` 등 |

## 감사 결과

| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `frontend/src/lib/constants.ts`, `frontend/src/mock/mockData.ts` | `MOODS` 상수 | 동일한 `Record<Mood, …>` 정의가 **두 파일에 중복**됨. 한쪽만 수정 시 라벨·이모지 **드리프트** 위험. | 단일 소스(`constants` 등)에서만 정의하고 mock은 import하여 재사용. |
| 2 | High | `frontend/src/app/login/page.tsx`, `frontend/src/app/signup/page.tsx` | 페이지 전체 마크업·폼 필드 | 풀스크린 셸, 카드 스타일, 이메일/비밀번호 필드·버튼·에러 박스가 **거의 동일 패턴**으로 반복됨. | 공통 `AuthCard` / `AuthTextField` 등으로 분리하거나 공통 레이아웃 + 슬롯으로 합침. |
| 3 | High | `frontend/src/app/diary/new/page.tsx`, `frontend/src/app/diary/[id]/edit/EditEntryForm.tsx` | 폼 JSX·검증·제출 흐름 | 제목·본문·기분·에러 목록·버튼 행이 **대량 중복**(수정은 `default*`·`updateEntry`만 다름). | `EntryEditorForm` 단일 컴포넌트에 `mode: "create" \| "edit"` 및 초기값·submit 핸들만 주입. |
| 4 | Medium | `frontend/src/lib/actions/entry.ts` | `createEntry` / `updateEntry` / `deleteEntry` | Supabase null 검사, `getUser()`, 미인증 응답이 **세 함수에 반복**. `FormData`에서 title/content/mood 읽기·trim 검증도 create/update에 **동일**. | `requireSupabaseUser()` 같은 내부 헬퍼, `parseEntryFormData(formData)`로 공통화. |
| 5 | Medium | `frontend/src/lib/actions/entry.ts` | `CONFIG_ERROR` 메시지 | `createEntry`·`deleteEntry`는 `MISSING_SUPABASE_ENV_MESSAGE`를 쓰고, `updateEntry`만 **다른 문자열**을 인라인으로 사용. 동일 상황인데 문구·경로 안내가 불일치. | 설정 오류 문구를 한 상수로 통일. |
| 6 | Medium | `frontend/src/lib/actions/entry.ts` | `formData.get(...) as string \| null` | `FormData` 값을 단언만 하고 **런타임 타입·`Mood` 유효성**은 DB/체크 제약에 의존. | 헬퍼로 문자열 추출 + trim + `Mood` allowlist 검증 후 타입 좁히기. |
| 7 | Medium | `frontend/src/types/index.ts` | `ActionResult`의 `error.code` | `code`가 `string`이라 **허용 코드 집합**이 타입으로 고정되지 않음. | `type EntryActionErrorCode = "VALIDATION_ERROR" \| …` 등 유니온으로 좁히기. |
| 8 | Medium | `frontend/src/app/diary/page.tsx` | `DiaryListPage` 전체 (~130줄+) | 검색 파라미터 처리, Supabase 조회, **검색 무결과·목록 무결과·정상 목록** 세 갈래 UI가 한 컴포넌트에 집중. | 빈 상태·목록 뷰를 하위 컴포넌트로 분리해 **목록 페이지는 데이터 조합만** 담당. |
| 9 | Medium | `frontend/src/app/diary/[id]/page.tsx` 등 | `entry.mood as keyof typeof MOODS` | DB `mood`가 항상 유효하다는 **가정을 단언**으로 처리. 스키마와 어긋나면 런타임에서 잠재적 혼란. | `isMood` 가드 또는 Zod 등으로 파싱 후 `Mood`로 좁히기. |
| 10 | Medium | `frontend/src/app/diary/page.tsx`, `diary/[id]/page.tsx`, `diary/[id]/edit/page.tsx` | `createClient()` null 분기 + `SupabaseConfigMissing` | 동일한 **환경 미구성 UI 패턴**이 여러 서버 페이지에 복제. | `withSupabase` 래퍼 컴포넌트 또는 공통 `loadEntriesOrConfigMissing` 유틸로 정리. |
| 11 | Low | `frontend/src/mock/mockData.ts`, `frontend/src/types/index.ts` | `mockUser`, `mockEntries`, `User` | `mockData`는 저장소 내 **다른 파일에서 import되지 않는 것으로 보임**(정적 검색 기준). `User`는 mock 전용에 가깝다. | 스토리북·테스트용이면 경로·문서 명시, 아니면 제거 검토로 **노이즈 감소**. |
| 12 | Low | `frontend/src/proxy.ts` | 파일명·역할 | Next 관례상 `middleware.ts`로 기대하는 팀과 **이름이 다를 수 있음**(프로젝트가 의도적으로 `proxy`를 쓴 경우 예외). | README/AGENTS에 “세션 검증은 `proxy.ts`”를 명시하거나 팀 컨벤션에 맞게 정렬. |
| 13 | Low | `frontend/src/app/diary/[id]/edit/EditEntryForm.tsx` | `defaultTitle`, `defaultContent`, `defaultMood`, `id` | 깊은 props drilling은 아니나 필드가 늘면 시그니처가 비대해짐. | `initial: Pick<Entry, "id" \| "title" \| "content" \| "mood">` 등 **한 객체**로 묶기 검토. |

## 표 외 요약 (양호)

- `frontend/src` 기준 **`any` 사용 없음**(`rg \bany\b` 기준).
- **Props drilling**: 중첩 트리를 통한 장거리 전달 패턴은 보이지 않음(대부분 1단계).
- `npx eslint src`는 **경고 0으로 통과**(프로젝트 ESLint 규칙 기준).
- **네이밍**: 라우트 `page.tsx`, 컴포넌트 PascalCase, 액션·함수 camelCase 등 **대체로 일관**; 예외는 `proxy.ts` 관례 차이(항목 12).
