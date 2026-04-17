import test from 'node:test';
import assert from 'node:assert/strict';

import { classifyObjective } from '../src/classify.js';

test('classifies summarization keywords', () => {
  assert.equal(classifyObjective('Please summarize this memo'), 'summarization');
});

test('classifies code generation keywords', () => {
  assert.equal(classifyObjective('Implement a function for parsing dates'), 'code_generation');
});

test('classifies code audit keywords', () => {
  assert.equal(classifyObjective('Review and find bugs in this module'), 'code_audit');
});

test('classifies reasoning keywords', () => {
  assert.equal(classifyObjective('What is the best approach and tradeoffs?'), 'reasoning');
});

test('classifies creative keywords', () => {
  assert.equal(classifyObjective('Draft a story script with a short hook'), 'creative');
});

test('classifies write-a-blog phrases as creative before code generation', () => {
  assert.equal(classifyObjective('Write a blog post about release notes'), 'creative');
});

test('classifies extraction keywords', () => {
  assert.equal(classifyObjective('Extract and list all names in this text'), 'extraction');
});

test('falls back to conversation', () => {
  assert.equal(classifyObjective('hello there'), 'conversation');
});
