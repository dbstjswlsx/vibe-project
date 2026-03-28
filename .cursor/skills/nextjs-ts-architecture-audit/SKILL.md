---
name: nextjs-ts-architecture-audit
description: >-
  Read-only architecture and maintainability audit for Next.js App Router
  codebases using TypeScript: duplication, component/function size and SRP,
  typing strictness (any, assertions, missing unions), naming consistency, and
  unnecessary dependencies (unused modules, import noise, props drilling). Use
  when the user asks for a code quality review, 아키텍처 점검, 리팩터링 전
  감사, or maintainability assessment without implementing changes unless
  explicitly requested.
---

# Next.js + TypeScript 아키텍처·유지보수 감사

## 역할

시니어 소프트웨어 아키텍트 관점에서 **읽기 전용**으로 저장소를 점검한다. 사용자가 구현을 명시적으로 요청하지 않으면 **코드를 수정하지 않고** 표 형식 리포트만 낸다.

## 우선순위

| 등급 | 기준 (예시) |
|------|-------------|
| **High** | 동일 데이터·UI가 여러 곳에 복제되어 **드리프트** 위험이 큼, 또는 한 단위가 여러 책임을 과도하게 가짐 |
| **Medium** | 중복·느슨한 타입·일관성 깨짐이 유지보수·버그 가능성을 높임 |
| **Low** | 개선 여지·관례 정렬·미미한 구조 이슈 |

## 점검 항목 (체크리스트)

1. **코드 중복**: 동일·유사 레이아웃/폼/가드/상수가 여러 파일에 반복되는지, mock과 프로덕션 상수 이중 정의 여부.
2. **크기·SRP**: 함수·컴포넌트가 **~50줄 이상**이거나 분기·JSX 블록이 많아 한 가지 이유로 바꾸기 어려운지(기준은 참고용, 맥락으로 판단).
3. **타입**: `any`, 과한 `as` 단언, `FormData`/JSON 파싱 후 검증 없음, 오류 코드·판별 유니온 미사용, 미사용 `interface`/`type`.
4. **네이밍**: 파일명(`page.tsx` 제외 라우트 규칙), 컴포넌트 PascalCase, 훅 `use*`, 상수 `UPPER_SNAKE` 등 프로젝트 내 **혼용** 여부.
5. **의존성·구조**: 미참조 모듈, dead mock, 불필요한 barrel re-export, **과도한 props drilling**(깊은 트리 전달).

## 권장 탐색 방법

- `rg "\\bany\\b" frontend/src` — `any` 사용
- `rg " as " frontend/src` — 단언 과다 여부 샘플링
- `rg "FormData\\.get" frontend/src` — 파싱·검증 패턴
- 유사 UI: `login`, `signup`, `Form`, 공통 className 문자열
- 상수·목 데이터: `MOODS`, `mock`, `constants`
- `rg "from \"@/mock" frontend` 또는 mock 디렉터리 import 여부

## 출력 형식 (필수)

```markdown
| 일련번호 | 우선순위 | 파일 | 위치 | 문제 | 권고사항 |
|---|---|---|---|---|---|
```

- **파일**: 리포지토리 기준 경로.
- **위치**: 컴포넌트명·함수명·패턴 등 짧게.

## 표 외 요약

양호한 점(타입에 `any` 없음, ESLint 통과 등)은 짧게 덧붙일 수 있다.

## 주의

- Windows 경로 대신 리포지토리 상대 경로를 쓴다.
- “50줄”은 자동 기준이 아니라 **휴리스틱**임을 명시한다.
