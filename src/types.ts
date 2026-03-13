/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PipelineStage {
  PREPROCESSING = 'PREPROCESSING',
  CHUNKING = 'CHUNKING',
  CHUNK_ANALYSIS = 'CHUNK_ANALYSIS',
  TOPIC_CLUSTERING = 'TOPIC_CLUSTERING',
  INSIGHT_EXTRACTION = 'INSIGHT_EXTRACTION',
  KNOWLEDGE_EXTRACTION = 'KNOWLEDGE_EXTRACTION',
  GLOBAL_SYNTHESIS = 'GLOBAL_SYNTHESIS',
  NOTION_FORMATTING = 'NOTION_FORMATTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Entity {
  name: string;
  type: 'person' | 'idea' | 'company' | 'technology' | 'strategy';
  description: string;
}

export interface Relationship {
  source: string;
  relation: string;
  target: string;
}

export interface KnowledgeGraph {
  entities: Entity[];
  relationships: Relationship[];
}

export interface ActionItem {
  task: string;
  assignee: string | 'Unassigned';
  priority: 'High' | 'Medium' | 'Low';
  context: string;
}

export interface TimelineEvent {
  timestamp: string;
  topic: string;
  summary: string;
}

export interface BulletPoint {
  text: string;
  speaker?: string;
}

export interface StructuredNote {
  executiveSummary: string;
  bulletSummary: BulletPoint[];
  keyInsights: string[];
  actionItems: ActionItem[];
  questionsRaised: string[];
  timeline: TimelineEvent[];
  highlightQuotes: { quote: string; speaker: string; context: string }[];
  topicClusters: { topic: string; subtopics: string[]; importance: number }[];
  decisions: { decision: string; rationale: string; stakeholders: string[] }[];
  knowledgeGraph: KnowledgeGraph;
  socialMediaSummaries: { platform: string; content: string }[];
  finalSynthesis: string;
  notionProperties: {
    title: string;
    contentType: string;
    topic: string;
    tags: string[];
    speakers: string[];
    knowledgeDensity: number;
  };
}

export interface ProcessingState {
  stage: PipelineStage;
  progress: number;
  currentChunk?: number;
  totalChunks?: number;
  error?: string;
}
