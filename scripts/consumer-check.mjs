import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const temporary = await mkdtemp(join(tmpdir(), 'kotonoha-oss-consumer-'));
const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe', env: { ...process.env, npm_config_cache: join(temporary, 'npm-cache') } });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
};
try {
  const packageRoot = new URL('..', import.meta.url).pathname;
  const output = run('npm', ['pack', '--silent', '--pack-destination', temporary], packageRoot).trim();
  await writeFile(join(temporary, 'package.json'), '{"type":"module","private":true}');
  await writeFile(join(temporary, 'consumer.mjs'), `// provenance: synthetic_for_oss_clean_reconstruction
import {findLearningOccurrences,buildPartialSentenceMap} from '@kotonoha/learning-evidence-core';
const text='白い紙を読みたい。';
const hit=findLearningOccurrences(text).find(x=>x.ruleId==='grammar.tai');
if(!hit||text.slice(hit.span.start,hit.span.end)!==hit.span.text||hit.provenance.ruleVersion!=='1')throw Error('missing exact evidence');
const map=buildPartialSentenceMap(text);
if(map.status!=='PARTIALLY_SUPPORTED'||!map.chunks.some(x=>x.kind==='UNKNOWN'))throw Error('missing unknown region');
console.log('External consumer passed');\n`);
  run('npm', ['install', '--offline', '--no-audit', '--no-fund', join(temporary, output)], temporary);
  process.stdout.write(run('node', ['consumer.mjs'], temporary));
} finally { await rm(temporary, { recursive: true, force: true }); }
