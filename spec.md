# 나만의 일기장 — 서비스 스펙

## 한 줄 요약

개인용 일기를 작성·관리할 수 있는 웹 애플리케이션.

---

## 기술 스택

| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| DB · 인증 | Supabase (Auth, Database, RLS) |

---

## 기능 상세 (Phase 1)

### 1. 회원가입 / 로그인 / 로그아웃

| 항목 | 내용 |
|------|------|
| 인증 방식 | 이메일 + 비밀번호 (Supabase Auth) |
| 회원가입 | 이메일·비밀번호 입력 → `supabase.auth.signUp()` → 가입 완료 후 로그인 페이지로 이동 |
| 로그인 | 이메일·비밀번호 입력 → `supabase.auth.signInWithPassword()` → 성공 시 `/diary` 로 리다이렉트 |
| 로그아웃 | `supabase.auth.signOut()` → `/login` 으로 이동 |
| 세션 유지 | Supabase 클라이언트가 제공하는 세션/쿠키 기반 자동 갱신 |
| 보호 라우트 | 미인증 사용자가 `/diary*` 경로 접근 시 `/login` 으로 리다이렉트 (미들웨어) |
| 관련 페이지 | `/login`, `/signup` |

### 2. 일기 작성

| 항목 | 내용 |
|------|------|
| 입력 필드 | 제목 (text), 본문 (textarea), 기분 (select) |
| 기분 선택지 | 😊 행복 · 😐 보통 · 😢 슬픔 · 😠 화남 · 😴 피곤 |
| 저장 | `entries` 테이블에 INSERT (user_id는 현재 로그인 사용자) |
| 저장 후 | `/diary` 목록으로 이동 |
| 관련 페이지 | `/diary/new` |

### 3. 일기 목록 조회

| 항목 | 내용 |
|------|------|
| 정렬 | 작성일(`created_at`) 내림차순 |
| 표시 항목 | 제목, 기분 아이콘, 작성일 |
| 필터 | 없음 (Phase 1) |
| 데이터 조회 | `entries` 테이블에서 현재 사용자의 일기만 SELECT (RLS 적용) |
| 관련 페이지 | `/diary` |

### 4. 일기 상세 조회

| 항목 | 내용 |
|------|------|
| 표시 항목 | 제목, 본문, 기분, 작성일, 수정일 |
| 접근 | 목록에서 항목 클릭 시 이동 |
| 권한 | 본인 일기만 조회 가능 (RLS) |
| 관련 페이지 | `/diary/[id]` |

### 5. 일기 수정

| 항목 | 내용 |
|------|------|
| 입력 필드 | 제목, 본문, 기분 (기존 값 프리필) |
| 저장 | `entries` 테이블 UPDATE, `updated_at` 자동 갱신 |
| 저장 후 | 해당 일기 상세 페이지(`/diary/[id]`)로 이동 |
| 권한 | 본인 일기만 수정 가능 (RLS) |
| 관련 페이지 | `/diary/[id]/edit` |

### 6. 일기 삭제

| 항목 | 내용 |
|------|------|
| 동작 | 삭제 확인 대화상자 → 확인 시 `entries` 테이블 DELETE |
| 삭제 후 | `/diary` 목록으로 이동 |
| 권한 | 본인 일기만 삭제 가능 (RLS) |
| 트리거 위치 | 상세 페이지(`/diary/[id]`) 내 삭제 버튼 |

---

## 페이지 구조 (`app/` 디렉터리)

```
app/
├── layout.tsx            # 루트 레이아웃 (폰트, 글로벌 스타일)
├── page.tsx              # 랜딩 페이지 (/)
├── login/
│   └── page.tsx          # 로그인
├── signup/
│   └── page.tsx          # 회원가입
├── diary/
│   ├── layout.tsx        # 인증 필요 레이아웃 (공통 헤더·네비게이션)
│   ├── page.tsx          # 일기 목록 (/diary)
│   ├── new/
│   │   └── page.tsx      # 일기 작성 (/diary/new)
│   └── [id]/
│       ├── page.tsx      # 일기 상세 (/diary/[id])
│       └── edit/
│           └── page.tsx  # 일기 수정 (/diary/[id]/edit)
```

---

## DB 스키마

### `entries` 테이블

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| `id` | `uuid` | PK, `gen_random_uuid()` | 일기 고유 ID |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | 작성자 |
| `title` | `text` | NOT NULL | 제목 |
| `content` | `text` | NOT NULL | 본문 |
| `mood` | `text` | NOT NULL, CHECK (`mood` IN ('happy','neutral','sad','angry','tired')) | 기분 |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | 작성일시 |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | 수정일시 |

#### 인덱스

- `entries_user_id_created_at_idx` — `(user_id, created_at DESC)` : 목록 조회 성능

#### RLS 정책

| 정책 이름 | 동작 | 조건 |
|-----------|------|------|
| `select_own` | SELECT | `auth.uid() = user_id` |
| `insert_own` | INSERT | `auth.uid() = user_id` |
| `update_own` | UPDATE | `auth.uid() = user_id` |
| `delete_own` | DELETE | `auth.uid() = user_id` |

---

## 보안 · 권한

- 모든 테이블에 RLS 활성화
- 클라이언트에서는 `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` 만 사용
- Service Role 키는 서버 측(필요 시)에서만 사용, 프론트에 노출하지 않음
- 미들웨어에서 인증 상태를 확인해 보호 라우트를 처리

---

## 향후 확장 (Phase 2+)

- 캘린더 뷰 (월별 작성 현황)
- 이미지 첨부 (Supabase Storage)
- 기분 통계 대시보드 (월별 감정 그래프)
- 태그 / 검색
- 내보내기 (PDF / Markdown)
- 소셜 로그인 (Google, GitHub 등)
