---
name: nextjs-supabase-performance-audit
description: >-
  Performs a read-only performance audit for Next.js App Router apps using
  Supabase. Covers rerenders (effects, memoization), data fetching (N+1,
  duplication, caching), bundle size (imports, dynamic), images/fonts (next/image,
  CLS), and API shape (select columns vs select *). Use when the user asks for a
  performance review, 성능 감사, Core Web Vitals-oriented code review, or Supabase
  query optimization without implementing fixes unless explicitly requested.
---

# Next.js + Supabase 성능 감사

## 역할

시니어 성능 엔지니어 관점에서 **읽기 전용**으로 코드와 설정을 점검한다. 사용자가 명시적으로 구현을 요청하지 않으면 **코드를 수정하지 않고** 표 형식 리포트만 낸다.

## 심각도

| 등급 | 기준 (예시) |
|------|-------------|
| **Critical** | 누적 데이터에서 선형·지수적으로 악화되는 패턴(심각한 N+1, 목록에서 대용량 페이로드 전부 로드), 프로덕션에서 명백한 장애 수준 |
| **High** | 체감 지연·대역폭·TTFB에 직접적인 영향(과다 컬럼 조회, 불필요 대량 전송, 중복 왕복 다발) |
| **Medium** | 규모가 커지면 문제가 되거나 측정 후 개선 여지(폰트/번들, 미들웨어 비용, 캐시 부재, 마이크로 최적화) |

## 감사 항목 (체크리스트)

1. **리렌더링**: `useEffect` 의존성 배열, `useMemo`/`useCallback`/`memo` 필요 여부(과도한 사용도 안티패턴임을 언급할 것). 클라이언트 경계(`"use client"`)가 넓은지.
2. **데이터 페칭**: N+1(루프 내 await), 동일 요청 중복, `fetch` 캐시/`unstable_cache`/`React.cache`/세그먼트 `revalidate` 적절성, Server Action 이후 `revalidatePath`/`revalidateTag` 범위.
3. **번들**: 큰 라이브러리 전역 import, 라우트별 `next/dynamic` 후보, barrel export로 인한 과포함 여부.
4. **이미지·폰트**: `next/image` 사용 여부, `next/font` 설정(무게·서브셋), `display`·CLS·LCP 관련 이슈.
5. **API 응답(PostgREST)**: `.select("*")` vs 필요 컬럼만, 목록 화면에서 본문 등 대용량 필드 포함 여부.

## 권장 탐색 방법

- `rg "useEffect|useMemo|useCallback|React\\.memo" frontend/src`
- `rg "from\\(|\\.select\\(" frontend/src` — `select("*")`·누락된 컬럼 목록
- `rg "next/image|next/font|dynamic\\(" frontend/src`
- `rg "unstable_cache|revalidatePath|revalidateTag|fetch\\("` frontend/src
- 미들웨어·프록시: `middleware.ts`, `proxy.ts`, `matcher`와 매 요청 `getUser`/세션 갱신 비용
- `next.config.*` 이미지 도메인·번들 분석 관련 옵션

## 출력 형식 (필수)

아래 **6열 표**로만 정리한다. 양호·해당 없음은 짧은 **표 외 요약**으로 덧붙일 수 있다.

```markdown
| 일련번호 | 심각도 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
```

- **파일**: 리포지토리 기준 경로(예: `frontend/src/app/...`).
- **위치**: 식별 가능한 짧은 설명(함수명, 쿼리 체인, 설정 키 등).

## 주의

- 측정값이 없으면 **추정**임을 문구로 구분한다.
- Supabase **개인 데이터**는 공격적 CDN 캐싱이 부적절할 수 있음을 캐시 권고 시 명시한다.
- Windows 경로 대신 리포지토리 상대 경로를 쓴다.
