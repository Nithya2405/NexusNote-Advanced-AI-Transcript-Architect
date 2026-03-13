/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StructuredNote } from '../types';
import { motion } from 'motion/react';
import { 
  FileText, List, Lightbulb, CheckSquare, HelpCircle, Clock, Quote, 
  Layers, GitGraph, Share2, FileOutput, Tag, Users, Zap
} from 'lucide-react';

interface Props {
  note: StructuredNote;
}

export const NoteDisplay: React.FC<Props> = ({ note }) => {
  return (
    <div className="space-y-8 pb-20">
      {/* Header / Notion Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#151619] border border-[#141414] rounded-xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-medium text-white font-sans tracking-tight leading-tight">
              {note.notionProperties.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Tag className="w-3 h-3" /> {note.notionProperties.contentType}</span>
              <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> {note.notionProperties.topic}</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3 h-3" /> KD: {note.notionProperties.knowledgeDensity.toFixed(1)}</span>
            </div>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <FileOutput className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {note.notionProperties.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-[#141414] text-gray-400 rounded-full text-[10px] font-mono uppercase tracking-widest border border-white/5">
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section icon={FileText} title="Executive Summary" color="emerald">
            <p className="text-gray-300 leading-relaxed font-sans">{note.executiveSummary}</p>
          </Section>
          <Section icon={Users} title="Identified Speakers" color="blue">
            <div className="flex flex-wrap gap-3">
              {note.notionProperties.speakers.map(speaker => (
                <div key={speaker} className="flex items-center gap-2 px-4 py-2 bg-blue-500/5 text-blue-400 rounded-xl border border-blue-500/10 hover:bg-blue-500/10 transition-colors group cursor-default">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold group-hover:bg-blue-500/30 transition-colors">
                    {speaker.charAt(0)}
                  </div>
                  <span className="text-sm font-medium">{speaker}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Summaries & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <SectionCard icon={List} title="Bullet Summary" color="emerald">
            <ul className="space-y-4">
              {note.bulletSummary.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 font-sans leading-relaxed group">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="space-y-1">
                    {item.speaker && (
                      <span className="text-[10px] font-mono text-emerald-500/70 uppercase tracking-widest block">
                        {item.speaker}
                      </span>
                    )}
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Lightbulb} title="Key Insights" color="amber">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {note.keyInsights.map((insight, i) => (
                <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                  <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Insight {i + 1}</div>
                  <p className="text-sm text-gray-300 font-sans leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Clock} title="Timeline of Discussion" color="blue">
            <div className="space-y-6">
              {note.timeline.map((event, i) => (
                <div key={i} className="relative flex gap-6 pl-4">
                  {i < note.timeline.length - 1 && (
                    <div className="absolute left-0 top-6 w-px h-full bg-blue-500/20" />
                  )}
                  <div className="absolute left-[-4px] top-2 w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-shrink-0 w-20 text-[10px] font-mono text-blue-500 uppercase tracking-widest pt-1">
                    {event.timestamp}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-white">{event.topic}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{event.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Quote} title="Highlight Quotes" color="purple">
            <div className="space-y-6">
              {note.highlightQuotes.map((q, i) => (
                <blockquote key={i} className="relative p-6 bg-purple-500/5 border-l-4 border-purple-500 rounded-r-xl space-y-3">
                  <p className="text-lg text-gray-200 italic font-serif leading-relaxed">"{q.quote}"</p>
                  <footer className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-400">— {q.speaker}</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{q.context}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Column: Action Items, Decisions, Knowledge */}
        <div className="space-y-8">
          <SectionCard icon={CheckSquare} title="Action Items" color="emerald">
            <div className="space-y-4">
              {note.actionItems.map((item, i) => (
                <div key={i} className="p-4 bg-[#141414] border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest ${
                      item.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                      item.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {item.priority}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] font-mono text-emerald-500 font-medium uppercase tracking-widest">{item.assignee}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-200 font-medium">{item.task}</p>
                  <p className="text-[10px] text-gray-500 italic">{item.context}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Layers} title="Topic Clusters" color="indigo">
            <div className="space-y-4">
              {note.topicClusters.map((cluster, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">{cluster.topic}</h4>
                    <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${cluster.importance * 10}%` }} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.subtopics.map(sub => (
                      <span key={sub} className="px-2 py-0.5 bg-indigo-500/5 text-indigo-400 rounded text-[10px] font-mono border border-indigo-500/10">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={CheckSquare} title="Decisions Detected" color="amber">
            <div className="space-y-4">
              {note.decisions.map((d, i) => (
                <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Decision {i + 1}</span>
                    <div className="flex -space-x-2">
                      {d.stakeholders.map((s, j) => (
                        <div key={j} className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[8px] font-bold text-amber-500" title={s}>
                          {s.charAt(0)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-200 font-medium">{d.decision}</p>
                  <p className="text-xs text-gray-500 italic">{d.rationale}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={HelpCircle} title="Questions Raised" color="rose">
            <ul className="space-y-3">
              {note.questionsRaised.map((q, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-sans leading-relaxed">
                  <HelpCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  {q}
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard icon={Share2} title="Social Media Summaries" color="sky">
            <div className="space-y-4">
              {note.socialMediaSummaries.map((s, i) => (
                <div key={i} className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-xl space-y-2">
                  <div className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">{s.platform}</div>
                  <p className="text-xs text-gray-300 leading-relaxed">{s.content}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Knowledge Graph Section */}
      <SectionCard icon={GitGraph} title="Knowledge Graph" color="emerald">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Detected Entities</h4>
            <div className="grid grid-cols-1 gap-2">
              {note.knowledgeGraph.entities.map((entity, i) => (
                <div key={i} className="p-3 bg-[#141414] border border-white/5 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-white">{entity.name}</div>
                    <div className="text-[10px] text-gray-500">{entity.description}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-[8px] font-mono uppercase tracking-widest">
                    {entity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Semantic Relationships</h4>
            <div className="space-y-3">
              {note.knowledgeGraph.relationships.map((rel, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-500 font-medium">{rel.source}</span>
                  <div className="flex-grow h-px bg-white/10 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-2 bg-[#151619] text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                        {rel.relation}
                      </span>
                    </div>
                  </div>
                  <span className="text-emerald-500 font-medium">{rel.target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Final Synthesis */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-8 space-y-4"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-medium text-white">Final Synthesis Summary</h3>
        </div>
        <p className="text-gray-300 leading-relaxed font-sans text-lg">
          {note.finalSynthesis}
        </p>
      </motion.div>
    </div>
  );
};

const Section = ({ icon: Icon, title, children, color }: any) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 text-${color}-500`} />
      <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest">{title}</h3>
    </div>
    {children}
  </div>
);

const SectionCard = ({ icon: Icon, title, children, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-[#151619] border border-[#141414] rounded-xl p-6 shadow-xl space-y-6"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 bg-${color}-500/10 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color}-500`} />
      </div>
      <h3 className="text-lg font-medium text-white font-sans tracking-tight">{title}</h3>
    </div>
    {children}
  </motion.div>
);
