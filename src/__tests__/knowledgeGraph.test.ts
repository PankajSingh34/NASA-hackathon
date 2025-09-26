import { describe, it, expect } from 'vitest';
import { buildGraphFromSummaries } from '../services/knowledgeGraphEngine';
import { summarizePublication } from '../services/publicationSummarizer';
import { publications } from '../data/publications';

describe('Knowledge Graph Engine', () => {
  it('builds nodes and relations from summaries', () => {
    const summaries = publications.map((p, i) => summarizePublication(p, { seed: 'test-' + i }));
    const { nodes, relations } = buildGraphFromSummaries(summaries);
    expect(nodes.length).toBeGreaterThan(0);
    expect(relations.length).toBeGreaterThan(0);
    // Ensure some publication nodes included
    expect(nodes.some(n => n.title.startsWith('pub:'))).toBe(true);
  });
});
