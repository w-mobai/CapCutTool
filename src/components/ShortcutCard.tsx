/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shortcut, OS } from '../types';
import Keycap from './Keycap';
import { Star, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ShortcutCardProps {
  key?: React.Key;
  shortcut: Shortcut;
  system: OS;
  isFavorite: boolean;
  isLocked: boolean;
  onToggleFavorite: (id: string) => void;
  onLock: (id: string) => void;
}

export default function ShortcutCard({
  shortcut,
  system,
  isFavorite,
  isLocked,
  onToggleFavorite,
  onLock,
}: ShortcutCardProps) {
  const [expanded, setExpanded] = useState(false);

  const keys = shortcut.keys[system] || [];
  const categoryStyles = {
    editing: {
      card: 'hover:border-chart-3',
      title: 'group-hover:text-chart-3',
      bar: 'bg-chart-3',
    },
    playback: {
      card: 'hover:border-chart-2',
      title: 'group-hover:text-chart-2',
      bar: 'bg-chart-2',
    },
    timeline: {
      card: 'hover:border-chart-5',
      title: 'group-hover:text-chart-5',
      bar: 'bg-chart-5',
    },
    'text-effects': {
      card: 'hover:border-chart-4',
      title: 'group-hover:text-chart-4',
      bar: 'bg-chart-4',
    },
    'file-global': {
      card: 'hover:border-chart-1',
      title: 'group-hover:text-chart-1',
      bar: 'bg-chart-1',
    },
    favorites: {
      card: 'hover:border-accent',
      title: 'group-hover:text-accent',
      bar: 'bg-accent',
    },
  }[shortcut.category];

  return (
    <div
      id={`shortcut-card-${shortcut.id}`}
      onClick={() => onLock(shortcut.id)}
      className={`
        relative flex flex-col justify-between
        border
        rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md
        transition-all duration-200 group overflow-hidden cursor-pointer
        ${isFavorite && !isLocked ? 'ring-1 ring-amber-500/10' : ''}
        ${isLocked
          ? 'bg-amber-500/[0.08] border-transparent -translate-y-0.5 shadow-[0_12px_32px_rgba(245,158,11,0.14)]'
          : `bg-zinc-900 border-border ${categoryStyles.card}`}
      `}
    >
      {/* Decorative top ambient color block */}
      <div className={`absolute top-0 left-0 w-full h-[3px] ${categoryStyles.bar}`} />

      {/* Title & Action controls */}
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <h4 className={`font-bold text-sm md:text-base transition-colors ${
            isLocked ? 'text-amber-300' : `text-zinc-100 ${categoryStyles.title}`
          }`}>
            {shortcut.name}
          </h4>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {isLocked && (
              <span className="mr-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-amber-300">
                已锁定
              </span>
            )}
            <button
              id={`btn-fav-${shortcut.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(shortcut.id);
              }}
              title={isFavorite ? '取消收藏' : '加入收藏'}
              className="p-1 rounded-md cursor-pointer transition-colors"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-zinc-500 hover:text-accent'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          {shortcut.description}
        </p>
      </div>

      {/* Keycaps Visualised */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex items-center gap-1.5 flex-wrap">
          {keys.length > 0 ? (
            keys.map((key, index) => (
              <React.Fragment key={`${key}-${index}`}>
                {index > 0 && (
                  <span className="text-zinc-600 text-xs font-semibold">+</span>
                )}
                <Keycap value={key} system={system} size="sm" />
              </React.Fragment>
            ))
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-900 border border-dashed border-border/60 text-zinc-500 font-sans">
              未绑定 (可自定义)
            </span>
          )}
        </div>

        {/* Extra Tip Expanding block */}
        {shortcut.tips && (
          <div className="border-t border-zinc-800/60 pt-2.5 mt-1">
            <button
              id={`btn-expand-tips-${shortcut.id}`}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setExpanded(!expanded);
              }}
              className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-400 cursor-pointer transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-500/80" />
              <span>使用小窍门</span>
              {expanded ? (
                <ChevronUp className="w-3 h-3 ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 ml-0.5" />
              )}
            </button>

            {expanded && (
              <p className="text-[11px] text-zinc-500 bg-zinc-950/40 border border-border/45 rounded p-2.5 mt-2 leading-relaxed animate-fade-in font-sans">
                {shortcut.tips}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
