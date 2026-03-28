---
name: 나만의 일기장 개발 계획
overview: spec.md와 api-spec.md를 바탕으로 0단계(초기 셋업) → 1단계(목업) → 2단계(Supabase 실제 구현) 순서로 진행한다.
todos:
  - id: step-0
    content: "0단계: 프로젝트 초기 셋업 (Next.js 생성, 폴더 구조, 타입, mockData, 루트 레이아웃)"
    status: completed
  - id: step-1a
    content: "1단계 섹션 A: 인증 페이지 UI (로그인, 회원가입 - mock)"
    status: completed
  - id: step-1b
    content: "1단계 섹션 B: 랜딩 페이지 + Diary 공통 레이아웃"
    status: completed
  - id: step-1c
    content: "1단계 섹션 C: 일기 목록 페이지 + EntryCard 컴포넌트"
    status: completed
  - id: step-1d
    content: "1단계 섹션 D: 일기 작성 페이지 + MoodSelector 컴포넌트"
    status: completed
  - id: step-1e
    content: "1단계 섹션 E: 일기 상세 페이지 (조회 + 삭제 UI)"
    status: completed
  - id: step-1f
    content: "1단계 섹션 F: 일기 수정 페이지"
    status: completed
  - id: step-1g
    content: "1단계 섹션 G: 전체 플로우 점검 + 빌드 확인"
    status: completed
  - id: step-2a
    content: "2단계 섹션 A: Supabase 프로젝트 연결 + 클라이언트 유틸"
    status: completed
  - id: step-2b
    content: "2단계 섹션 B: DB 테이블, 인덱스, RLS 정책 생성"
    status: completed
  - id: step-2c
    content: "2단계 섹션 C: 인증 구현 (Supabase Auth + 미들웨어)"
    status: completed
  - id: step-2d
    content: "2단계 섹션 D: Server Actions (CRUD) 작성"
    status: completed
  - id: step-2e
    content: "2단계 섹션 E: 페이지별 Supabase 연동 (mock 제거)"
    status: completed
  - id: step-2f
    content: "2단계 섹션 F: 최종 점검 (E2E, RLS, 빌드)"
    status: completed
isProject: false
---

# 나만의 일기장 — 개발 계획

> **규칙: 1단계(목업)가 완전히 끝나기 전에는 절대 2단계로 넘어가지 않는다.**
> 각 섹션 완료 후 반드시 멈추고, 사용자에게 다음 진행 여부를 확인받는다.

참조 문서:

- `spec.md` — 기능 명세, DB 스키마, 페이지 구조
- `api-spec.md` — Server Action 패턴, `ActionResult<T>` 타입, 에러 처리 방식 참조

---

## 0단계: 프로젝트 초기 셋업

### 0-1. Next.js 프로젝트 생성

- `frontend/` 폴더에 `create-next-app` 실행 (App Router, TypeScript, Tailwind CSS, ESLint, `src/` 사용)
- 불필요한 보일러플레이트 정리 (기본 페이지 내용, 기본 아이콘, 기본 CSS 초기화)

### 0-2. 폴더 구조 생성

- `frontend/src/app/` — App Router 페이지
- `frontend/src/components/` — 공통 UI 컴포넌트
- `frontend/src/lib/` — 유틸, 추후 Supabase 클라이언트
- `frontend/src/types/` — 공통 타입 정의
- `frontend/src/mock/` — 목업 데이터

### 0-3. 공통 타입 정의 (`src/types/index.ts`)

- `Mood` 타입 정의: `'happy' | 'neutral' | 'sad' | 'angry' | 'tired'`
- `Entry` 타입 정의: `id`, `user_id`, `title`, `content`, `mood`, `created_at`, `updated_at`
- `User` 타입 정의: `id`, `email`
- `ActionResult<T>` 타입 정의: `{ success: true; data: T } | { success: false; error: { code: string; message: string } }`

### 0-4. 목업 데이터 파일 생성 (`src/mock/mockData.ts`)

- `MOODS` 상수 맵: mood 값 → 이모지 + 라벨 매핑 (happy → 😊 행복, neutral → 😐 보통, sad → 😢 슬픔, angry → 😠 화남, tired → 😴 피곤)
- `mockUser` 객체: 가짜 로그인 사용자 1명
- `mockEntries` 배열: 샘플 일기 3~5건 (다양한 기분, 날짜 분산)

### 0-5. 루트 레이아웃 (`src/app/layout.tsx`)

- HTML `lang="ko"` 설정
- 기본 폰트 설정 (Pretendard 또는 Noto Sans KR, 또는 Next.js 내장 폰트)
- 글로벌 Tailwind 스타일 적용

> **0단계 완료 → 멈추고 확인받기**

---

## 1단계: 목업 (Supabase 없이 클릭 가능한 전체 플로우)

> Supabase 연동 없이 `mockData.ts`의 하드코딩 데이터만 사용한다.
> 모든 화면을 클릭해서 전체 플로우를 확인할 수 있는 수준까지 구현한다.

### 섹션 1-A: 인증 페이지 (UI만)

- **로그인 페이지** (`src/app/login/page.tsx`)
  - 이메일 input 필드
  - 비밀번호 input 필드
  - "로그인" 버튼 → 클릭 시 `/diary`로 이동 (mock)
  - "회원가입하기" 링크 → `/signup`으로 이동
- **회원가입 페이지** (`src/app/signup/page.tsx`)
  - 이메일 input 필드
  - 비밀번호 input 필드
  - 비밀번호 확인 input 필드
  - "회원가입" 버튼 → 클릭 시 `/login`으로 이동 (mock)
  - "로그인하기" 링크 → `/login`으로 이동

> **섹션 1-A 완료 → 멈추고 확인받기**

### 섹션 1-B: 랜딩 페이지 + Diary 레이아웃

- **랜딩 페이지** (`src/app/page.tsx`)
  - 서비스 이름 ("나만의 일기장") + 한 줄 소개
  - "시작하기" 버튼 → `/login`으로 이동
- **Diary 공통 레이아웃** (`src/app/diary/layout.tsx`)
  - 헤더: 앱 이름 클릭 → `/diary`
  - 헤더: "새 일기" 버튼 → `/diary/new`
  - 헤더: "로그아웃" 버튼 → `/login`으로 이동 (mock)
  - `children` 렌더링 영역

> **섹션 1-B 완료 → 멈추고 확인받기**

### 섹션 1-C: 일기 목록 페이지

- **EntryCard 컴포넌트** (`src/components/EntryCard.tsx`)
  - props: `entry: Entry`
  - 제목 표시
  - 기분 이모지 표시 (`MOODS` 맵 사용)
  - 작성일 포맷팅 표시 (예: 2026. 3. 27.)
- **일기 목록 페이지** (`src/app/diary/page.tsx`)
  - `mockEntries`에서 데이터 가져오기
  - `created_at` 내림차순 정렬
  - EntryCard 목록 렌더링
  - 각 카드 클릭 → `/diary/[id]`로 이동
  - 일기가 0개일 때 빈 상태 메시지 표시

> **섹션 1-C 완료 → 멈추고 확인받기**

### 섹션 1-D: 일기 작성 페이지

- **MoodSelector 컴포넌트** (`src/components/MoodSelector.tsx`)
  - 5개 기분 옵션 이모지 + 라벨로 나열
  - 선택된 기분 하이라이트 스타일
  - props: `value`, `onChange`
- **일기 작성 페이지** (`src/app/diary/new/page.tsx`)
  - 제목 input 필드 (필수)
  - 본문 textarea 필드 (필수)
  - MoodSelector로 기분 선택
  - "저장" 버튼 → `console.log`로 입력값 출력 + `/diary`로 이동 (mock)
  - "취소" 버튼 → `/diary`로 이동
  - 빈 필드 제출 시 클라이언트 검증 에러 표시

> **섹션 1-D 완료 → 멈추고 확인받기**

### 섹션 1-E: 일기 상세 페이지

- **일기 상세 페이지** (`src/app/diary/[id]/page.tsx`)
  - URL 파라미터 `id`로 `mockEntries`에서 일기 찾기
  - 제목 표시
  - 본문 표시
  - 기분 이모지 + 라벨 표시
  - 작성일 표시
  - 수정일 표시 (작성일과 다를 경우)
  - "수정" 버튼 → `/diary/[id]/edit`로 이동
  - "삭제" 버튼 → `window.confirm()` 확인 대화상자 → 확인 시 `/diary`로 이동 (mock)
  - "목록으로" 링크 → `/diary`
  - 존재하지 않는 id → notFound() 처리

> **섹션 1-E 완료 → 멈추고 확인받기**

### 섹션 1-F: 일기 수정 페이지

- **일기 수정 페이지** (`src/app/diary/[id]/edit/page.tsx`)
  - URL 파라미터 `id`로 `mockEntries`에서 기존 데이터 조회
  - 제목 input에 기존 값 프리필
  - 본문 textarea에 기존 값 프리필
  - MoodSelector에 기존 기분 프리필
  - "저장" 버튼 → `console.log`로 수정값 출력 + `/diary/[id]`로 이동 (mock)
  - "취소" 버튼 → `/diary/[id]`로 복귀
  - 존재하지 않는 id → notFound() 처리

> **섹션 1-F 완료 → 멈추고 확인받기**

### 섹션 1-G: 전체 플로우 점검

- 랜딩(`/`) → 로그인(`/login`) → 목록(`/diary`) 이동 확인
- 회원가입(`/signup`) ↔ 로그인(`/login`) 전환 확인
- 목록 → 새 일기 작성(`/diary/new`) → 저장 → 목록 복귀 확인
- 목록 → 상세(`/diary/[id]`) → 수정(`/diary/[id]/edit`) → 저장 → 상세 복귀 확인
- 상세 → 삭제 → 확인 → 목록 복귀 확인
- 헤더 네비게이션 (앱 이름, 새 일기, 로그아웃) 동작 확인
- 반응형 레이아웃 확인 (모바일 / 데스크톱)
- 타입 에러 · 린트 경고 정리
- `npm run build` 통과 확인

> **1단계 전체 완료 확인 필수. 사용자가 승인하기 전까지 절대 2단계로 넘어가지 않는다.**

---

## 2단계: 실제 구현 (mockData → Supabase 교체)

> 1단계 플로우 검증이 완료된 후에만 시작한다.
> Supabase 작업은 **Supabase MCP**를 사용한다.
> Supabase 프로젝트 이름: **vibe-tutorial**

### 섹션 2-A: Supabase 프로젝트 연결 및 클라이언트 설정

- Supabase MCP로 `vibe-tutorial` 프로젝트 확인
- `.env.local` 파일 생성
  - `NEXT_PUBLIC_SUPABASE_URL` 설정
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- `.gitignore`에 `.env.local` 포함 확인
- `@supabase/supabase-js` 패키지 설치
- `@supabase/ssr` 패키지 설치
- 브라우저용 Supabase 클라이언트 작성 (`src/lib/supabase/client.ts`)
- 서버용 Supabase 클라이언트 작성 (`src/lib/supabase/server.ts`)

> **섹션 2-A 완료 → 멈추고 확인받기**

### 섹션 2-B: DB 테이블 및 보안 정책 (Supabase MCP)

- `entries` 테이블 생성
  - `id` — uuid, PK, default `gen_random_uuid()`
  - `user_id` — uuid, NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE
  - `title` — text, NOT NULL
  - `content` — text, NOT NULL
  - `mood` — text, NOT NULL, CHECK (`mood` IN ('happy','neutral','sad','angry','tired'))
  - `created_at` — timestamptz, NOT NULL, default `now()`
  - `updated_at` — timestamptz, NOT NULL, default `now()`
- 복합 인덱스 생성: `(user_id, created_at DESC)`
- `moddatetime` extension 활성화
- `updated_at` 자동 갱신 트리거 생성
- RLS 활성화
- `select_own` 정책: SELECT — `auth.uid() = user_id`
- `insert_own` 정책: INSERT — `auth.uid() = user_id`
- `update_own` 정책: UPDATE — `auth.uid() = user_id`
- `delete_own` 정책: DELETE — `auth.uid() = user_id`
- MCP에서 테이블 · 정책 생성 결과 확인

> **섹션 2-B 완료 → 멈추고 확인받기**

### 섹션 2-C: 인증 구현 (Mock → Supabase Auth)

- 회원가입 페이지 수정: mock → `supabase.auth.signUp()` 호출
  - 성공 → `/login`으로 이동 + 성공 메시지
  - 실패 → 에러 메시지 표시 (이메일 중복, 비밀번호 약함 등)
- 로그인 페이지 수정: mock → `supabase.auth.signInWithPassword()` 호출
  - 성공 → `/diary`로 리다이렉트
  - 실패 → 에러 메시지 표시
- 로그아웃 수정: mock → `supabase.auth.signOut()` 호출
- 인증 콜백 라우트 생성 (`src/app/auth/callback/route.ts`)
- 미들웨어 생성 (`src/middleware.ts`)
  - 미인증 → `/diary`* 접근 시 `/login`으로 리다이렉트
  - 인증됨 → `/login`, `/signup` 접근 시 `/diary`로 리다이렉트
- 인증 흐름 테스트 (가입 → 로그인 → 보호 라우트 접근 → 로그아웃)

> **섹션 2-C 완료 → 멈추고 확인받기**

### 섹션 2-D: Server Actions 작성 (api-spec.md `ActionResult<T>` 패턴)

- `src/lib/actions/entry.ts` 파일 생성
- `createEntry(formData: FormData)` 구현
  - 서버 Supabase 클라이언트로 `entries` INSERT
  - 성공 → `revalidatePath('/diary')` + redirect
  - 실패 → `{ success: false, error: { code, message } }` 반환
- `updateEntry(id: string, formData: FormData)` 구현
  - 서버 Supabase 클라이언트로 `entries` UPDATE (해당 id)
  - 성공 → `revalidatePath` + redirect `/diary/[id]`
  - 실패 → 에러 반환
- `deleteEntry(id: string)` 구현
  - 서버 Supabase 클라이언트로 `entries` DELETE (해당 id)
  - 성공 → `revalidatePath('/diary')` + redirect
  - 실패 → 에러 반환

> **섹션 2-D 완료 → 멈추고 확인받기**

### 섹션 2-E: 페이지별 Supabase 연동 (mockData 교체)

- **일기 목록** (`/diary`): mockEntries → 서버 컴포넌트에서 Supabase SELECT (`created_at DESC`)
- **일기 상세** (`/diary/[id]`): mock 조회 → Supabase에서 id로 단건 SELECT, 없으면 `notFound()`
- **일기 작성** (`/diary/new`): console.log → `createEntry` Server Action 연결
- **일기 수정** (`/diary/[id]/edit`):
  - 기존 데이터 프리필을 Supabase에서 조회
  - console.log → `updateEntry` Server Action 연결
- **일기 삭제**: mock confirm → `deleteEntry` Server Action 연결
- `mockData.ts` import 제거 (더 이상 미사용)

> **섹션 2-E 완료 → 멈추고 확인받기**

### 섹션 2-F: 최종 점검

- 회원가입 → 로그인 → 일기 작성 → 목록 확인 (E2E 흐름)
- 일기 수정 → 상세에서 변경 내용 확인
- 일기 삭제 → 목록에서 사라짐 확인
- 로그아웃 → 보호 라우트 접근 차단 확인
- RLS 확인: 다른 사용자의 일기가 보이지 않는지 검증
- 에러 처리 확인 (네트워크 에러, 존재하지 않는 ID 접근 등)
- 반응형 레이아웃 확인 (모바일 / 데스크톱)
- 타입 에러 · 린트 경고 정리
- `npm run build` 통과 확인

