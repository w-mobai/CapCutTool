/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Keycap from './Keycap';
import { OS } from '../types';

interface VirtualKeyboardProps {
  system: OS;
  isDocked?: boolean;
  // Currently active keys to highlight (e.g., from hovering a shortcut)
  activeKeys: string[];
  // Selected key filter (filtering shortcuts by key)
  selectedKeyFilter: string | null;
  onKeyClick: (key: string) => void;
}

export default function VirtualKeyboard({
  system,
  isDocked = false,
  activeKeys,
  selectedKeyFilter,
  onKeyClick,
}: VirtualKeyboardProps) {
  // Normalize key name for matching
  const isKeyActive = (keyName: string) => {
    const norm = (k: string) => k.toLowerCase().trim();
    const normalizedKeyName = norm(keyName);
    
    // Check if it's highlighted by activeKeys
    const isHighlighted = activeKeys.some((activeKey) => {
      const normalizedActive = norm(activeKey);
      if (normalizedActive === normalizedKeyName) return true;
      
      // Symbol aliases
      if ((normalizedKeyName === '~' || normalizedKeyName === '`') && (normalizedActive === '~' || normalizedActive === '`')) return true;
      if ((normalizedKeyName === '=' || normalizedKeyName === '+') && (normalizedActive === '=' || normalizedActive === '+')) return true;
      if ((normalizedKeyName === '-' || normalizedKeyName === '_') && (normalizedActive === '-' || normalizedActive === '_')) return true;
      
      // Aliases
      if (normalizedKeyName === 'ctrl' && normalizedActive === 'control') return true;
      if (normalizedKeyName === 'cmd' && (normalizedActive === 'command' || normalizedActive === 'win')) return true;
      if (normalizedKeyName === 'alt' && normalizedActive === 'option') return true;
      return false;
    });

    if (isHighlighted) return true;

    // Check if it matches the active filter
    if (selectedKeyFilter) {
      const normalizedFilter = norm(selectedKeyFilter);
      if (normalizedFilter === normalizedKeyName) return true;
      if ((normalizedKeyName === '~' || normalizedKeyName === '`') && (normalizedFilter === '~' || normalizedFilter === '`')) return true;
      if ((normalizedKeyName === '=' || normalizedKeyName === '+') && (normalizedFilter === '=' || normalizedFilter === '+')) return true;
      if ((normalizedKeyName === '-' || normalizedKeyName === '_') && (normalizedFilter === '-' || normalizedFilter === '_')) return true;
      if (normalizedKeyName === 'ctrl' && normalizedFilter === 'control') return true;
      if (normalizedKeyName === 'cmd' && (normalizedFilter === 'command' || normalizedFilter === 'win')) return true;
      if (normalizedKeyName === 'alt' && normalizedFilter === 'option') return true;
    }

    return false;
  };

  const isKeyFiltered = (keyName: string) => {
    if (!selectedKeyFilter) return false;
    const norm = (k: string) => k.toLowerCase().trim();
    const normalizedKeyName = norm(keyName);
    const normalizedFilter = norm(selectedKeyFilter);
    return (
      normalizedKeyName === normalizedFilter ||
      ((normalizedKeyName === '~' || normalizedKeyName === '`') && (normalizedFilter === '~' || normalizedFilter === '`')) ||
      ((normalizedKeyName === '=' || normalizedKeyName === '+') && (normalizedFilter === '=' || normalizedFilter === '+')) ||
      ((normalizedKeyName === '-' || normalizedKeyName === '_') && (normalizedFilter === '-' || normalizedFilter === '_')) ||
      (normalizedKeyName === 'ctrl' && normalizedFilter === 'control') ||
      (normalizedKeyName === 'cmd' && (normalizedFilter === 'command' || normalizedFilter === 'win')) ||
      (normalizedKeyName === 'alt' && normalizedFilter === 'option')
    );
  };

  // Keyboard Rows definition
  // row: array of keys, with standard key values and width adjustments if needed
  const row1 = [
    { value: 'Esc', width: 'w-8 md:w-10' },
    { value: '~' },
    { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, 
    { value: '5' }, { value: '6' }, { value: '7' }, { value: '8' }, 
    { value: '9' }, { value: '0' }, { value: '-' }, { value: '=' },
    { value: 'Backspace', width: 'flex-1 min-w-[3.5rem]' }
  ];

  const row2 = [
    { value: 'Tab', width: 'w-10 md:w-12' },
    { value: 'Q' }, { value: 'W' }, { value: 'E' }, { value: 'R' }, 
    { value: 'T' }, { value: 'Y' }, { value: 'U' }, { value: 'I' }, 
    { value: 'O' }, { value: 'P' }, { value: '[' }, { value: ']' },
    { value: '\\', width: 'flex-1' }
  ];

  const row3 = [
    { value: 'Caps', width: 'w-12 md:w-14' },
    { value: 'A' }, { value: 'S' }, { value: 'D' }, { value: 'F' }, 
    { value: 'G' }, { value: 'H' }, { value: 'J' }, { value: 'K' }, 
    { value: 'L' }, { value: ';' }, { value: '\'' },
    { value: 'Enter', width: 'flex-1 min-w-[3.5rem]' }
  ];

  const row4 = [
    { value: 'Shift', width: 'w-14 md:w-18' },
    { value: 'Z' }, { value: 'X' }, { value: 'C' }, { value: 'V' }, 
    { value: 'B' }, { value: 'N' }, { value: 'M' }, { value: ',' }, 
    { value: '.' }, { value: '/' },
    { value: 'Shift', width: 'flex-1 min-w-[3.5rem]' }
  ];

  const row5 = [
    { value: 'Ctrl', width: 'w-10 md:w-12' },
    { value: system === 'macos' ? 'Option' : 'Alt', width: 'w-10 md:w-12' },
    { value: system === 'macos' ? 'Cmd' : 'Win', width: 'w-12 md:w-14' },
    { value: 'Space', width: 'flex-1 max-w-[24rem]' },
    { value: system === 'macos' ? 'Cmd' : 'Win', width: 'w-12 md:w-14' },
    { value: system === 'macos' ? 'Option' : 'Alt', width: 'w-10 md:w-12' },
    { value: 'Left', label: '←' },
    { 
      value: 'UpDownCol', 
      isSpecialCol: true, 
      width: 'w-9' 
    },
    { value: 'Right', label: '→' }
  ];

  const renderKey = (key: any, index: number) => {
    if (key.isSpecialCol) {
      // Custom double-row block for Up/Down arrow keys so they fit neatly in 1 column width
      const upActive = isKeyActive('Up');
      const downActive = isKeyActive('Down');
      const upFiltered = isKeyFiltered('Up');
      const downFiltered = isKeyFiltered('Down');
      
      return (
        <div key="up-down-col" className="flex flex-col gap-0.5 justify-between h-9 w-9">
          <button
            type="button"
            id="virtual-key-up"
            onClick={() => onKeyClick('Up')}
            className={`h-[17px] w-full flex items-center justify-center rounded border text-[9px] select-none transition-all duration-75
              ${upActive 
                ? 'bg-amber-400 border-amber-600 text-amber-950 font-bold scale-95 shadow-inner' 
                : upFiltered
                ? 'bg-amber-500 border-amber-600 text-amber-950 font-bold scale-95'
                : 'bg-gradient-to-b from-zinc-50 to-zinc-150 border-zinc-300 text-zinc-700 hover:bg-zinc-200'
              }
            `}
          >
            ↑
          </button>
          <button
            type="button"
            id="virtual-key-down"
            onClick={() => onKeyClick('Down')}
            className={`h-[17px] w-full flex items-center justify-center rounded border text-[9px] select-none transition-all duration-75
              ${downActive 
                ? 'bg-amber-400 border-amber-600 text-amber-950 font-bold scale-95 shadow-inner' 
                : downFiltered
                ? 'bg-amber-500 border-amber-600 text-amber-950 font-bold scale-95'
                : 'bg-gradient-to-b from-zinc-50 to-zinc-150 border-zinc-300 text-zinc-700 hover:bg-zinc-200'
              }
            `}
          >
            ↓
          </button>
        </div>
      );
    }

    const isActive = isKeyActive(key.value);
    const isFiltered = isKeyFiltered(key.value);

    return (
      <Keycap
        key={`${key.value}-${index}`}
        value={key.value}
        system={system}
        isHighlighted={isActive || isFiltered}
        isPressed={isActive}
        className={`${key.width || 'w-9 md:w-10'} h-9 flex-shrink-0 transition-all duration-100`}
        size="sm"
        onClick={() => onKeyClick(key.value)}
      />
    );
  };

  return (
    <div
      id="virtual-keyboard-container"
      className={`w-full rounded-xl border p-4 transition-colors duration-200 ${
        isDocked
          ? 'border-white/20 bg-white/[0.12] shadow-2xl shadow-black/45 backdrop-blur-xl'
          : 'border-zinc-800 bg-zinc-900 shadow-xl'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-xs text-zinc-400 font-medium">
            交互式虚拟键盘{' '}
            {selectedKeyFilter
              ? `(已锁定: ${selectedKeyFilter})`
              : activeKeys.length > 0
                ? `(已锁定: ${activeKeys.join(' + ')})`
                : '(单击卡片锁定组合，或点击单键过滤)'}
          </span>
        </div>
        {selectedKeyFilter && (
          <button
            id="clear-key-filter"
            type="button"
            onClick={() => onKeyClick(selectedKeyFilter)}
            className="text-[10px] text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400 px-2 py-0.5 rounded cursor-pointer transition-all"
          >
            清除键盘过滤 ×
          </button>
        )}
      </div>

      {/* Overflow wrapper for mobile viewport styling */}
      <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <div className="flex flex-col gap-1 min-w-[620px] max-w-full mx-auto select-none p-1 bg-zinc-950 rounded-lg border border-zinc-800/80">
          {/* Row 1 */}
          <div className="flex gap-1 w-full">{row1.map(renderKey)}</div>
          {/* Row 2 */}
          <div className="flex gap-1 w-full">{row2.map(renderKey)}</div>
          {/* Row 3 */}
          <div className="flex gap-1 w-full">{row3.map(renderKey)}</div>
          {/* Row 4 */}
          <div className="flex gap-1 w-full">{row4.map(renderKey)}</div>
          {/* Row 5 */}
          <div className="flex gap-1 w-full">{row5.map(renderKey)}</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-3 text-[11px] text-zinc-500 px-1 border-t border-zinc-800/50 pt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm bg-zinc-100 border border-zinc-300"></span>
          <span>普通按键</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm bg-zinc-700"></span>
          <span>系统功能修饰键</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm bg-amber-400"></span>
          <span>高亮 / 正在点击 / 所选按键</span>
        </div>
        <div className="ml-auto text-zinc-600 hidden sm:block font-mono">QWERTY 60% Layout</div>
      </div>
    </div>
  );
}
