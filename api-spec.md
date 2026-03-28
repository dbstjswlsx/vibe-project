# 오늘 뭐 먹지? — API 스펙

이 문서는 프론트엔드와 백엔드(Supabase) 사이에서 **어떤 데이터를 주고받는지** 정리한 것입니다.
Next.js App Router 기반이므로 **Server Actions**, **Route Handlers**, **Supabase Client** 호출을 함께 사용합니다.

---

## 인증 (Auth)

Supabase Auth를 그대로 사용합니다. 별도 API를 만들지 않고 `supabase.auth` 메서드를 호출합니다.

### 회원가입 / 로그인

```ts
// 매직링크 로그인 예시
const { error } = await supabase.auth.signInWithOtp({
  email: "user@company.com",
});
```

### 로그아웃

```ts
await supabase.auth.signOut();
```

### 현재 사용자 가져오기

```ts
const { data: { user } } = await supabase.auth.getUser();
// user.id → uuid
```

---

## 1. 팀

### 1-1. 팀 생성

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 함수 | `createTeam(name: string)` |

**요청 데이터**

```ts
{ name: "개발팀" }
```

**응답 데이터**

```ts
{
  id: "abc-123",
  name: "개발팀",
  invite_code: "X7Kp2m",
  created_at: "2026-03-27T09:00:00Z"
}
```

**내부 동작**
1. `teams` 테이블에 행 삽입 (invite_code는 서버에서 랜덤 생성)
2. `members` 테이블에 생성자를 첫 멤버로 추가
3. 생성된 팀 정보 반환

---

### 1-2. 초대 코드로 팀 참여

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 함수 | `joinTeam(inviteCode: string)` |

**요청 데이터**

```ts
{ inviteCode: "X7Kp2m" }
```

**응답 데이터**

```ts
{
  team: { id: "abc-123", name: "개발팀" },
  member: { id: "mem-456", display_name: "김철수" }
}
```

**에러 케이스**
- `INVALID_CODE` — 존재하지 않는 초대 코드
- `ALREADY_MEMBER` — 이미 가입된 팀

---

### 1-3. 내 팀 목록 조회

| 항목 | 내용 |
|------|------|
| 방식 | Supabase Client (Server Component에서 호출) |

```ts
const { data: teams } = await supabase
  .from("members")
  .select("team:teams(*)")
  .eq("user_id", user.id);
```

**응답 예시**

```ts
[
  { team: { id: "abc-123", name: "개발팀", invite_code: "X7Kp2m" } },
  { team: { id: "def-456", name: "디자인팀", invite_code: "M3nR8q" } }
]
```

---

## 2. 투표 세션

### 2-1. 오늘의 세션 가져오기 (없으면 자동 생성)

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 함수 | `getOrCreateTodaySession(teamId: string)` |

**요청 데이터**

```ts
{ teamId: "abc-123" }
```

**응답 데이터**

```ts
{
  id: "ses-789",
  team_id: "abc-123",
  date: "2026-03-27",
  status: "open",            // "open" | "closed"
  decided_menu_id: null,
  created_at: "2026-03-27T08:30:00Z"
}
```

---

### 2-2. 투표 마감 (세션 닫기)

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 함수 | `closeSession(sessionId: string)` |

**요청 데이터**

```ts
{ sessionId: "ses-789" }
```

**응답 데이터**

```ts
{
  session: {
    id: "ses-789",
    status: "closed",
    decided_menu_id: "menu-111"
  },
  decided_menu: {
    id: "menu-111",
    name: "김치찌개",
    vote_count: 5
  }
}
```

**내부 동작**
1. 해당 세션의 투표를 집계
2. 최다 득표 메뉴 선정 (동점이면 랜덤)
3. `sessions.status`를 `"closed"`로, `decided_menu_id`를 선정 메뉴로 업데이트
4. 결과 반환

---

## 3. 메뉴 제안

### 3-1. 메뉴 제안하기

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 함수 | `proposeMenu(sessionId: string, menuName: string)` |

**요청 데이터**

```ts
{ sessionId: "ses-789", menuName: "김치찌개" }
```

**응답 데이터**

```ts
{
  id: "menu-111",
  session_id: "ses-789",
  name: "김치찌개",
  proposed_by: "user-001",
  created_at: "2026-03-27T09:10:00Z"
}
```

**에러 케이스**
- `SESSION_CLOSED` — 이미 마감된 세션
- `DUPLICATE_MENU` — 같은 세션에 동일 메뉴가 이미 존재

---

### 3-2. 제안된 메뉴 목록 (투표 수 포함)

| 항목 | 내용 |
|------|------|
| 방식 | Supabase Client |

```ts
const { data: menus } = await supabase
  .from("menus")
  .select("*, votes(count), proposer:members!proposed_by(display_name)")
  .eq("session_id", sessionId)
  .order("created_at", { ascending: true });
```

**응답 예시**

```ts
[
  {
    id: "menu-111",
    name: "김치찌개",
    proposer: { display_name: "김철수" },
    votes: [{ count: 5 }]
  },
  {
    id: "menu-222",
    name: "돈까스",
    proposer: { display_name: "이영희" },
    votes: [{ count: 3 }]
  }
]
```

---

## 4. 투표

### 4-1. 투표하기 (또는 변경)

| 항목 | 내용 |
|------|------|
| 방식 | Server Action |
| 함수 | `castVote(sessionId: string, menuId: string)` |

**요청 데이터**

```ts
{ sessionId: "ses-789", menuId: "menu-111" }
```

**응답 데이터**

```ts
{
  id: "vote-001",
  session_id: "ses-789",
  menu_id: "menu-111",
  user_id: "user-001",
  created_at: "2026-03-27T09:15:00Z"
}
```

**내부 동작**
1. 같은 세션에서 이 유저의 기존 투표가 있으면 `menu_id`를 업데이트 (upsert)
2. 없으면 새 행 삽입
3. `(session_id, user_id)` unique 제약으로 1인 1표 보장

**에러 케이스**
- `SESSION_CLOSED` — 마감된 세션에는 투표 불가

---

### 4-2. 내 투표 확인

| 항목 | 내용 |
|------|------|
| 방식 | Supabase Client |

```ts
const { data: myVote } = await supabase
  .from("votes")
  .select("menu_id")
  .eq("session_id", sessionId)
  .eq("user_id", user.id)
  .maybeSingle();
```

**응답 예시**

```ts
{ menu_id: "menu-111" }   // 투표했으면
null                        // 아직 안 했으면
```

---

## 5. 실시간 구독 (Realtime)

투표 현황을 실시간으로 반영하기 위해 Supabase Realtime을 사용합니다.

### 투표 변경 구독

```ts
supabase
  .channel("votes")
  .on(
    "postgres_changes",
    {
      event: "*",               // INSERT, UPDATE, DELETE
      schema: "public",
      table: "votes",
      filter: `session_id=eq.${sessionId}`,
    },
    (payload) => {
      // 투표 수 다시 조회하여 화면 갱신
      refreshMenuList();
    }
  )
  .subscribe();
```

### 세션 상태 변경 구독

```ts
supabase
  .channel("session")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "sessions",
      filter: `id=eq.${sessionId}`,
    },
    (payload) => {
      if (payload.new.status === "closed") {
        // 마감 → 결과 화면으로 전환
        showResult(payload.new.decided_menu_id);
      }
    }
  )
  .subscribe();
```

---

## 6. 메뉴 이력

### 6-1. 최근 결정 이력 조회

| 항목 | 내용 |
|------|------|
| 방식 | Supabase Client (Server Component에서 호출) |

```ts
const { data: history } = await supabase
  .from("sessions")
  .select("date, decided_menu:menus!decided_menu_id(name)")
  .eq("team_id", teamId)
  .eq("status", "closed")
  .order("date", { ascending: false })
  .limit(30);
```

**응답 예시**

```ts
[
  { date: "2026-03-27", decided_menu: { name: "김치찌개" } },
  { date: "2026-03-26", decided_menu: { name: "비빔밥" } },
  { date: "2026-03-25", decided_menu: { name: "돈까스" } }
]
```

---

## 에러 응답 형식 (공통)

모든 Server Action에서 에러가 발생하면 동일한 형태로 반환합니다.

```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

**에러 예시**

```ts
{
  success: false,
  error: {
    code: "SESSION_CLOSED",
    message: "이미 마감된 투표입니다."
  }
}
```

---

## 주요 에러 코드 목록

| 코드 | 설명 |
|------|------|
| `UNAUTHORIZED` | 로그인이 필요함 |
| `FORBIDDEN` | 해당 팀의 멤버가 아님 |
| `INVALID_CODE` | 존재하지 않는 초대 코드 |
| `ALREADY_MEMBER` | 이미 가입된 팀 |
| `SESSION_CLOSED` | 마감된 세션에 제안/투표 불가 |
| `DUPLICATE_MENU` | 같은 이름의 메뉴가 이미 제안됨 |
| `NOT_FOUND` | 요청한 리소스가 없음 |
