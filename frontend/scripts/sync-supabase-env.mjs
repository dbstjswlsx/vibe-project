/**
 * Writes frontend/.env.local with Supabase URL + anon key.
 *
 * 1) Preferred: SUPABASE_ACCESS_TOKEN + optional SUPABASE_PROJECT_REF
 * 2) Fallback: Supabase CLI logged in (`supabase login`) — same project ref
 */
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(__dirname, "..");
const envLocalPath = join(frontendRoot, ".env.local");

const projectRef =
  process.env.SUPABASE_PROJECT_REF?.trim() || "yeprychutnkkwymtljsu";

/** @param {string} token */
async function fetchKeysFromManagementApi(token) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Management API ${res.status}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

function pickAnon(keys) {
  if (!Array.isArray(keys)) return null;
  const byName = (n) =>
    keys.find((k) => (k.name || "").toLowerCase() === n.toLowerCase());
  return (
    byName("anon") ||
    keys.find(
      (k) =>
        typeof k.api_key === "string" &&
        k.api_key.startsWith("eyJ") &&
        (k.name || "").toLowerCase() !== "service_role"
    ) ||
    null
  );
}

function tryCliJson() {
  try {
    const out = execSync(
      `npx --yes supabase projects api-keys --project-ref ${projectRef} -o json`,
      {
        cwd: frontendRoot,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    return JSON.parse(out.trim());
  } catch (e) {
    const err = e && typeof e === "object" && "stderr" in e ? String(e.stderr) : "";
    if (err.trim()) console.error(err.trim());
    return null;
  }
}

let keys = null;
const pat = process.env.SUPABASE_ACCESS_TOKEN?.trim();

if (pat) {
  try {
    keys = await fetchKeysFromManagementApi(pat);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  }
} else {
  keys = tryCliJson();
}

if (!keys) {
  console.error(
    "anon 키를 가져올 수 없습니다. 다음 중 하나를 하세요.\n" +
      "• supabase login 실행 후 이 스크립트를 다시 실행\n" +
      "• 또는 https://supabase.com/dashboard/account/tokens 에서 PAT 발급 후:\n" +
      "  PowerShell: $env:SUPABASE_ACCESS_TOKEN='…'; npm run env:supabase"
  );
  process.exit(1);
}

const anon = pickAnon(keys);
if (!anon?.api_key) {
  console.error(
    "응답에서 anon 키를 찾지 못했습니다. 프로젝트 ref와 권한을 확인하세요."
  );
  process.exit(1);
}

const url = `https://${projectRef}.supabase.co`;
const header = `# Supabase — npm run env:supabase 로 동기화 (비밀은 커밋하지 마세요)
# 대시보드: Settings → API
`;

writeFileSync(
  envLocalPath,
  `${header}
NEXT_PUBLIC_SUPABASE_URL=${url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon.api_key}
`,
  "utf8"
);
console.log(`Wrote ${envLocalPath}`);
