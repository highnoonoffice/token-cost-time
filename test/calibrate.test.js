import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { calibrate } from '../src/calibrate.js';
import { record } from '../src/record.js';

function makeTempProfilePath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'token-cost-time-test-'));
  return path.join(dir, 'profile.json');
}

test('calibrate returns expected shape for cold start', () => {
  const result = calibrate('summarize this report', 'claude-haiku-3');

  assert.equal(result.taskClass, 'summarization');
  assert.equal(result.model, 'claude-haiku-3');
  assert.equal(result.confidence, 0.2);
  assert.equal(result.dataPoints, 0);
  assert.ok(result.estimate.tokens.total > 0);
  assert.ok(result.estimate.costUsd > 0);
  assert.ok(result.estimate.durationMs > 0);
});

test('calibrate uses profile averages and boosts confidence from runs', () => {
  const profilePath = makeTempProfilePath();

  for (let i = 0; i < 10; i += 1) {
    record(
      {
        model: 'claude-haiku-3',
        taskClass: 'summarization',
        inputTokens: 1500,
        outputTokens: 320,
        durationMs: 3900,
        cost: 0.0008,
        retries: i < 2 ? 1 : 0
      },
      profilePath
    );
  }

  const result = calibrate('please summarize this', 'claude-haiku-3', profilePath);

  assert.equal(result.dataPoints, 10);
  assert.equal(result.estimate.tokens.input, 1500);
  assert.equal(result.estimate.tokens.output, 320);
  assert.equal(result.estimate.durationMs, 3900);
  assert.ok(result.confidence > 0.2);
  assert.ok(result.qualityConfidence < 0.72);
});

test('calibrate throws for unknown model', () => {
  assert.throws(() => calibrate('summarize this', 'unknown-model'));
});
