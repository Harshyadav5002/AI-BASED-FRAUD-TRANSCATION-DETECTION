/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const report = JSON.parse(fs.readFileSync('source/codeproof-report.json', 'utf8'));
const headSha = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: 'source',
  encoding: 'utf8',
}).trim();
if (report.headSha !== headSha) throw new Error('Report does not match the checked-out commit.');
fs.writeFileSync(
  'codeproof-envelope.json',
  JSON.stringify({
    schemaVersion: 1,
    runId: process.env.CODEPROOF_RUN_ID,
    repositoryId: Number(process.env.CODEPROOF_REPOSITORY_ID),
    workflowRunId: Number(process.env.CODEPROOF_ACTION_RUN_ID),
    headSha,
    report,
  }),
);
