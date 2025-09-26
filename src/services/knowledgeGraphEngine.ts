import { EntityRelation, GraphEdgeConfidence, KnowledgeNode, PublicationSummary } from '../types';

export interface GraphBuildResult {
  nodes: KnowledgeNode[];
  relations: EntityRelation[];
}

let nodeCounter = 0;
function makeNodeId(prefix: string) { return `${prefix}-${(++nodeCounter).toString(36)}`; }

// Basic layout spiral for now (can swap to force simulation later)
function positionFor(index: number) {
  const angle = index * 0.9;
  const radius = 25 + index * 1.2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: (index % 7) * 4 };
}

export function buildGraphFromSummaries(summaries: PublicationSummary[]): GraphBuildResult {
  const nodes: KnowledgeNode[] = [];
  const entityNodeMap = new Map<string, string>(); // entity -> node id
  const relations: EntityRelation[] = [];

  function ensureEntityNode(entity: string, type: KnowledgeNode['type'] = 'publication'): string {
    if (entityNodeMap.has(entity)) return entityNodeMap.get(entity)!;
    const id = makeNodeId('kn');
    const node: KnowledgeNode = {
      id,
      type: type,
      title: entity,
      position: positionFor(nodes.length),
      connections: []
    };
    nodes.push(node);
    entityNodeMap.set(entity, id);
    return id;
  }

  // Add publication nodes
  for (const summary of summaries) {
    const pubNodeId = ensureEntityNode('pub:' + summary.publicationId, 'publication');
    const relatedEntities = new Set<string>();
    summary.organisms.forEach(o => relatedEntities.add('org:' + o));
    summary.missionsReferenced.forEach(m => relatedEntities.add('mission:' + m));
    summary.methods.forEach(m => relatedEntities.add('method:' + m));
    summary.riskFactors.forEach(r => relatedEntities.add('risk:' + r));

    for (const ent of relatedEntities) {
      const entNodeId = ensureEntityNode(ent, classifyNodeType(ent));
      const conf: GraphEdgeConfidence = {
        weight: 0.3 + Math.random() * 0.6,
        evidenceCount: 1,
        tier: 'medium'
      };
      const relId = `rel-${pubNodeId}-${entNodeId}`;
      relations.push({
        id: relId,
        a: pubNodeId,
        b: entNodeId,
        relationType: 'mentions',
        confidence: conf,
        provenanceRef: summary.id
      });
      // register connection for nodes
      const aNode = nodes.find(n => n.id === pubNodeId)!;
      const bNode = nodes.find(n => n.id === entNodeId)!;
      if (!aNode.connections.includes(bNode.id)) aNode.connections.push(bNode.id);
      if (!bNode.connections.includes(aNode.id)) bNode.connections.push(aNode.id);
    }
  }

  return { nodes, relations };
}

function classifyNodeType(ent: string): KnowledgeNode['type'] {
  if (ent.startsWith('mission:')) return 'mission';
  if (ent.startsWith('org:')) return 'research';
  if (ent.startsWith('method:')) return 'research';
  if (ent.startsWith('risk:')) return 'research';
  return 'publication';
}
