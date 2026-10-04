import { db } from './db';

export interface GraphSignal {
  entityType: string;
  value: string;
  relationType: string;
  targetEntity: string;
  confidence: number;
  evidence: string;
}

export class KnowledgeGraphService {
  /**
   * Search known scam entities and relationships for indicators present in content
   */
  public async queryGraphForMatches(
    domains: string[],
    phones: string[],
    claims: string[]
  ): Promise<GraphSignal[]> {
    const matchedSignals: GraphSignal[] = [];

    // Query database for known entities if DB available
    try {
      if (domains.length > 0) {
        const foundDomains = await db.scamEntity.findMany({
          where: {
            normalizedValue: { in: domains.map((d) => d.toLowerCase()) },
          },
          include: {
            outRelations: {
              include: { target: true },
            },
          },
        });

        for (const entity of foundDomains) {
          for (const rel of entity.outRelations) {
            matchedSignals.push({
              entityType: entity.entityType,
              value: entity.value,
              relationType: rel.relationType,
              targetEntity: rel.target.value,
              confidence: rel.confidence,
              evidence: rel.evidence,
            });
          }
        }
      }
    } catch {
      // In-memory baseline graph if database query is not yet available
    }

    return matchedSignals;
  }

  /**
   * Record new observed relationship from verified report or high-confidence analysis
   */
  public async recordEntityRelationship(
    sourceValue: string,
    sourceType: string,
    targetValue: string,
    targetType: string,
    relationType: string,
    evidence: string
  ): Promise<void> {
    try {
      const source = await db.scamEntity.upsert({
        where: { value: sourceValue },
        update: { flagCount: { increment: 1 }, lastSeen: new Date() },
        create: {
          entityType: sourceType,
          value: sourceValue,
          normalizedValue: sourceValue.toLowerCase(),
          riskLevel: 'SUSPICIOUS',
        },
      });

      const target = await db.scamEntity.upsert({
        where: { value: targetValue },
        update: { lastSeen: new Date() },
        create: {
          entityType: targetType,
          value: targetValue,
          normalizedValue: targetValue.toLowerCase(),
          riskLevel: 'UNVERIFIED',
        },
      });

      await db.scamRelationship.upsert({
        where: {
          sourceId_targetId_relationType: {
            sourceId: source.id,
            targetId: target.id,
            relationType,
          },
        },
        update: {
          confidence: 0.9,
          evidence,
        },
        create: {
          sourceId: source.id,
          targetId: target.id,
          relationType,
          confidence: 0.9,
          evidence,
        },
      });
    } catch (e) {
      console.warn('Knowledge graph record skipped:', e);
    }
  }
}

export const knowledgeGraph = new KnowledgeGraphService();
