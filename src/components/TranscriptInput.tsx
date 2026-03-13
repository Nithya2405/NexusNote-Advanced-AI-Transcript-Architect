/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Upload, FileText, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onProcess: (transcript: string) => void;
  isProcessing: boolean;
}

export const TranscriptInput: React.FC<Props> = ({ onProcess, isProcessing }) => {
  const [transcript, setTranscript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      onProcess(transcript);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151619] border border-[#141414] rounded-xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <FileText className="w-5 h-5 text-emerald-500" />
        </div>
        <h2 className="text-xl font-medium text-white font-sans tracking-tight">Transcript Ingestion</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your transcript here (Online meetings, Podcasts, Lectures, YouTube transcripts...)"
            className="w-full h-64 bg-[#0a0a0a] border border-[#141414] rounded-lg p-4 text-gray-300 font-mono text-sm focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
            disabled={isProcessing}
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono">
            {transcript.length.toLocaleString()} characters
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-gray-400 rounded-lg hover:bg-[#1a1a1a] transition-colors text-sm font-medium"
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
          </div>

          <button
            type="submit"
            disabled={isProcessing || !transcript.trim()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
              isProcessing || !transcript.trim()
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            }`}
          >
            <Play className="w-4 h-4" />
            {isProcessing ? 'Processing Pipeline...' : 'Start AI Architect'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
