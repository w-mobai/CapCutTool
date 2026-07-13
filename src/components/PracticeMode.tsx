/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Shortcut, OS } from '../types';
import Keycap from './Keycap';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Trophy, HelpCircle, ArrowRight } from 'lucide-react';

interface PracticeModeProps {
  shortcuts: Shortcut[];
  system: OS;
  onClose: () => void;
}

export default function PracticeMode({ shortcuts, system, onClose }: PracticeModeProps) {
  // Shuffle list helper
  const getShuffledList = useCallback((list: Shortcut[]) => {
    return [...list].sort(() => Math.random() - 0.5);
  }, []);

  const [pool, setPool] = useState<Shortcut[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [showTip, setShowTip] = useState(false);

  // Initialize pool
  useEffect(() => {
    const validShortcuts = shortcuts.filter(s => s.keys[system] && s.keys[system].length > 0);
    setPool(getShuffledList(validShortcuts));
    setCurrentIndex(0);
    setSelectedKeys([]);
    setFeedback('idle');
  }, [shortcuts, system, getShuffledList]);

  const currentQuestion = pool[currentIndex];
  const targetKeys = currentQuestion ? currentQuestion.keys[system] : [];

  // Reset practice
  const handleReset = () => {
    const validShortcuts = shortcuts.filter(s => s.keys[system] && s.keys[system].length > 0);
    setPool(getShuffledList(validShortcuts));
    setCurrentIndex(0);
    setSelectedKeys([]);
    setFeedback('idle');
    setStreak(0);
    setStats({ correct: 0, total: 0 });
    setShowTip(false);
  };

  // Skip question
  const handleSkip = () => {
    setSelectedKeys([]);
    setFeedback('idle');
    setShowTip(false);
    setStreak(0);
    if (currentIndex < pool.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Re-shuffle and start again
      setPool(getShuffledList(shortcuts.filter(s => s.keys[system] && s.keys[system].length > 0)));
      setCurrentIndex(0);
    }
  };

  // Submit and verify answer
  const verifyAnswer = (keysInput: string[]) => {
    if (!currentQuestion) return;
    
    // Normalize keys for accurate comparison (case-insensitive, order-insensitive for modifiers)
    const normalize = (k: string) => k.toLowerCase().replace('win', 'cmd').replace('command', 'cmd').trim();
    
    const normTarget = targetKeys.map(normalize);
    const normInput = keysInput.map(normalize);

    // Sort to compare combinations
    const isCorrect = 
      normTarget.length === normInput.length && 
      normTarget.every(t => normInput.includes(t));

    if (isCorrect) {
      setFeedback('correct');
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setFeedback('incorrect');
      setStreak(0);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  // Check physical keypresses
  useEffect(() => {
    if (feedback !== 'idle' || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent standard browser shortcuts only if they conflict with our target or game focus
      const activeKeysPressed: string[] = [];
      
      if (e.ctrlKey) activeKeysPressed.push('Ctrl');
      if (e.shiftKey) activeKeysPressed.push('Shift');
      if (e.altKey) activeKeysPressed.push('Alt');
      if (e.metaKey) activeKeysPressed.push('Cmd');

      // Key mapping
      let keyChar = e.key;
      if (keyChar === ' ') keyChar = 'Space';
      if (keyChar === 'ArrowLeft') keyChar = 'Left';
      if (keyChar === 'ArrowRight') keyChar = 'Right';
      if (keyChar === 'ArrowUp') keyChar = 'Up';
      if (keyChar === 'ArrowDown') keyChar = 'Down';

      // Ignore individual modifiers so they don't trigger alpha check immediately
      const isModifierOnly = ['control', 'shift', 'alt', 'meta'].includes(keyChar.toLowerCase());

      if (!isModifierOnly) {
        // Upper-case standard letters for neat matches
        if (keyChar.length === 1) {
          keyChar = keyChar.toUpperCase();
        }
        
        // Combine modifiers and active char
        const completeCombo = [...activeKeysPressed];
        if (!completeCombo.includes(keyChar)) {
          completeCombo.push(keyChar);
        }

        e.preventDefault();
        e.stopPropagation();
        setSelectedKeys(completeCombo);
        verifyAnswer(completeCombo);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [feedback, currentQuestion, targetKeys, system]);

  // Click on-screen elements to construct/test combinations
  const handleOnScreenKeyClick = (key: string) => {
    if (feedback !== 'idle') return;

    setSelectedKeys(prev => {
      let nextKeys = [...prev];
      if (nextKeys.includes(key)) {
        // Toggle key off
        nextKeys = nextKeys.filter(k => k !== key);
      } else {
        // Add key
        nextKeys.push(key);
      }
      return nextKeys;
    });
  };

  const handleOnScreenVerify = () => {
    if (selectedKeys.length === 0) return;
    verifyAnswer(selectedKeys);
  };

  const handleNextQuestion = () => {
    handleSkip();
  };

  // Common on-screen interactive buttons for construction
  const interactiveModifiers = ['Ctrl', 'Shift', 'Alt', 'Cmd'];
  const interactiveAlphabet = ['Space', 'Q', 'W', 'E', 'R', 'T', 'Y', 'B', 'M', 'N', 'Z', 'F', 'G', 'I', 'S', 'Backspace', 'Delete', 'Left', 'Right', 'Up', 'Down'];

  if (pool.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-zinc-900 border border-border rounded-2xl text-center">
        <AlertCircle className="w-12 h-12 text-zinc-500 mb-2" />
        <p className="text-zinc-400">无可练习的快捷键数据。</p>
      </div>
    );
  }

  return (
    <div id="practice-mode-card" className="bg-zinc-900 border border-border rounded-2xl p-5 md:p-8 shadow-xl max-w-3xl mx-auto">
      {/* Header Stats */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80 mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-zinc-100 text-sm md:text-base">剪映快捷键实战练习</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-zinc-800/80 px-2.5 py-1 rounded text-zinc-300">
            进度: <span className="text-amber-400 font-bold">{currentIndex + 1}</span> / {pool.length}
          </div>
          <div className="bg-zinc-800/80 px-2.5 py-1 rounded text-zinc-300">
            正确率: <span className="text-emerald-400 font-bold">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</span> ({stats.correct}/{stats.total})
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            连击: <span className="font-bold">{streak}</span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-zinc-950 border border-border rounded-xl p-6 md:p-8 text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-linear-to-b from-amber-500 to-orange-500"></div>
        
        <span className="text-xs text-amber-500 font-semibold tracking-wider uppercase">请按下或拼写对应的快捷键组合</span>
        <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mt-2">
          如何 {currentQuestion.name}？
        </h2>
        <p className="text-zinc-400 text-xs md:text-sm mt-2 max-w-lg mx-auto">
          功能：{currentQuestion.description}
        </p>

        {/* Current User Input Keys Visualised */}
        <div className="flex justify-center items-center gap-2.5 mt-8 min-h-[44px]">
          {selectedKeys.length === 0 ? (
            <span className="text-xs text-zinc-600 italic">请在下方选择按键，或直接在实体键盘上按下快捷键...</span>
          ) : (
            selectedKeys.map((key, i) => (
              <React.Fragment key={`${key}-${i}`}>
                {i > 0 && <span className="text-zinc-600 text-xs font-bold">+</span>}
                <Keycap value={key} system={system} isHighlighted={true} size="md" />
              </React.Fragment>
            ))
          )}
        </div>

        {/* Feedback Alert */}
        {feedback !== 'idle' && (
          <div className={`mt-6 p-4 rounded-lg flex items-center justify-center gap-2 max-w-md mx-auto animate-fade-in
            ${feedback === 'correct' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }
          `}>
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-bold">回答正确！</p>
                  {streak > 1 && <p className="text-xs text-emerald-400/80">连击中！当前已连续答对 {streak} 题！</p>}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="text-left text-xs md:text-sm">
                  <p className="font-bold">组合不匹配</p>
                  <p className="text-zinc-400 mt-0.5">
                    正确答案是：
                    <span className="inline-flex gap-1 items-center ml-1">
                      {targetKeys.map((tk, idx) => (
                        <span key={idx} className="bg-zinc-800 text-zinc-300 px-1 py-0.2 rounded font-mono text-xs">{tk}</span>
                      ))}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-screen key constructer toolbox */}
      {feedback === 'idle' && (
        <div className="bg-zinc-950/50 border border-border/55 rounded-xl p-4 mb-6">
          <div className="text-xs text-zinc-400 font-semibold mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            手机端或没有键盘？在这里点击拼装你的答案组合：
          </div>

          <div className="flex flex-col gap-3">
            {/* Modifiers */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-zinc-500 min-w-[3.5rem] font-medium">系统键：</span>
              {interactiveModifiers.map((mod) => (
                <button
                  type="button"
                  id={`practice-mod-${mod.toLowerCase()}`}
                  key={mod}
                  onClick={() => handleOnScreenKeyClick(mod)}
                  className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer select-none
                    ${selectedKeys.includes(mod)
                      ? 'bg-amber-400 border-amber-500 text-amber-950 font-bold'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                    }
                  `}
                >
                  {mod === 'Cmd' && system === 'macos' ? '⌘ Cmd' : mod}
                </button>
              ))}
            </div>

            {/* Alphanumeric and other buttons */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-zinc-500 min-w-[3.5rem] font-medium">字母/功能：</span>
              {interactiveAlphabet.map((key) => {
                let display = key;
                if (key === 'Space') display = 'Space (空格)';
                if (key === 'Left') display = '←';
                if (key === 'Right') display = '→';
                if (key === 'Up') display = '↑';
                if (key === 'Down') display = '↓';
                return (
                  <button
                    type="button"
                    id={`practice-key-${key.toLowerCase()}`}
                    key={key}
                    onClick={() => handleOnScreenKeyClick(key)}
                    className={`px-2.5 py-1 text-xs rounded border transition-all cursor-pointer select-none
                      ${selectedKeys.includes(key)
                        ? 'bg-amber-400 border-amber-500 text-amber-950 font-bold'
                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                      }
                    `}
                  >
                    {display}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action trigger for on-screen typing */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800/60">
            <button
              type="button"
              id="clear-input-buffer"
              onClick={() => setSelectedKeys([])}
              className="text-xs text-zinc-500 hover:text-zinc-400 cursor-pointer"
            >
              清空选中的按键
            </button>
            <button
              type="button"
              id="verify-practice-answer"
              onClick={handleOnScreenVerify}
              disabled={selectedKeys.length === 0}
              className={`px-5 py-1.5 text-xs rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${selectedKeys.length > 0
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/10'
                  : 'bg-zinc-800 text-zinc-600 border border-zinc-700/50 cursor-not-allowed'
                }
              `}
            >
              提交核对
            </button>
          </div>
        </div>
      )}

      {/* Tips block */}
      {showTip && currentQuestion.tips && (
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-xs text-amber-400/90 mb-6 flex items-start gap-2.5 animate-fade-in">
          <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold block mb-0.5">技巧小贴士:</span>
            {currentQuestion.tips}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <button
          type="button"
          id="toggle-practice-tip"
          onClick={() => setShowTip(prev => !prev)}
          className="text-xs text-zinc-400 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          {showTip ? '隐藏提示' : '显示提示'}
        </button>

        <div className="flex items-center gap-2">
          {feedback !== 'idle' ? (
            <button
              type="button"
              id="next-practice-question"
              onClick={handleNextQuestion}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 cursor-pointer text-sm"
            >
              下一题
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                id="skip-practice-question"
                onClick={handleSkip}
                className="text-xs text-zinc-400 hover:text-zinc-300 px-4 py-2 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
              >
                跳过这题
              </button>
              <button
                type="button"
                id="reset-practice-session"
                onClick={handleReset}
                className="text-xs text-zinc-400 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重新开始
              </button>
            </>
          )}

          <button
            type="button"
            id="quit-practice-mode"
            onClick={onClose}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-xl transition-all cursor-pointer ml-2"
          >
            退出练习
          </button>
        </div>
      </div>
    </div>
  );
}
