/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { OS, CategoryType, Shortcut } from './types';
import { CATEGORIES, SHORTCUTS_DATA } from './data/shortcuts';
import Keycap from './components/Keycap';
import VirtualKeyboard from './components/VirtualKeyboard';
import ShortcutCard from './components/ShortcutCard';
import PracticeMode from './components/PracticeMode';
import ProTipsView from './components/ProTipsView';
import {
  Search,
  X,
  Monitor,
  Apple,
  Scissors,
  Play,
  Kanban,
  SlidersHorizontal,
  FolderOpen,
  Star,
  Grid,
  List,
  Info,
  Sparkles,
  BookOpen,
  Keyboard,
  Printer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Zap,
  Sun,
  Moon,
} from 'lucide-react';

type Theme = 'light' | 'dark';

export default function App() {
  // --- States ---
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem('jianying_shortcut_theme') === 'light' ? 'light' : 'dark';
  });

  const [system, setSystem] = useState<OS>(() => {
    const saved = localStorage.getItem('jianying_shortcut_os');
    return (saved as OS) || 'windows';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('jianying_shortcut_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKeyFilter, setSelectedKeyFilter] = useState<string | null>(null);
  const [lockedShortcutId, setLockedShortcutId] = useState<string | null>(null);
  const [isKeyboardDocked, setIsKeyboardDocked] = useState(false);
  const [isDockedKeyboardExpanded, setIsDockedKeyboardExpanded] = useState(false);
  const keyboardSentinelRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showPractice, setShowPractice] = useState(false);
  const [showProTips, setShowProTips] = useState(true);
  const [activeTab, setActiveTab] = useState<'shortcuts' | 'tips' | 'practice'>('shortcuts');

  // Sync activeTab with showPractice to maintain compatibility
  useEffect(() => {
    if (showPractice) {
      setActiveTab('practice');
    } else if (activeTab === 'practice') {
      setActiveTab('shortcuts');
    }
  }, [showPractice]);

  useEffect(() => {
    if (activeTab === 'practice') {
      setShowPractice(true);
    } else {
      setShowPractice(false);
    }
  }, [activeTab]);

  // Collapse the keyboard into a compact sticky HUD after it scrolls past the header.
  useEffect(() => {
    const sentinel = keyboardSentinelRef.current;
    if (!sentinel) return;

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    let observer: IntersectionObserver | null = null;

    const syncObserver = () => {
      observer?.disconnect();

      if (!desktopQuery.matches) {
        setIsKeyboardDocked(false);
        setIsDockedKeyboardExpanded(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          const docked = !entry.isIntersecting && entry.boundingClientRect.top < 76;
          setIsKeyboardDocked(docked);
          if (!docked) setIsDockedKeyboardExpanded(false);
        },
        { rootMargin: '-76px 0px 0px 0px', threshold: 0 }
      );
      observer.observe(sentinel);
    };

    syncObserver();
    desktopQuery.addEventListener('change', syncObserver);
    return () => {
      observer?.disconnect();
      desktopQuery.removeEventListener('change', syncObserver);
    };
  }, [activeTab]);

  const handleHighlightKeysFromTip = (keys: string[]) => {
    // Pick the main key to filter
    const mainKey = keys.find((k) => k.length === 1) || keys[0];
    if (mainKey) {
      setSelectedKeyFilter((prev) => (prev === mainKey ? null : mainKey));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleLocateShortcut = (query: string) => {
    setSearchQuery(query);
    setActiveTab('shortcuts'); // Switch back to cheatsheet tab
    setSelectedCategory('all');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // --- Local Storage Sync ---
  useEffect(() => {
    localStorage.setItem('jianying_shortcut_os', system);
  }, [system]);

  useEffect(() => {
    localStorage.setItem('jianying_shortcut_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    localStorage.setItem('jianying_shortcut_theme', theme);
  }, [theme]);

  // --- Category Map for Icons ---
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'editing':
        return <Scissors className="w-4 h-4" />;
      case 'playback':
        return <Play className="w-4 h-4" />;
      case 'timeline':
        return <Kanban className="w-4 h-4" />;
      case 'text-effects':
        return <SlidersHorizontal className="w-4 h-4" />;
      case 'file-global':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <Scissors className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (catId: string) => {
    switch (catId) {
      case 'editing':
        return 'border-chart-3 text-chart-3 bg-chart-3/10';
      case 'playback':
        return 'border-chart-2 text-chart-2 bg-chart-2/10';
      case 'timeline':
        return 'border-chart-5 text-chart-5 bg-chart-5/10';
      case 'text-effects':
        return 'border-chart-4 text-chart-4 bg-chart-4/10';
      case 'file-global':
        return 'border-chart-1 text-chart-1 bg-chart-1/10';
      default:
        return 'border-zinc-500 text-zinc-400 bg-zinc-500/10';
    }
  };

  const getCategorySelectedColor = (catId: string) => {
    switch (catId) {
      case 'editing':
        return 'bg-chart-3/10 border-chart-3 text-zinc-100';
      case 'playback':
        return 'bg-chart-2/10 border-chart-2 text-zinc-100';
      case 'timeline':
        return 'bg-chart-5/10 border-chart-5 text-zinc-100';
      case 'text-effects':
        return 'bg-chart-4/10 border-chart-4 text-zinc-100';
      case 'file-global':
        return 'bg-chart-1/10 border-chart-1 text-zinc-100';
      default:
        return 'bg-zinc-800 border-border text-zinc-100';
    }
  };

  // --- Favorites Toggle ---
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- Keyboard filter clicking handler ---
  const handleKeyClickOnKeyboard = (key: string) => {
    setLockedShortcutId(null);
    setSelectedKeyFilter((prev) => (prev === key ? null : key));
  };

  const handleShortcutLock = (shortcutId: string) => {
    setSelectedKeyFilter(null);
    setLockedShortcutId((prev) => (prev === shortcutId ? null : shortcutId));
  };

  // --- Filter and Search Logic ---
  const filteredShortcuts = useMemo(() => {
    return SHORTCUTS_DATA.filter((shortcut) => {
      // Category check
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(shortcut.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (shortcut.category !== selectedCategory) return false;
      }

      // Keyboard filter check
      if (selectedKeyFilter) {
        const activeKeysForOS = shortcut.keys[system] || [];
        const matchesKey = activeKeysForOS.some(
          (k) =>
            k.toLowerCase() === selectedKeyFilter.toLowerCase() ||
            (selectedKeyFilter.toLowerCase() === 'cmd' &&
              (k.toLowerCase() === 'command' || k.toLowerCase() === 'win')) ||
            (selectedKeyFilter.toLowerCase() === 'option' && k.toLowerCase() === 'alt')
        );
        if (!matchesKey) return false;
      }

      // Search Query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = shortcut.name.toLowerCase().includes(query);
        const matchesDesc = shortcut.description.toLowerCase().includes(query);
        const matchesKeys = (shortcut.keys[system] || []).some((k) =>
          k.toLowerCase().includes(query)
        );
        return matchesName || matchesDesc || matchesKeys;
      }

      return true;
    });
  }, [selectedCategory, selectedKeyFilter, searchQuery, system, favorites]);

  const lockedShortcut = lockedShortcutId
    ? SHORTCUTS_DATA.find((shortcut) => shortcut.id === lockedShortcutId)
    : null;
  const displayedKeys = selectedKeyFilter
    ? [selectedKeyFilter]
    : lockedShortcut?.keys[system] || [];

  // Count shortcuts in each category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: SHORTCUTS_DATA.length,
      favorites: favorites.length,
    };
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = SHORTCUTS_DATA.filter((s) => s.category === cat.id).length;
    });
    return counts;
  }, [favorites]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased scrollbar-thin">
      {/* Top Brand Nav Bar */}
      <header className="border-b border-border bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3.5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 via-orange-500 to-rose-600 p-[1.5px] shadow-lg shadow-amber-500/10 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-zinc-950 flex items-center justify-center font-bold text-lg text-zinc-100">
              剪
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-50 to-zinc-200 bg-clip-text text-transparent">
                剪映快捷键助手
              </h1>
              <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold px-1.5 py-0.2 rounded">
                CapCut
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">
              极简、高效、沉浸式影视剪辑快捷键指南
            </p>
          </div>
        </div>

        {/* System & Mode Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* OS Switcher */}
          <div className="flex rounded-xl p-0.5 bg-zinc-900 border border-border">
            <button
              id="switch-windows"
              type="button"
              onClick={() => {
                setSystem('windows');
                setSelectedKeyFilter(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide cursor-pointer transition-all
                ${
                  system === 'windows'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              <Monitor className="w-3.5 h-3.5" />
              Windows
            </button>
            <button
              id="switch-macos"
              type="button"
              onClick={() => {
                setSystem('macos');
                setSelectedKeyFilter(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide cursor-pointer transition-all
                ${
                  system === 'macos'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }
              `}
            >
              <Apple className="w-3.5 h-3.5" />
              macOS
            </button>
          </div>

          {/* Tab Segmented Switcher */}
          <div className="flex rounded-xl p-0.5 bg-zinc-900 border border-border">
            <button
              id="tab-btn-shortcuts"
              type="button"
              onClick={() => setActiveTab('shortcuts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary
                ${
                  activeTab === 'shortcuts'
                    ? 'bg-zinc-800 text-amber-400 border-transparent shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 border-transparent'
                }
              `}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>快捷键对照</span>
            </button>
            <button
              id="tab-btn-tips"
              type="button"
              onClick={() => setActiveTab('tips')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary
                ${
                  activeTab === 'tips'
                    ? 'bg-zinc-800 text-amber-400 border-transparent shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 border-transparent'
                }
              `}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>剪辑避坑秘籍</span>
            </button>
            <button
              id="tab-btn-practice"
              type="button"
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer transition-all border focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary
                ${
                  activeTab === 'practice'
                    ? 'bg-zinc-800 text-amber-400 border-transparent shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 border-transparent'
                }
              `}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>实战练习场</span>
            </button>
          </div>

          <button
            id="switch-theme"
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label={`切换到${theme === 'dark' ? '浅色' : '深色'}主题`}
            title={`切换到${theme === 'dark' ? '浅色' : '深色'}主题`}
            className="group flex items-center gap-2 rounded-xl border border-border bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-400 shadow-sm transition-all hover:border-amber-500 hover:text-amber-400"
          >
            <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-amber-400">
              {theme === 'dark' ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
            </span>
            <span>{theme === 'dark' ? '深色' : '浅色'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {activeTab === 'practice' ? (
          /* Practice Module Mode */
          <div className="animate-fade-in">
            <div className="mb-6 max-w-3xl mx-auto flex items-center justify-between">
              <button
                id="btn-back-to-study"
                type="button"
                onClick={() => setActiveTab('shortcuts')}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                ← 返回对照表学习
              </button>
              <span className="text-xs text-zinc-500 font-mono">
                当前系统配对：{system === 'windows' ? 'Windows' : 'macOS'}
              </span>
            </div>
            <PracticeMode
              shortcuts={SHORTCUTS_DATA}
              system={system}
              onClose={() => setActiveTab('shortcuts')}
            />
          </div>
        ) : activeTab === 'tips' ? (
          /* Pro Advanced Tips Mode */
          <div className="animate-fade-in">
            <ProTipsView
              system={system}
              onHighlightKeys={handleHighlightKeysFromTip}
              onLocateShortcut={handleLocateShortcut}
            />
          </div>
        ) : (
          /* Classical Cheat Sheet List Mode */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-fade-in">
            {/* Left/Top Sidebar: Search, Categories, Pro Tips */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Search Card */}
              <div className="bg-zinc-900 border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-zinc-200 text-sm mb-3.5 flex items-center gap-2">
                  <Search className="w-4 h-4 text-zinc-400" />
                  智能搜索过滤
                </h3>
                
                {/* Search input bar */}
                <div className="relative">
                  <input
                    id="search-shortcuts"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入功能、描述或按键 (如 Ctrl)"
                    className="w-full bg-zinc-950 border border-border hover:border-amber-500/60 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 text-zinc-100 text-xs px-3.5 py-2.5 rounded-xl transition-all outline-hidden pr-8 font-medium"
                  />
                  {searchQuery ? (
                    <button
                      id="clear-search"
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <Search className="absolute right-3 top-3 w-3.5 h-3.5 text-zinc-600" />
                  )}
                </div>

                <p className="text-[10px] text-zinc-500 mt-2.5 leading-relaxed">
                  支持模糊匹配功能名称和快捷按键，实时动态刷选下方列表。
                </p>
              </div>

              {/* Category selector */}
              <div className="bg-zinc-900 border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-zinc-200 text-sm mb-3.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-400" />
                  按功能类别筛选
                </h3>

                <div className="flex flex-col gap-2">
                  {/* Category ALL */}
                  <button
                    id="cat-tab-all"
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedKeyFilter(null);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border
                      ${
                        selectedCategory === 'all'
                          ? 'bg-zinc-800 border-zinc-700 text-amber-400'
                          : 'bg-zinc-950/40 border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px]">
                        ★
                      </div>
                      <span>全部快捷键</span>
                    </div>
                    <span className="text-[10px] bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded-md text-zinc-500 group-hover:text-zinc-300 font-mono">
                      {categoryCounts.all}
                    </span>
                  </button>

                  {/* Category Favorites */}
                  <button
                    id="cat-tab-favorites"
                    type="button"
                    onClick={() => {
                      setSelectedCategory('favorites');
                      setSelectedKeyFilter(null);
                    }}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border
                      ${
                        selectedCategory === 'favorites'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-zinc-950/40 border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Star className={`w-4 h-4 ${favorites.length > 0 ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'}`} />
                      <span>我的常用收藏</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono border
                      ${favorites.length > 0 
                        ? 'bg-amber-500/25 border-amber-500/30 text-amber-300 font-bold' 
                        : 'bg-zinc-900 border-zinc-850 text-zinc-500'
                      }
                    `}>
                      {categoryCounts.favorites}
                    </span>
                  </button>

                  <div className="border-t border-zinc-800/60 my-1"></div>

                  {/* Dynamic Categorized list */}
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        id={`cat-tab-${cat.id}`}
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedKeyFilter(null);
                        }}
                        className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border
                          ${
                            isSelected
                              ? getCategorySelectedColor(cat.id)
                              : 'bg-zinc-950/40 border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs border ${getCategoryColor(cat.id)}`}>
                            {getCategoryIcon(cat.id)}
                          </div>
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-[10px] bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded-md text-zinc-500 font-mono">
                          {categoryCounts[cat.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pro Editing Workflows & Tips */}
              <div className="bg-zinc-900 border border-border rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    剪映高手进阶工作流
                  </h3>
                  <button
                    id="toggle-pro-tips"
                    type="button"
                    onClick={() => setShowProTips(!showProTips)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showProTips ? '隐藏' : '展开'}
                  </button>
                </div>

                {showProTips && (
                  <div className="flex flex-col gap-3.5 text-xs animate-fade-in">
                    <div className="bg-zinc-950/40 border border-border/50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Q/W 高效粗剪法</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        在时间轴播放视频时，左手手指常驻在 <kbd className="bg-zinc-800 text-zinc-200 px-1 py-0.2 rounded font-mono text-[10px]">Q</kbd> 和 <kbd className="bg-zinc-800 text-zinc-200 px-1 py-0.2 rounded font-mono text-[10px]">W</kbd> 键上。听到废话或空隙，无需鼠标拖拽或按分割，直接按 Q 剪掉左侧多余、按 W 剪掉右侧多余，粗剪速度翻倍！
                      </p>
                    </div>

                    <div className="bg-zinc-950/40 border border-border/50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                        <span>听歌卡点技巧</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        选中音频轨道，按下空格播放。右手随节奏敲击 <kbd className="bg-zinc-800 text-zinc-200 px-1 py-0.2 rounded font-mono text-[10px]">M</kbd> 键添加蓝色标记点。随后放大时间线，将视频剪切点直接吸附到蓝色标记处，即可完美踩上BGM强鼓点！
                      </p>
                    </div>

                    <div className="bg-zinc-950/40 border border-border/50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                        <span>一键缩放重置</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">
                        当时间轴被拉得太长或者找不到素材时，立刻按下 <kbd className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded font-mono text-[10px]">Shift + Z</kbd>，时间轴会瞬间适应当前屏幕，重置视图，极力推荐养成肌肉记忆。
                      </p>
                    </div>

                    {/* View more guide call to action */}
                    <button
                      id="view-all-tips-btn"
                      type="button"
                      onClick={() => setActiveTab('tips')}
                      className="w-full mt-1.5 py-2.5 px-3 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>查看子牧老师 10+ 节避坑秘籍 →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right/Bottom Content Area: Keyboard and Shortcut Lists */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Interactive Virtual Keyboard / compact sticky HUD */}
              <div className="w-full lg:contents">
                <div
                  ref={keyboardSentinelRef}
                  className="hidden h-px lg:block lg:-mb-6"
                  aria-hidden="true"
                />
                <div className="lg:sticky lg:top-[76px] lg:z-40">
                  {isKeyboardDocked && !isDockedKeyboardExpanded ? (
                    <div className="hidden lg:flex min-h-16 items-center gap-4 rounded-2xl border border-white/20 bg-white/[0.12] px-4 py-3 shadow-2xl shadow-black/45 backdrop-blur-xl animate-fade-in">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                          <Keyboard className="h-4 w-4 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                            {selectedKeyFilter || lockedShortcutId ? '已锁定快捷键' : '当前快捷键'}
                          </div>
                          <div className="flex min-h-6 items-center gap-1.5 overflow-x-auto scrollbar-thin">
                            {displayedKeys.length > 0 ? (
                              displayedKeys.map((key, index) => (
                                <React.Fragment key={`${key}-${index}`}>
                                  {index > 0 && <span className="text-xs font-bold text-zinc-600">+</span>}
                                  <Keycap value={key} system={system} size="sm" />
                                </React.Fragment>
                              ))
                            ) : (
                              <span className="truncate text-xs text-zinc-400">
                                单击下方快捷键卡片，即可锁定并在这里显示
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        id="expand-sticky-keyboard"
                        type="button"
                        onClick={() => setIsDockedKeyboardExpanded(true)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-amber-400"
                        aria-label="展开完整键盘"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                        展开键盘
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <VirtualKeyboard
                        system={system}
                        isDocked={isKeyboardDocked}
                        activeKeys={displayedKeys}
                        selectedKeyFilter={selectedKeyFilter}
                        onKeyClick={handleKeyClickOnKeyboard}
                      />
                      {isKeyboardDocked && (
                        <button
                          id="collapse-sticky-keyboard"
                          type="button"
                          onClick={() => setIsDockedKeyboardExpanded(false)}
                          className="absolute right-4 bottom-3 hidden lg:flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] font-semibold text-zinc-400 transition-colors hover:text-amber-400"
                          aria-label="收起完整键盘"
                        >
                          <ChevronUp className="h-3 w-3" />
                          收起键盘
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* View Control & Shortcut Lists Header */}
              <div className="bg-zinc-900 border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold text-zinc-200">
                    {selectedCategory === 'favorites' ? '我的收藏库' : '快捷键对照清单'}
                  </div>
                  <div className="text-xs text-zinc-500 font-medium">
                    (共找到 {filteredShortcuts.length} 个项目)
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* View mode toggle */}
                  <div className="flex rounded-lg p-0.5 bg-zinc-950 border border-zinc-800">
                    <button
                      id="view-grid"
                      type="button"
                      onClick={() => setViewMode('grid')}
                      title="网格卡片视图"
                      className={`p-1.5 rounded-md cursor-pointer transition-all
                        ${viewMode === 'grid' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}
                      `}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      id="view-table"
                      type="button"
                      onClick={() => setViewMode('table')}
                      title="列表表格视图"
                      className={`p-1.5 rounded-md cursor-pointer transition-all
                        ${viewMode === 'table' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}
                      `}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Print and Save */}
                  <button
                    id="btn-print-cheatsheet"
                    type="button"
                    onClick={handlePrint}
                    className="p-1.5 px-3 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-900 text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    打印 / 保存PDF
                  </button>
                </div>
              </div>

              {/* Shortcuts Results List container */}
              {filteredShortcuts.length === 0 ? (
                /* Empty State */
                <div className="bg-zinc-900 border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-4 text-xl">
                    ？
                  </div>
                  <h4 className="font-bold text-zinc-300 text-sm">未找到匹配的快捷键</h4>
                  <p className="text-zinc-500 text-xs mt-1.5 max-w-sm">
                    {selectedKeyFilter
                      ? `当前分类中，没有包含按键 “${selectedKeyFilter}” 的快捷键。`
                      : '请更换搜索关键词，或者在左侧侧边栏切换到其他功能类别。'}
                  </p>
                  {(searchQuery || selectedKeyFilter || selectedCategory !== 'all') && (
                    <button
                      id="reset-all-filters"
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedKeyFilter(null);
                        setSelectedCategory('all');
                      }}
                      className="mt-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl text-xs text-amber-400 font-bold transition-all cursor-pointer"
                    >
                      重置所有过滤条件
                    </button>
                  )}
                </div>
              ) : viewMode === 'grid' ? (
                /* Card Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredShortcuts.map((shortcut) => (
                    <ShortcutCard
                      key={shortcut.id}
                      shortcut={shortcut}
                      system={system}
                      isFavorite={favorites.includes(shortcut.id)}
                      isLocked={lockedShortcutId === shortcut.id}
                      onToggleFavorite={handleToggleFavorite}
                      onLock={handleShortcutLock}
                    />
                  ))}
                </div>
              ) : (
                /* Compact Table View */
                <div className="bg-zinc-900 border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-950/60 border-b border-zinc-800 text-zinc-400 text-xs font-semibold">
                          <th className="py-3 px-4 w-12 text-center">收藏</th>
                          <th className="py-3 px-4">功能名称</th>
                          <th className="py-3 px-4">按键组合</th>
                          <th className="py-3 px-4 hidden md:table-cell">功能用途描述</th>
                          <th className="py-3 px-4 w-16 text-center">类别</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {filteredShortcuts.map((shortcut) => {
                          const keys = shortcut.keys[system] || [];
                          const isFav = favorites.includes(shortcut.id);
                          return (
                            <tr
                              key={shortcut.id}
                              onClick={() => handleShortcutLock(shortcut.id)}
                              className={`transition-colors group text-xs text-zinc-300 cursor-pointer ${
                                lockedShortcutId === shortcut.id
                                  ? 'bg-amber-500/10 outline-1 -outline-offset-1 outline-amber-500/30'
                                  : 'hover:bg-zinc-800/45'
                              }`}
                            >
                              {/* Star column */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  id={`table-fav-${shortcut.id}`}
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleToggleFavorite(shortcut.id);
                                  }}
                                  className="text-zinc-600 hover:text-amber-400 cursor-pointer"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 mx-auto ${
                                      isFav ? 'fill-amber-400 text-amber-400' : 'text-zinc-600 group-hover:text-zinc-400'
                                    }`}
                                  />
                                </button>
                              </td>
                              
                              {/* Name column */}
                              <td className="py-3 px-4 font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                                {shortcut.name}
                              </td>

                              {/* Keys combination column */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  {keys.map((k, idx) => (
                                    <React.Fragment key={idx}>
                                      {idx > 0 && <span className="text-zinc-600 text-[10px] font-bold">+</span>}
                                      <span className="bg-zinc-850 border border-zinc-750 text-zinc-200 px-1.5 py-0.5 rounded font-mono text-[10px]">
                                        {k === 'Cmd' && system === 'macos' ? '⌘' : k}
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </td>

                              {/* Description column */}
                              <td className="py-3 px-4 text-zinc-400 hidden md:table-cell max-w-sm truncate" title={shortcut.description}>
                                {shortcut.description}
                              </td>

                              {/* Category column badge */}
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] border ${getCategoryColor(shortcut.category)}`}>
                                  {CATEGORIES.find((c) => c.id === shortcut.category)?.name.slice(0, 2) || '其他'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer info brand */}
      <footer className="border-t border-border mt-16 bg-zinc-950 py-8 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <div className="font-semibold text-zinc-500">剪映（CapCut）常用快捷键快速查找工具</div>
            <p className="mt-1 text-zinc-600">
              专为零基础剪辑师、自媒体创作者、专业剪辑师打造。多设备适配，即用即查。
            </p>
          </div>
          <div className="flex gap-4 text-zinc-500">
            <span>支持：Windows 剪映专业版 & macOS 剪映专业版</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
