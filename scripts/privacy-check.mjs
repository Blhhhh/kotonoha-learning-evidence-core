import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const ignored = new Set(['.git', 'node_modules', 'dist', 'private-review']);
const forbiddenPath = /(?:real[-_]?dot|snapshot|session[-_]?dump|\.env(?:\.|$)|\.log$|\.sqlite$|\.db$|\.(?:png|jpe?g|webp|pdf|mp4)$)/i;
const allowedTextFile = /(?:\.(?:ts|mjs|md|json|yml)|^\.gitignore$|^LICENSE$)/i;
const patterns = [
  ['OPENAI_STYLE_KEY', /\bsk-[A-Za-z0-9_-]{20,}/],
  ['SUPABASE_SECRET', /\bsb_secret_[A-Za-z0-9_-]{12,}/],
  ['PRIVATE_KEY', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['JWT_LIKE', /\beyJ[A-Za-z0-9_-]{40,}\.[A-Za-z0-9_-]{20,}/],
  ['OTHER_PROVIDER_KEY', /\b(?:AKIA[0-9A-Z]{16}|sk_live_[A-Za-z0-9]{16,}|pdl_live_[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xoxb-[A-Za-z0-9-]{20,})/],
  ['EMAIL_ADDRESS', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
];
const findings = [];
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) { await visit(path); continue; }
    if (!entry.isFile()) { findings.push(`${relative(root, path)}: UNEXPECTED_FILE_TYPE`); continue; }
    const name = relative(root, path);
    if (forbiddenPath.test(name)) findings.push(`${name}: FORBIDDEN_PATH`);
    if (!allowedTextFile.test(name)) findings.push(`${name}: UNEXPECTED_ASSET_TYPE`);
    if ((await stat(path)).size > 100_000) findings.push(`${name}: LARGE_FILE`);
    const contents = await readFile(path, 'utf8');
    for (const [type, pattern] of patterns) if (pattern.test(contents)) findings.push(`${name}: ${type}`);
  }
}
await visit(root);
if (findings.length) { for (const item of findings) console.error(item); process.exitCode = 1; }
else console.log('Private candidate scan: no forbidden paths, large assets, or matched credential patterns.');
