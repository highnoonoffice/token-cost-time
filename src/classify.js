const TASK_RULES = [
  {
    taskClass: 'summarization',
    keywords: ['summarize', 'tldr', 'summary', 'condense', 'brief']
  },
  {
    taskClass: 'creative',
    keywords: ['write a blog', 'draft', 'copy', 'story', 'script', 'narrate']
  },
  {
    taskClass: 'code_generation',
    keywords: ['write', 'build', 'create', 'implement', 'function', 'component']
  },
  {
    taskClass: 'code_audit',
    keywords: ['review', 'audit', 'find bugs', 'check', 'analyze code', 'refactor']
  },
  {
    taskClass: 'reasoning',
    keywords: ['analyze', 'tradeoffs', 'best approach', 'compare', 'evaluate', 'should i']
  },
  {
    taskClass: 'extraction',
    keywords: ['extract', 'pull', 'list all', 'find all', 'get all dates', 'names']
  }
];

function normalizeObjective(objective) {
  return String(objective || '').trim().toLowerCase();
}

export function classifyObjective(objective) {
  const normalized = normalizeObjective(objective);

  if (!normalized) {
    return 'conversation';
  }

  for (const { taskClass, keywords } of TASK_RULES) {
    const matched = keywords.some((keyword) => normalized.includes(keyword));
    if (matched) {
      return taskClass;
    }
  }

  return 'conversation';
}

export { TASK_RULES };
