# OWASP 중심 보안 감사 보고서

- **스킬**: `.cursor/skills/owasp-app-audit/SKILL.md` 기준
- **범위**: `frontend/` (Next.js App Router, Supabase)
- **작성일**: 2026-03-28

## 감사 결과

| 일련번호 | 심각도 | OWASP Top 10 (2021) | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|---|
| 1 | Medium | A03 Injection | `frontend/src/app/diary/page.tsx` | `listQuery.or(\`title.ilike.${quoted},content.ilike.${quoted}\`)` | PostgREST **필터 문자열**에 사용자 검색어가 들어감. 전통적 SQL 연결은 아니나 파서/엣지 케이스에서 **필터 주입** 잔여 위험이 이론적으로 남을 수 있음. **현재 완화**: `frontend/src/lib/search.ts`에서 길이 상한(200)·`%`·`_`·`\`·`,`·`()`·`"`·제어문자 제거, `postgrestQuotedIlikeValue`로 `"` 이중 이스케이프 및 따옴표 래핑. | **매개변수화된 검색** 우선: Postgres `RPC`(예: `plainto_tsvector` / `websearch_to_tsquery`)·**DB 뷰**·Route Handler에서만 쿼리 조립 후 클라이언트는 인자만 전달. 당분간 문자열 필터를 쓸 경우 입력 **allowlist**·길이 제한·단위 테스트로 PostgREST `or()` 파싱 회귀 검증. |
| 2 | Medium | A04 Insecure Design / A05 Misconfiguration | `frontend/src/lib/actions/entry.ts` | `INSERT_FAILED` / `UPDATE_FAILED` / `DELETE_FAILED`에서 `message: error.message` | Supabase/PostgREST/DB 오류 문자열에 **제약명·컬럼·힌트** 등 내부 단서가 섞일 수 있음(정보 노출). | UI·`ActionResult`에는 **코드별 고정 한국어 문구**만 넘기고, `error.message`·`error.code`·`error.details`는 **서버 전용 로그**(구조화 로깅, PII 마스킹)로만 남김. |
| 3 | Medium | A04 Insecure Design | `frontend/src/lib/auth-errors.ts` | 매핑 미스 시 `return message` | 알려지지 않은 Auth 오류는 **Supabase 원문(영문)**이 그대로 UI에 노출될 수 있음. | 매핑 실패 시 `"요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요."` 등 **일반 메시지**로 폴백. 디버깅이 필요하면 `message`는 **클라이언트에 보내지 않고** 서버/관측 도구에만 기록. |
| 4 | Medium | A07 Identification and Authentication Failures | `frontend/src/lib/supabase/server.ts`, `frontend/src/proxy.ts` | `createServerClient` + 쿠키 `getAll` / `setAll` | 세션 쿠키의 **Secure·SameSite·HttpOnly·경로**가 앱 코드에 명시되지 않고 **@supabase/ssr·런타임 기본값**에 의존. 배포 환경(HTTP 로컬 vs HTTPS 프로덕션)에 따라 동작이 달라질 수 있음. | 프로덕션에서 브라우저 **Application → Cookies** 및 응답 헤더의 `Set-Cookie`로 실제 플래그 확인. 필요 시 Supabase 대시보드 **Auth → URL configuration**과 함께, 미들웨어/서버에서 쿠키 옵션을 **문서화된 방식**으로 명시(프레임워크·Supabase 버전 호환 확인). |
| 5 | Medium | A09 Security Logging and Monitoring Failures | `frontend/src/app/diary/layout.tsx` | `signOut` 실패 시 `console.error(error)` | **클라이언트 콘솔**에 전체 오류 객체가 노출되어 스택·내부 필드가 개발자 도구에 남을 수 있음. | 사용자에게는 일반화 알림만. 기술적 기록이 필요하면 `error.message`만 선별하거나 **서버 액션/엔드포인트**로 전송 후 서버에서 로깅(PII·토큰 제외). |
| 6 | Medium | A02 Cryptographic Failures | (앱 코드 해당 없음) | 로그인·회원가입 → Supabase Auth | 이 저장소에는 **bcrypt·salt rounds·평문 비교** 구현이 없고, 비밀번호 저장·검증은 **Supabase Auth**에 위탁됨. 앱만 보고 해시 알고리즘·라운드를 검증할 수 없음. | 운영 정책상 [Supabase Auth / 비밀번호 보안](https://supabase.com/docs/guides/auth/password-security) 및 프로젝트 **비밀번호 정책** 설정을 근거 문서로 삼아 검토. 클라이언트는 **최소 길이·복잡도** 등 보조 검증만 유지·강화. |

### OWASP 매핑 참고

- **A02** Cryptographic Failures · **A03** Injection · **A04** Insecure Design · **A05** Security Misconfiguration · **A07** Identification and Authentication Failures · **A09** Security Logging and Monitoring Failures

## 표 외 요약 (양호 사항)

- `entries` CRUD는 `.from("entries").insert` / `.update` / `.delete().eq(...)` 등 **구조화된 Supabase 클라이언트 API**로 수행되며, `id` 등은 `.eq()`에 바인딩되어 **값과 쿼리 구조가 분리**됨.
- `frontend/supabase/migrations/`에서 RLS 활성화 및 `select_own` / `insert_own` / `update_own` / `delete_own` 정책으로 **`auth.uid() = user_id` 행 단위 접근 제어**가 적용됨.
- `mood` 컬럼에 `check (mood in ('happy','neutral','sad','angry','tired'))`로 **DB 레벨 allowlist**가 있어 임의 문자열 저장이 제한됨.
- `frontend/src/proxy.ts`가 `/diary` 등에 대해 미인증 시 `/login`으로 **경로 단위 보호**를 수행함.
- `getSupabasePublicEnv()`(`frontend/src/lib/supabase/env.ts`)가 URL 형식·존재 여부를 검사하고, 앱 코드에서 **Service Role 키를 사용하지 않음**(공개 키만 `NEXT_PUBLIC_*`로 사용하는 구조).
- `frontend/src/app/auth/callback/route.ts`의 `safeNextPath`가 `next`가 없거나 `/`로 시작하지 않거나 `//`로 시작하는 경우 **`/diary`로 고정**하여 일부 **오픈 리다이렉트** 위험을 완화함(외부 절대 URL·`\/` 우회 등은 별도 점검 권장).
