/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface KeycapProps {
  key?: React.Key;
  // The label of the key to display, e.g., "Ctrl", "Cmd", "B", "Space", "Shift"
  value: string;
  // Which OS context to render for (used to show appropriate icons like ⌘ or ⌥)
  system?: 'windows' | 'macos';
  // Highlight state (e.g., when hovered or part of active shortcut)
  isHighlighted?: boolean;
  // Is physically pressed (active transition)
  isPressed?: boolean;
  // Custom sizing or padding classes
  className?: string;
  // On click handler (useful for interactive keyboard filtering!)
  onClick?: () => void;
  // Size preset
  size?: 'sm' | 'md' | 'lg';
}

export default function Keycap({
  value,
  system = 'windows',
  isHighlighted = false,
  isPressed = false,
  className = '',
  onClick,
  size = 'md',
}: KeycapProps) {
  // Normalise key label based on OS
  const getDisplayLabel = (val: string) => {
    const lower = val.toLowerCase();
    
    // System-specific modifiers
    if (lower === 'cmd' || lower === 'command') {
      return system === 'macos' ? '⌘ Cmd' : 'Win';
    }
    if (lower === 'ctrl' || lower === 'control') {
      return system === 'macos' ? '⌃ Ctrl' : 'Ctrl';
    }
    if (lower === 'alt') {
      return system === 'macos' ? '⌥ Option' : 'Alt';
    }
    if (lower === 'option') {
      return '⌥ Option';
    }
    if (lower === 'shift') {
      return system === 'macos' ? '⇧ Shift' : 'Shift';
    }
    
    // Non-modifier keys
    if (lower === 'space') return 'Space';
    if (lower === 'backspace') return system === 'macos' ? '⌫ Delete' : 'Backspace';
    if (lower === 'delete') return system === 'macos' ? '⌦ Del' : 'Delete';
    if (lower === 'left') return '←';
    if (lower === 'right') return '→';
    if (lower === 'up') return '↑';
    if (lower === 'down') return '↓';
    
    return val;
  };

  const displayLabel = getDisplayLabel(value);
  const isSpecialKey = ['space', 'ctrl', 'cmd', 'command', 'control', 'alt', 'option', 'shift', 'backspace', 'delete'].includes(value.toLowerCase());

  // Size configurations
  const sizeClasses = {
    sm: {
      text: 'text-[10px]',
      padding: isSpecialKey ? 'px-1.5 py-0.5' : 'w-6 h-6',
      border: 'border-b-2',
      radius: 'rounded',
      press: 'translate-y-[1.5px]',
    },
    md: {
      text: 'text-xs md:text-sm',
      padding: isSpecialKey ? 'px-2.5 py-1' : 'w-9 h-9',
      border: 'border-b-[3px]',
      radius: 'rounded-md',
      press: 'translate-y-[2px]',
    },
    lg: {
      text: 'text-sm md:text-base font-semibold',
      padding: isSpecialKey ? 'px-4 py-2' : 'w-12 h-12',
      border: 'border-b-4',
      radius: 'rounded-lg',
      press: 'translate-y-[3px]',
    },
  };

  // Theme styling
  let bgClasses = '';
  let textClasses = '';
  let borderClasses = '';

  if (isHighlighted) {
    // Elegant warm sunset or neon highlighting depending on theme
    bgClasses = 'bg-gradient-to-b from-amber-400 to-amber-500 shadow-amber-300/30';
    textClasses = 'text-amber-950 font-bold';
    borderClasses = 'border-amber-600';
  } else if (isSpecialKey) {
    // Modifier keys (darker/cooler grey)
    bgClasses = 'bg-gradient-to-b from-zinc-700 to-zinc-800 shadow-black/25';
    textClasses = 'text-zinc-200 font-medium';
    borderClasses = 'border-zinc-900';
  } else {
    // Standard alphanumeric keys (light mechanical theme)
    bgClasses = 'bg-gradient-to-b from-zinc-50 to-zinc-150 shadow-black/10';
    textClasses = 'text-zinc-800 font-bold';
    borderClasses = 'border-zinc-300';
  }

  const currentSize = sizeClasses[size];

  return (
    <button
      type="button"
      id={`keycap-${value.replace(/\s+/g, '-').toLowerCase()}-${size}`}
      onClick={onClick}
      disabled={!onClick}
      className={`
        inline-flex items-center justify-center
        ${currentSize.radius}
        ${currentSize.text}
        ${currentSize.padding}
        ${bgClasses}
        ${textClasses}
        border border-x-zinc-300/30 border-t-zinc-300/20
        ${currentSize.border} ${borderClasses}
        shadow-sm
        transition-all duration-75 select-none
        ${onClick ? 'cursor-pointer hover:brightness-105 active:scale-95' : 'cursor-default'}
        ${isPressed ? `${currentSize.press} border-b-0 mb-[3px]` : ''}
        ${className}
      `}
      style={{
        // Give space a bit more natural horizontal expansion if default w-9 is too small
        width: value.toLowerCase() === 'space' && size !== 'sm' ? (size === 'md' ? '7rem' : '10rem') : undefined,
      }}
    >
      <span className="flex items-center justify-center leading-none">
        {displayLabel}
      </span>
    </button>
  );
}
