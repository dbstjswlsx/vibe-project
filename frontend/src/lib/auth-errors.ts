/** Map common Supabase Auth English messages to Korean for the UI. */
export function formatAuthErrorMessage(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("already registered") ||
    lower.includes("user already exists") ||
    lower.includes("email address is already registered")
  ) {
    return "이미 가입된 이메일입니다.";
  }

  if (
    lower.includes("password") &&
    (lower.includes("weak") ||
      lower.includes("at least") ||
      lower.includes("least 6") ||
      lower.includes("least 8"))
  ) {
    return "비밀번호가 요구 조건을 만족하지 않습니다. 더 긴 비밀번호를 사용해 주세요.";
  }

  if (lower.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }

  if (lower.includes("invalid email")) {
    return "올바른 이메일 형식이 아닙니다.";
  }

  return message;
}
