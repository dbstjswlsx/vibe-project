# Next.js + Supabase 성능 감사 리포트

- **스킬 실행**: `nextjs-supabase-performance-audit` (`.cursor/skills/nextjs-supabase-performance-audit/SKILL.md`)
- **범위**: `frontend/` (Next.js 16 App Router, Supabase)
- **갱신일**: 2026-03-28
- **방식**: 스킬의 권장 탐색(`rg`)으로 재검증 후 **정적 코드 검토**. 런타임 프로파일·Lighthouse·실측 TTFB는 **미실행**이므로 심각도·영향은 **추정**이다. 코드 변경 없음.

## 스킬 점검 요약 (이번 실행)

| 스킬 체크 | 결과 (frontend/src) |
|-----------|---------------------|
| `useEffect` / `useMemo` / `useCallback` / `React.memo` | **일치 없음** — 리렌더·의존성 이슈 후보 없음 |
| `.select("*")` / `entries` 쿼리 | `diary/page.tsx`, `diary/[id]/page.tsx`, `diary/[id]/edit/page.tsx`에 `select("*")`; `actions/entry.ts`에 무인자 `.select()` |
| `next/image`, `dynamic(`, `unstable_cache`, `React.cache` | **일치 없음** |
| `revalidatePath` / `revalidateTag` | `entry.ts`에서 변이 후 `revalidatePath`만 사용 (`revalidateTag` 없음) |
| `next/font` | `app/layout.tsx`의 `Noto_Sans_KR` |
| 미들웨어·프록시 | `proxy.ts` — matcher 경로에서 `getUser()` |

## 감사 결과

| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
| 1 | High | `frontend/src/app/diary/page.tsx` | `.from("entries").select("*")` (목록 쿼리) | 목록에서 `EntryCard`는 제목·날짜·기분만 쓰는데 **행마다 `content` 전체**를 PostgREST 응답에 포함함. 일기 수·본문 길이가 늘수록 **페이로드·직렬화·TTFB** 부담이 커짐. | 목록 전용으로 `id,title,mood,created_at` 등 **필요 컬럼만** `select`. 상세 페이지에서만 본문 조회. |
| 2 | Medium | `frontend/src/app/diary/[id]/page.tsx`, `frontend/src/app/diary/[id]/edit/page.tsx` | `.select("*")` + `.single()` | 상세/수정에는 본문이 필요하나 `*`는 **`user_id` 등 UI 미사용 컬럼**까지 포함. 규모 대비 이득은 작지만 응답을 명시적으로 좁힐 수 있음. | `id,title,content,mood,created_at,updated_at`처럼 **열거형 select**로 고정해 스키마 추가 시 의도치 않은 대형 필드 노출을 줄임. |
| 3 | Medium | `frontend/src/lib/actions/entry.ts` | `insert` / `update` 후 `.select()` (인자 없음) | 기본 동작은 삽입/갱신 행 전체 반환. **redirect 직전**이라 클라이언트로 쓰지 않아도 서버에서 전체 행을 받아 처리하는 비용이 생김. | 필요 시 `.select("id")` 등 **최소 컬럼**만 반환하거나, redirect만 할 경우 select 생략 가능 여부를 SDK 문서에 맞게 검토. |
| 4 | Medium | `frontend/src/proxy.ts` | `matcher` 경로마다 `createServerClient` + `auth.getUser()` | 보호된 라우트 진입 시마다 **세션 검증 비용**이 발생. 인증이 필요한 앱에서는 타당하나, 지연의 한 축이 됨. | 프로덕션에서 **p95 지연** 확인. Supabase·Next 권장 패턴 유지하되, matcher 범위가 불필요하게 넓지 않은지 주기적으로 점검. |
| 5 | Medium | `frontend/src/app/diary/page.tsx` 등 Server Component 데이터 로드 | Supabase 직접 호출, `fetch` 캐시/`unstable_cache`/`React.cache` 없음 | **개인 일기 데이터** 특성상 공격적 CDN 캐시는 부적절하지만, 동일 요청 내 중복 호출이 늘거나 읽기 패턴이 단순 반복이면 최적화 여지가 있음. | 요청 단위 중복이 있으면 `React.cache`로 래핑 검토. 시간 기반 캐시는 **RLS·민감도**와 함께 설계. |
| 6 | Medium | `frontend/src/app/layout.tsx` | `next/font/google` — `Noto_Sans_KR` weight `400,500,600,700` 네 가지 | 한글 웹폰트는 **다운로드 용량**이 LCP/FCP에 영향을 줄 수 있음. | 디자인에 꼭 필요한 weight만 유지하거나, variable font·서브셋 정책으로 **전송량 축소** 검토. |
| 7 | Medium | `frontend/src/app/layout.tsx` | `display: "swap"` | 폰트 로드 전후 **메트릭 차이**로 미세한 레이아웃 이동이 날 수 있음. | `next/font`와 시스템 폰트 스택에 **유사한 fallback**·`size-adjust`(가능 시) 등으로 CLS 완화 측정. |
| 8 | Medium | `frontend/src/app/diary/layout.tsx` | 최상위 `"use client"`로 헤더·로그아웃 | `/diary` 하위 전체가 클라이언트 레이아웃 자식으로 묶이며, **클라이언트 하이드레이션 경계**가 넓어짐. | 로그아웃 버튼만 별도 클라이언트 컴포넌트로 분리하고 레이아웃 본문은 서버 쪽에 두는 방식으로 **JS 실행 단위**를 줄일 여지가 있음(리팩터 비용 대비 이득은 측정 후 판단). |
| 9 | Medium | `frontend/src/app/diary/new/page.tsx`, `frontend/src/app/diary/[id]/edit/EditEntryForm.tsx` | 오류 목록 `errors.map((err) => <li key={err}>…` | 동일 문구가 두 번이면 **key 충돌**로 리conciliation 비효율·경고 가능. | `index`와 조합하거나 안정적인 고유 key 사용. |

## 표 외 요약

- **N+1**: 목록은 **단일 쿼리**로 N행 조회; 행마다 추가 쿼리 없음 — 양호.
- **변이 후 캐시**: `entry.ts`에서 `create` / `update` / `delete` 뒤 `revalidatePath` 호출 — 목록·상세 갱신 흐름에 **무효화 패턴 적용**됨(양호). `revalidateTag`는 미사용.
- **useEffect 의존성 / memo**: `frontend/src` 기준 해당 훅·`React.memo` **미사용** — 현재는 **해당 없음**(향후 클라이언트 로직 추가 시 재점검).
- **번들**: 의존성가 `next`, `react`, `@supabase/*`, `tailwind` 수준으로 **경량**; `next/dynamic` 미사용은 현재 체감 영향은 제한적. 무거운 에디터·차트 추가 시 **지연 로드** 검토.
- **next/image**: 사용자 업로드 이미지 없음, UI는 **이모지·텍스트 중심** — 이미지 최적화 이슈는 **해당 없음**(이미지 도입 시 `next/image`·도메인 설정).
- **로그인**: `login/page.tsx`에서 `useSearchParams`를 `Suspense`로 감쌈 — 해당 패턴은 **권장에 부합**.
