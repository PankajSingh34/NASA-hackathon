import { useEffect, useState, useMemo } from 'react';
import { publications as samplePubs } from '../data/publications';
import { summarizePublication } from './publicationSummarizer';
import { buildGraphFromSummaries } from './knowledgeGraphEngine';
import { PublicationSummary, KnowledgeNode, EntityRelation, Publication } from '../types';

export interface UseKnowledgeGraphOptions {
  publications?: Publication[];
  seed?: string;
  autoBuild?: boolean;
}

export interface KnowledgeGraphState {
  summaries: PublicationSummary[];
  nodes: KnowledgeNode[];
  relations: EntityRelation[];
  loading: boolean;
}

export function useKnowledgeGraph(opts: UseKnowledgeGraphOptions = {}): KnowledgeGraphState {
  const { publications = samplePubs, seed, autoBuild = true } = opts;
  const [summaries, setSummaries] = useState<PublicationSummary[]>([]);
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [relations, setRelations] = useState<EntityRelation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const stableSeed = useMemo(() => seed || 'kg-seed', [seed]);

  useEffect(() => {
    if (!autoBuild) return;
    setLoading(true);
    // Simulate async build (future: web worker or API call)
    const t = setTimeout(() => {
      const sums = publications.map((p, i) => summarizePublication(p, { seed: stableSeed + '-' + i }));
      const { nodes, relations } = buildGraphFromSummaries(sums);
      setSummaries(sums);
      setNodes(nodes);
      setRelations(relations);
      setLoading(false);
    }, 50);
    return () => clearTimeout(t);
  }, [publications, stableSeed, autoBuild]);

  return { summaries, nodes, relations, loading };
}
