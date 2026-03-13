/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TranscriptInput } from './components/TranscriptInput';
import { PipelineProgress } from './components/PipelineProgress';
import { NoteDisplay } from './components/NoteDisplay';
import { TranscriptProcessor } from './services/geminiService';
import { StructuredNote, ProcessingState, PipelineStage } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, FileText, Info, Settings, Github, Database, Layers, GitGraph, FileOutput, ShieldCheck, Maximize2 } from 'lucide-react';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  const [note, setNote] = useState<StructuredNote | null>(null);
  const [showBlueprint, setShowBlueprint] = useState(false);

  const handleProcess = async (transcript: string) => {
    setIsProcessing(true);
    setNote(null);
    setProcessingState({ stage: PipelineStage.PREPROCESSING, progress: 0 });

    const processor = new TranscriptProcessor(transcript, (state) => {
      setProcessingState(state);
    });

    try {
      const result = await processor.process();
      setNote(result);
    } catch (error) {
      console.error('Processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#141414] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Brain className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white tracking-tight">NexusNote</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">AI Transcript Architect</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowBlueprint(true)}
              className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-emerald-500 transition-colors uppercase tracking-widest"
            >
              <Info className="w-4 h-4" />
              Technical Blueprint
            </button>
            <div className="w-px h-4 bg-gray-800" />
            <div className="flex items-center gap-4">
              <Settings className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Input & Pipeline */}
          <div className="lg:col-span-4 space-y-8">
            <TranscriptInput onProcess={handleProcess} isProcessing={isProcessing} />
            {processingState && (
              <PipelineProgress state={processingState} />
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {note ? (
                <NoteDisplay note={note} />
              ) : !isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[600px] border-2 border-dashed border-[#141414] rounded-2xl flex flex-col items-center justify-center text-center p-12 space-y-6"
                >
                  <div className="p-6 bg-[#141414] rounded-3xl">
                    <FileText className="w-12 h-12 text-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white">No Transcript Processed</h3>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                      Upload or paste a transcript on the left to begin the AI-driven transformation into structured knowledge.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <FeatureItem icon={Database} label="Multi-Stage Pipeline" />
                    <FeatureItem icon={GitGraph} label="Knowledge Graph" />
                    <FeatureItem icon={Layers} label="Topic Clustering" />
                    <FeatureItem icon={ShieldCheck} label="Hallucination Guard" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium text-white">Architecting Knowledge...</h3>
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-widest">
                      {processingState?.stage.replace('_', ' ')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Blueprint Modal */}
      <AnimatePresence>
        {showBlueprint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBlueprint(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#151619] border border-[#141414] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-[#141414] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Maximize2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium text-white tracking-tight">System Architecture Blueprint</h2>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Technical Specification v1.0</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBlueprint(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-12 space-y-16 scrollbar-hide">
                <BlueprintSection title="1. System Architecture">
                  <p className="text-gray-400 leading-relaxed mb-6">
                    NexusNote utilizes a distributed, multi-stage LLM pipeline designed for high-throughput transcript processing.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ArchitectureCard title="Input Layer" items={['Webhooks', 'File Upload', 'URL Scrapers']} />
                    <ArchitectureCard title="Processing Engine" items={['Multi-Stage LLM', 'Embedding Models', 'Semantic Chunking']} />
                    <ArchitectureCard title="Output Layer" items={['Notion API', 'Markdown Export', 'Knowledge Graph JSON']} />
                  </div>
                </BlueprintSection>

                <BlueprintSection title="2. Data Flow Pipeline">
                  <div className="space-y-4">
                    {[
                      'Transcript Ingestion & Cleaning',
                      'Semantic Chunking (8k tokens with 1k overlap)',
                      'Parallel Chunk Analysis (Key Points, Entities, Actions)',
                      'Global Topic Clustering & Semantic Mapping',
                      'Deep Insight Synthesis & Knowledge Graph Generation',
                      'Notion-Optimized Formatting & Export'
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-[#141414] rounded-xl border border-white/5">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 font-mono text-xs">0{i+1}</div>
                        <span className="text-sm text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </BlueprintSection>

                <BlueprintSection title="3. Chunking Strategy">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-white">Semantic Preservation</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        We use a sliding window approach with 8000 token chunks and 1000 token overlap to ensure context is never lost at boundaries.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-white">Timestamp Mapping</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Each chunk maintains its relative temporal position, allowing the final synthesis to reconstruct a chronological timeline.
                      </p>
                    </div>
                  </div>
                </BlueprintSection>

                <BlueprintSection title="4. Hallucination Prevention">
                  <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-red-500" />
                      <h4 className="text-sm font-medium text-white">Source Grounding Protocol</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      The system is strictly instruction-tuned to only extract information present in the source text. If a query cannot be answered, the system defaults to: <code className="text-red-400">"Not explicitly stated in transcript."</code>
                    </p>
                  </div>
                </BlueprintSection>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FeatureItem = ({ icon: Icon, label }: any) => (
  <div className="flex items-center gap-2 p-3 bg-[#141414] rounded-xl border border-white/5">
    <Icon className="w-4 h-4 text-emerald-500" />
    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

const BlueprintSection = ({ title, children }: any) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-white font-sans border-l-4 border-emerald-500 pl-4">{title}</h3>
    {children}
  </div>
);

const ArchitectureCard = ({ title, items }: any) => (
  <div className="p-6 bg-[#141414] rounded-2xl border border-white/5 space-y-4">
    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">{title}</h4>
    <ul className="space-y-2">
      {items.map((item: string) => (
        <li key={item} className="text-sm text-gray-300 flex items-center gap-2">
          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);
