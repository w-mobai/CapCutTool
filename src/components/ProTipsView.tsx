/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { PRO_TIPS_CATEGORIES, PRO_TIPS_DATA, ProTip } from '../data/tips';
import { OS } from '../types';
import {
  Lightbulb,
  Search,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import Keycap from './Keycap';

interface ProTipsViewProps {
  system: OS;
  onHighlightKeys: (keys: string[]) => void;
  onLocateShortcut: (query: string) => void;
}

export default function ProTipsView({
  system,
  onHighlightKeys,
  onLocateShortcut,
}: ProTipsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter tips based on active category and search input
  const filteredTips = useMemo(() => {
    return PRO_TIPS_DATA.filter((tip) => {
      // Category match
      if (activeCategory !== 'all' && tip.category !== activeCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = tip.title.toLowerCase().includes(query);
        const matchesSlogan = tip.slogan.toLowerCase().includes(query);
        const matchesPain = tip.painPoint.toLowerCase().includes(query);
        const matchesPrinciple = tip.principle.toLowerCase().includes(query);
        const matchesTag = tip.tag.toLowerCase().includes(query);
        return matchesTitle || matchesSlogan || matchesPain || matchesPrinciple || matchesTag;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  // Handle keys copying as a quick clipboard aid
  const handleCopyKeys = (tip: ProTip) => {
    if (!tip.relatedKeys || tip.relatedKeys.length === 0) return;
    const shortcutStr = tip.relatedKeys.join(' + ');
    navigator.clipboard.writeText(shortcutStr);
    setCopiedId(tip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Convert generic key names to OS specific keycap values
  const getOSKeys = (keys?: string[]): string[] => {
    if (!keys) return [];
    return keys.map((key) => {
      const lower = key.toLowerCase();
      if (lower === 'ctrl') return system === 'macos' ? 'Cmd' : 'Ctrl';
      if (lower === 'alt') return system === 'macos' ? 'Option' : 'Alt';
      return key;
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Welcome Banner with Teacher's Core Value */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-linear-to-r from-amber-500 to-orange-500 text-zinc-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                子牧老师实战课提炼
              </span>
              <span className="text-zinc-500 text-xs">自媒体剪辑黄金法则</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-zinc-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              剪映核心设置与避坑秘籍
            </h2>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed max-w-2xl">
              从全局设置、素材预处理到粗剪筛选、气口和帧级精剪，将课程里的操作步骤与判断标准整理成可随时查看的实战工作流。
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-zinc-950/60 border border-zinc-850 rounded-xl">
            <span className="text-amber-400 font-mono font-bold text-sm">💡 金句</span>
            <span className="text-zinc-400 text-[11px] italic font-medium">“万变不离其宗，剪辑是自媒体的基建能力。”</span>
          </div>
        </div>
      </div>

      {/* Categories Tabs & Search bar row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900 border border-zinc-800/80 rounded-2xl p-3.5 shadow-sm">
        {/* Category switcher tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {PRO_TIPS_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap cursor-pointer transition-all border
                ${
                  activeCategory === cat.id
                    ? 'bg-zinc-800 border-zinc-750 text-amber-400 shadow-sm shadow-black/10'
                    : 'bg-transparent border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Local tips search input */}
        <div className="relative w-full sm:w-64">
          <input
            id="search-tips"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索爆爆款秘籍与避坑细节..."
            className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 text-zinc-200 text-xs px-3.5 py-2 rounded-xl transition-all outline-hidden pr-8 font-medium"
          />
          {searchQuery ? (
            <button
              id="clear-tips-search"
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-zinc-600" />
          )}
        </div>
      </div>

      {/* Grid List of Pro Tips */}
      {filteredTips.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <HelpCircle className="w-10 h-10 text-zinc-600 mb-3" />
          <h4 className="font-bold text-zinc-300 text-sm">未找到相关的核心秘籍</h4>
          <p className="text-zinc-500 text-xs mt-1.5">请尝试缩短或更换搜索关键字，或切换上方分类栏。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTips.map((tip) => {
            const osKeys = getOSKeys(tip.relatedKeys);
            return (
              <div
                id={`tip-card-${tip.id}`}
                key={tip.id}
                className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/80 transition-all duration-300 group shadow-md hover:shadow-lg hover:shadow-black/20"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono tracking-wide uppercase">
                      {tip.tag}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {tip.category === 'setting'
                        ? '⚙️ 全局设置'
                        : tip.category === 'audio'
                        ? '🎵 音频素材'
                        : tip.category === 'video'
                        ? '🎬 视频素材'
                        : tip.category === 'efficiency'
                        ? '⚡ 操作提效'
                        : tip.category === 'rough-cut'
                        ? '🧱 粗剪筛选'
                        : '🎯 精剪节奏'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-zinc-100 text-base group-hover:text-amber-400 transition-colors tracking-tight mb-2">
                    {tip.title}
                  </h3>

                  {/* Gold Slogan (Core Mantra) */}
                  <div className="bg-amber-500/5 border-l-2 border-amber-500 px-3 py-1.5 rounded-r-xl mb-4">
                    <div className="text-[11px] font-extrabold text-amber-400 tracking-wide flex items-center gap-1.5 uppercase">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      子牧老师口诀：{tip.slogan}
                    </div>
                  </div>

                  {/* Pain Point */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      常见痛点与隐患：
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed pl-5 font-medium">
                      {tip.painPoint}
                    </p>
                  </div>

                  {/* Action Steps */}
                  <div className="mb-5">
                    <div className="text-[11px] font-bold text-zinc-400 mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                      神级实操步骤：
                    </div>
                    <ul className="flex flex-col gap-2 pl-5">
                      {tip.steps.map((step, idx) => (
                        <li key={idx} className="text-zinc-300 text-xs leading-relaxed flex gap-2">
                          <span className="text-amber-500 font-mono font-bold text-xs select-none">
                            {idx + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer block (Principle explanation & Key interaction) */}
                <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3.5 mt-4">
                  {/* Under-the-hood Principle */}
                  <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-3">
                    <div className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-zinc-500" />
                      避坑原理 / 为什么这样做
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                      {tip.principle}
                    </p>
                  </div>

                  {/* Associated Keys */}
                  {osKeys.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/30 p-2 rounded-xl border border-zinc-850/50">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-500 font-medium">涉及按键：</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {osKeys.map((key, index) => (
                            <React.Fragment key={`${key}-${index}`}>
                              {index > 0 && <span className="text-zinc-700 text-[10px]">+</span>}
                              <Keycap value={key} system={system} size="sm" />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Action tools */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onHighlightKeys(osKeys)}
                          title="在虚拟键盘上点亮高亮这组按键"
                          className="px-2.5 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-750 text-amber-400/90 rounded border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          ⌨️ 键盘高亮
                        </button>
                        {tip.relatedKeys && tip.relatedKeys.length === 1 && (
                          <button
                            type="button"
                            onClick={() => onLocateShortcut(tip.relatedKeys![0])}
                            title="在快捷键列表中直接定位此功能"
                            className="px-2.5 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-750 text-sky-400/90 rounded border border-zinc-700 hover:border-zinc-600 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            🔍 定位快捷键
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopyKeys(tip)}
                          title="一键复制快捷键字符串"
                          className="p-1 text-zinc-500 hover:text-zinc-300 bg-zinc-800/60 rounded border border-transparent hover:border-zinc-700 cursor-pointer"
                        >
                          {copiedId === tip.id ? (
                            <Check className="w-3 h-3 text-emerald-500 animate-pulse" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// X button mock implementation for standard clean look
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
