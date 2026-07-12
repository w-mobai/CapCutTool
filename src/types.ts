/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OS = 'windows' | 'macos';

export type CategoryType = 
  | 'timeline'    // 时间线与轨道
  | 'playback'    // 播放与导航
  | 'editing'     // 剪辑与编辑
  | 'text-effects'// 文本、字幕与效果
  | 'file-global' // 文件与全局
  | 'favorites';  // 个人收藏

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class for borders/accents
}

export interface Shortcut {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  // Keyboard keys for each operating system
  keys: {
    windows: string[];
    macos: string[];
  };
  // Detailed instructions on how to use it
  tips?: string;
}

export interface KeyInfo {
  code: string;       // Standard keyboard code, e.g. "KeyB", "Space", "ControlLeft"
  label: string;      // What's printed on the key, e.g. "B", "Space", "Ctrl"
  macLabel?: string;  // Mac specific printed label, e.g. "⌘ Cmd"
  width?: string;     // Tailwind width class, e.g. "w-14"
}

export interface PracticeQuestion {
  shortcut: Shortcut;
  currentSystem: OS;
}
