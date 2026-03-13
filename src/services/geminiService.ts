/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { PipelineStage, StructuredNote, ProcessingState, Entity, Relationship, ActionItem, TimelineEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

const MODEL_NAME = "gemini-3.1-pro-preview";

export class TranscriptProcessor {
  private transcript: string;
  private onProgress: (state: ProcessingState) => void;

  constructor(transcript: string, onProgress: (state: ProcessingState) => void) {
    this.transcript = transcript;
    this.onProgress = onProgress;
  }

  private updateProgress(stage: PipelineStage, progress: number, currentChunk?: number, totalChunks?: number) {
    this.onProgress({ stage, progress, currentChunk, totalChunks });
  }

  private chunkTranscript(text: string, chunkSize: number = 8000, overlap: number = 1000): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start += chunkSize - overlap;
    }
    return chunks;
  }

  async process(): Promise<StructuredNote> {
    try {
      this.updateProgress(PipelineStage.PREPROCESSING, 5);
      const cleanedTranscript = this.transcript.trim();

      this.updateProgress(PipelineStage.CHUNKING, 10);
      const chunks = this.chunkTranscript(cleanedTranscript);
      const totalChunks = chunks.length;

      // Stage 1: Chunk Analysis
      this.updateProgress(PipelineStage.CHUNK_ANALYSIS, 15, 0, totalChunks);
      
      // Parallelize chunk analysis for speed
      const chunkPromises = chunks.map((chunk, i) => 
        this.analyzeChunk(chunk, i, totalChunks).then(analysis => {
          this.updateProgress(PipelineStage.CHUNK_ANALYSIS, 15 + ((i + 1) / totalChunks) * 30, i + 1, totalChunks);
          return analysis;
        })
      );
      
      const chunkAnalyses = await Promise.all(chunkPromises);

      // Parallelize Topic Clustering and Knowledge Extraction
      this.updateProgress(PipelineStage.TOPIC_CLUSTERING, 50);
      
      const [topics, knowledgeGraph] = await Promise.all([
        this.extractGlobalTopics(chunkAnalyses),
        this.generateKnowledgeGraph(chunkAnalyses).then(kg => {
          this.updateProgress(PipelineStage.KNOWLEDGE_EXTRACTION, 80);
          return kg;
        })
      ]);

      // Stage 3: Insight Extraction (Depends on Topics)
      this.updateProgress(PipelineStage.INSIGHT_EXTRACTION, 65);
      const insights = await this.extractGlobalInsights(chunkAnalyses, topics);

      // Stage 5: Global Synthesis
      this.updateProgress(PipelineStage.GLOBAL_SYNTHESIS, 90);
      const synthesis = await this.generateFinalSynthesis(chunkAnalyses, topics, insights, knowledgeGraph);

      this.updateProgress(PipelineStage.COMPLETED, 100);
      return synthesis;
    } catch (error) {
      this.onProgress({ stage: PipelineStage.FAILED, progress: 0, error: String(error) });
      throw error;
    }
  }

  private async analyzeChunk(chunk: string, index: number, total: number) {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the following transcript chunk (${index + 1}/${total}) and extract:
      1. Key points (bullet points with speaker attribution)
      2. Action items (task, assignee, priority, context)
      3. Timeline events (timestamp, topic, summary)
      4. Entities (people, companies, technologies, ideas)
      5. Decisions made (decision, rationale, stakeholders). 
         IMPORTANT: If rationale or stakeholders are not explicitly stated, infer them logically from the surrounding conversation.
      6. Highlight quotes (quote, speaker, context)

      Chunk:
      ${chunk}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyPoints: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  speaker: { type: Type.STRING }
                }
              } 
            },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  assignee: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  context: { type: Type.STRING }
                }
              }
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  summary: { type: Type.STRING }
                }
              }
            },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["person", "idea", "company", "technology", "strategy"] },
                  description: { type: Type.STRING }
                }
              }
            },
            decisions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  decision: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  stakeholders: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            },
            quotes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  quote: { type: Type.STRING },
                  speaker: { type: Type.STRING },
                  context: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }

  private async extractGlobalTopics(analyses: any[]) {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Based on the following chunk analyses, extract the main topic clusters and subtopics.
      Analyses: ${JSON.stringify(analyses.map(a => a.keyPoints))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              subtopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              importance: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  }

  private async extractGlobalInsights(analyses: any[], topics: any[]) {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Synthesize deep insights from these analyses and topics.
      Analyses: ${JSON.stringify(analyses.map(a => a.keyPoints))}
      Topics: ${JSON.stringify(topics)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  }

  private async generateKnowledgeGraph(analyses: any[]) {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a knowledge graph of entities and their relationships from these analyses.
      Analyses: ${JSON.stringify(analyses.map(a => a.entities))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            relationships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  relation: { type: Type.STRING },
                  target: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  }

  private async generateFinalSynthesis(analyses: any[], topics: any[], insights: any[], knowledgeGraph: any[]): Promise<StructuredNote> {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate the final synthesis summary and Notion formatting.
      Analyses: ${JSON.stringify(analyses)}
      Topics: ${JSON.stringify(topics)}
      Insights: ${JSON.stringify(insights)}
      KnowledgeGraph: ${JSON.stringify(knowledgeGraph)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            bulletSummary: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  speaker: { type: Type.STRING }
                }
              } 
            },
            socialMediaSummaries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
              }
            },
            finalSynthesis: { type: Type.STRING },
            notionProperties: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                contentType: { type: Type.STRING },
                topic: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                speakers: { type: Type.ARRAY, items: { type: Type.STRING } },
                knowledgeDensity: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    });

    const synthesis = JSON.parse(response.text || "{}");

    // Aggregate unique speakers from all chunk analyses
    const allSpeakers = new Set<string>();
    analyses.forEach(a => {
      a.quotes?.forEach((q: any) => { if (q.speaker) allSpeakers.add(q.speaker); });
      a.keyPoints?.forEach((kp: any) => { if (kp.speaker) allSpeakers.add(kp.speaker); });
      a.actionItems?.forEach((ai: any) => { if (ai.assignee && ai.assignee !== 'Unassigned') allSpeakers.add(ai.assignee); });
      a.decisions?.forEach((d: any) => { d.stakeholders?.forEach((s: string) => allSpeakers.add(s)); });
    });
    
    // Also include speakers identified by the LLM in the final synthesis
    synthesis.notionProperties?.speakers?.forEach((s: string) => allSpeakers.add(s));

    const finalSpeakers = Array.from(allSpeakers).sort();

    // Combine everything
    return {
      ...synthesis,
      notionProperties: {
        ...synthesis.notionProperties,
        speakers: finalSpeakers
      },
      keyInsights: insights,
      actionItems: analyses.flatMap(a => a.actionItems),
      questionsRaised: analyses.flatMap(a => a.questionsRaised || []),
      timeline: analyses.flatMap(a => a.timeline),
      highlightQuotes: analyses.flatMap(a => a.quotes),
      topicClusters: topics,
      decisions: analyses.flatMap(a => a.decisions),
      knowledgeGraph: knowledgeGraph as any
    };
  }
}
