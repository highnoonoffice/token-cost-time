import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { compare } from '../src/compare.js';
import { record } from '../src/record.js';

function makeTempProfilePath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'token-cost-time-compare-test-'));
  return path.join(dir, 'profile.json');
}

test('compare keeps default ranking by cost and recommends best cost-quality ratio', () => {
  const profilePath = makeTempProfilePath();

  for (let i = 0; i < 20; i += 1) {
    record(
      {
        model: 'gpt-4o-mini',
        taskClass: 'summarization',
        inputTokens: 1200,
        outputTokens: 220,
        durationMs: 3000,
        retries: 1
      },
      profilePath
    );
  }

  const result = compare(
    'summarize this architecture review',
    ['gpt-4o-mini', 'claude-haiku-3'],
    profilePath
  );

  assert.equal(result.sortBy, 'cost');
  assert.equal(result.ranked[0].model, 'gpt-4o-mini');
  assert.equal(result.recommendation.model, 'claude-haiku-3');
});

test('compare supports quality sort', () => {
  const result = compare(
    'summarize this architecture review',
    ['gpt-4o-mini', 'claude-haiku-3'],
    null,
    'quality'
  );

  assert.equal(result.sortBy, 'quality');
  assert.equal(result.ranked[0].model, 'claude-haiku-3');
});

test('compare supports balanced sort by cost-quality ratio', () => {
  const result = compare(
    'summarize this architecture review',
    ['gpt-4o-mini', 'claude-haiku-3'],
    null,
    'balanced'
  );

  assert.equal(result.sortBy, 'balanced');
  assert.equal(result.ranked[0].model, result.recommendation.model);
});

test('compare rejects unsupported sortBy values', () => {
  assert.throws(() =>
    compare('summarize this architecture review', ['gpt-4o-mini', 'claude-haiku-3'], null, 'speed')
  );
});
