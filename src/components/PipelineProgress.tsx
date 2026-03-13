/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PipelineStage, ProcessingState } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2, AlertCircle, Database, Layers, Brain, GitGraph, FileOutput } from 'lucide-react';

interface Props {
  state: ProcessingState;
}

const STAGES = [
  { id: PipelineStage.PREPROCESSING, label: 'Preprocessing', icon: Database },
  { id: PipelineStage.CHUNKING, label: 'Chunking', icon: Layers },
  { id: PipelineStage.CHUNK_ANALYSIS, label: 'Chunk Analysis', icon: Brain },
  { id: PipelineStage.TOPIC_CLUSTERING, label: 'Topic Clustering', icon: Layers },
  { id: PipelineStage.INSIGHT_EXTRACTION, label: 'Insight Extraction', icon: Brain },
  { id: PipelineStage.KNOWLEDGE_EXTRACTION, label: 'Knowledge Extraction', icon: GitGraph },
  { id: PipelineStage.GLOBAL_SYNTHESIS, label: 'Global Synthesis', icon: FileOutput },
];

export const PipelineProgress: React.FC<Props> = ({ state }) => {
  const currentStageIndex = STAGES.findIndex(s => s.id === state.stage);

  return (
    <div className="bg-[#151619] border border-[#141414] rounded-xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium text-white font-sans tracking-tight">AI Processing Pipeline</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">{state.stage}</span>
        </div>
      </div>

      <div className="space-y-6">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex || state.stage === PipelineStage.COMPLETED;
          const isCurrent = index === currentStageIndex && state.stage !== PipelineStage.COMPLETED;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative flex items-start gap-4">
              {index < STAGES.length - 1 && (
                <div className={`absolute left-5 top-10 w-0.5 h-10 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-800'}`} />
              )}
              
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500 border-emerald-500 text-black' :
                isCurrent ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' :
                'bg-gray-900 border-gray-800 text-gray-700'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                 isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> :
                 <Icon className="w-5 h-5" />}
              </div>

              <div className="flex-grow pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-white' : 'text-gray-600'}`}>
                    {stage.label}
                  </span>
                  {isCurrent && state.totalChunks && (
                    <span className="text-[10px] font-mono text-emerald-500">
                      CHUNK {state.currentChunk}/{state.totalChunks}
                    </span>
                  )}
                </div>
                
                {isCurrent && (
                  <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${state.progress}%` }}
                      className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-red-500">Pipeline Error</h4>
            <p className="text-xs text-red-400 font-mono leading-relaxed">{state.error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
