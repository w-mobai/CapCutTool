import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  CheckCircle2,
  Layers,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Search,
  ShieldAlert,
  Target,
  User,
  X,
} from 'lucide-react';
import {
  POSITIONING_CATEGORIES,
  POSITIONING_FIELDS,
  POSITIONING_PROMPT,
  POSITIONING_TIPS,
  PROFILE_FIELDS,
  TEACHER_EXAMPLE,
} from '../data/aiMedia';

const STORAGE_KEY = 'jianying_ai_media_positioning_card';

const EMPTY_FORM = [...POSITIONING_FIELDS, ...PROFILE_FIELDS].reduce<Record<string, string>>(
  (result, field) => ({ ...result, [field.id]: '' }),
  {}
);

const COURSE_NAV_ITEMS = [
  {
    id: 'content',
    label: '课程内容',
    description: '课程概览 · 知识总结',
    icon: BookOpen,
  },
  {
    id: 'resources',
    label: '配套资源',
    description: 'AI 工具 · 实用模板 · 课程案例',
    icon: Layers,
  },
] as const;

export default function AiMediaView() {
  const [selectedCourse, setSelectedCourse] = useState<'positioning' | null>(null);
  const [activeCourseGroup, setActiveCourseGroup] = useState<'content' | 'resources'>('content');
  const [copied, setCopied] = useState<'prompt' | 'card' | null>(null);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [knowledgeCategory, setKnowledgeCategory] = useState('all');
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [form, setForm] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...EMPTY_FORM, ...JSON.parse(saved) } : EMPTY_FORM;
    } catch {
      return EMPTY_FORM;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const completedFields = useMemo(
    () => Object.keys(form).filter((key) => form[key].trim()).length,
    [form]
  );

  const filteredKnowledge = useMemo(() => {
    const query = knowledgeSearch.trim().toLowerCase();
    return POSITIONING_TIPS.filter((tip) => {
      if (knowledgeCategory !== 'all' && tip.category !== knowledgeCategory) return false;
      if (!query) return true;
      return [
        tip.title,
        tip.tag,
        tip.slogan,
        tip.painPoint,
        tip.principle,
        tip.example || '',
        ...tip.steps,
        ...tip.selfCheck,
      ].some((text) => text.toLowerCase().includes(query));
    });
  }, [knowledgeCategory, knowledgeSearch]);

  const copyText = async (text: string, type: 'prompt' | 'card') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  };

  const copyCard = () => {
    const positioning = POSITIONING_FIELDS.map(
      (field) => `【${field.label}】\n${form[field.id] || '未填写'}`
    ).join('\n\n');
    const profile = PROFILE_FIELDS.map(
      (field) => `【${field.label}】\n${form[field.id] || '未填写'}`
    ).join('\n\n');
    copyText(`我的定位卡\n\n${positioning}\n\n主页包装\n\n${profile}`, 'card');
  };

  const updateField = (id: string, value: string) => {
    setForm((current) => ({ ...current, [id]: value }));
  };

  const resetForm = () => {
    if (window.confirm('确定清空已经填写的定位卡吗？')) setForm(EMPTY_FORM);
  };

  const showCourseGroup = (group: 'content' | 'resources', targetId = 'course-group-content') => {
    setActiveCourseGroup(group);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  if (!selectedCourse) {
    return <CourseCatalog onOpenPositioning={() => setSelectedCourse('positioning')} />;
  }

  return (
    <div className="ai-media-shell flex flex-col gap-7 animate-fade-in">
      <div className="flex items-center gap-2 px-1 text-xs font-bold text-zinc-500">
        <button
          type="button"
          onClick={() => {
            setSelectedCourse(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 transition-colors hover:text-amber-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          课程目录
        </button>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300">自媒体账号定位</span>
      </div>

      <nav className="sticky top-[244px] z-30 mx-auto flex w-fit max-w-full gap-2 rounded-2xl border border-border bg-zinc-900/95 p-2 shadow-lg backdrop-blur-xl sm:top-[76px]">
        {COURSE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeCourseGroup === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => showCourseGroup(item.id)}
              aria-pressed={isActive}
              className={`group flex w-[150px] min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all sm:w-[260px] sm:px-4 ${
                isActive
                  ? 'border-primary/35 bg-primary/10'
                  : 'border-border/70 bg-zinc-950/45 hover:border-primary/30 hover:bg-primary/10'
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-zinc-900 transition-colors ${isActive ? 'border-primary/35 text-amber-400' : 'border-border text-zinc-500 group-hover:text-amber-400'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 text-left">
                <span className={`block text-xs font-extrabold group-hover:text-amber-400 ${isActive ? 'text-amber-400' : 'text-zinc-200'}`}>{item.label}</span>
                <span className="mt-0.5 hidden truncate text-[10px] font-medium text-zinc-600 sm:block">{item.description}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div id="course-group-content" className="flex scroll-mt-[340px] flex-col gap-7 sm:scroll-mt-36">
        {activeCourseGroup === 'content' ? (
          <>
      <section id="positioning-method" className="scroll-mt-[340px] sm:scroll-mt-36">
        <SectionHeading
          eyebrow="METHOD / 账号定位"
          title="定位不是想出来的，是一步步猜出来的"
          description="先从观众获得什么出发，再用自己的能力、兴趣和市场需求缩小范围。"
        />

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-zinc-900 p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-zinc-100">
              <Target className="h-4 w-4 text-amber-400" />
              四种获得感
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['学到', '技能与方法'],
                ['爽到', '情绪与共鸣'],
                ['知道', '信息与见闻'],
                ['想晒', '身份与成果'],
              ].map(([name, detail]) => (
                <div key={name} className="rounded-xl bg-zinc-950/65 p-3">
                  <div className="text-sm font-black text-zinc-200">{name}</div>
                  <div className="mt-0.5 text-[10px] font-semibold text-zinc-500">{detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-zinc-900 p-6">
            <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-zinc-100">
              <Layers className="h-4 w-4 text-amber-400" />
              定位铁三角
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-black">
              <span className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-amber-400">我能做</span>
              <span className="text-zinc-600">×</span>
              <span className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-amber-400">我爱做</span>
              <span className="text-zinc-600">×</span>
              <span className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-amber-400">有人需要</span>
            </div>
            <p className="mt-4 text-xs font-medium leading-6 text-zinc-500">
              三项不必一开始全部满分。方向够用就先开始，持续发布带来的正反馈，会让能力和兴趣一起增长。
            </p>
          </div>
        </div>
      </section>

      <section id="positioning-library" className="scroll-mt-[340px] sm:scroll-mt-36">
        <div className="rounded-[28px] border border-border bg-zinc-900 p-5 md:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="KNOWLEDGE BASE / 定位知识库"
              title="从一句结论，拆到真正能执行"
              description="把逐字稿里的核心方法整理成知识卡：先看痛点和口诀，再照步骤行动，最后用案例与自检确认自己是否真的掌握。"
            />
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-extrabold text-amber-400">
              <BookOpen className="h-4 w-4" />
              {POSITIONING_TIPS.length} 个知识点
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-zinc-950/45 p-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full gap-1.5 overflow-x-auto pb-1 scrollbar-thin lg:pb-0">
              {POSITIONING_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setKnowledgeCategory(category.id)}
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                    knowledgeCategory === category.id
                      ? 'border-primary/30 bg-primary/10 text-amber-400'
                      : 'border-transparent text-zinc-500 hover:border-border hover:bg-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <div className="relative w-full shrink-0 lg:w-72">
              <input
                type="text"
                value={knowledgeSearch}
                onChange={(event) => setKnowledgeSearch(event.target.value)}
                placeholder="搜索人设、赛道、包装……"
                aria-label="搜索定位知识点"
                className="w-full rounded-xl border border-border bg-zinc-900 px-3.5 py-2.5 pr-9 text-xs font-medium text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-primary"
              />
              {knowledgeSearch ? (
                <button
                  type="button"
                  onClick={() => setKnowledgeSearch('')}
                  aria-label="清空知识点搜索"
                  className="absolute right-2.5 top-2.5 text-zinc-600 hover:text-zinc-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-zinc-600" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between px-1">
          <div className="text-xs font-bold text-zinc-500">
            当前显示 <span className="font-mono text-amber-400">{filteredKnowledge.length}</span> 个知识点
          </div>
          {(knowledgeCategory !== 'all' || knowledgeSearch) && (
            <button
              type="button"
              onClick={() => {
                setKnowledgeCategory('all');
                setKnowledgeSearch('');
              }}
              className="text-[11px] font-bold text-zinc-500 hover:text-amber-400"
            >
              重置筛选
            </button>
          )}
        </div>

        {filteredKnowledge.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border bg-zinc-900 p-12 text-center">
            <Search className="mx-auto h-8 w-8 text-zinc-600" />
            <h3 className="mt-3 text-sm font-extrabold text-zinc-300">没有找到相关知识点</h3>
            <p className="mt-1 text-xs text-zinc-500">换一个关键词，或者清除当前分类后再试。</p>
          </div>
        ) : (
          <div className="mt-4 grid items-start gap-5 lg:grid-cols-2">
            {filteredKnowledge.map((tip, index) => {
              const category = POSITIONING_CATEGORIES.find((item) => item.id === tip.category);
              const toolTarget = tip.relatedTool === 'AI 定位陪练' ? 'positioning-prompt' : 'positioning-card';
              return (
                <article key={tip.id} className="knowledge-card overflow-hidden rounded-[24px] border border-border bg-zinc-900">
                  <div className="border-b border-border/70 p-5 md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold text-amber-400">
                          {tip.tag}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-600">{category?.name}</span>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-zinc-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-lg font-black leading-snug tracking-[-0.015em] text-zinc-100">{tip.title}</h3>
                    <div className="mt-4 border-l-2 border-primary bg-primary/5 px-3.5 py-2.5">
                      <div className="flex items-start gap-2 text-xs font-extrabold leading-5 text-amber-400">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        林纸巾口诀：{tip.slogan}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5 md:p-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-extrabold text-zinc-400">
                        <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                        常见问题
                      </div>
                      <p className="pl-5 text-xs font-medium leading-6 text-zinc-500">{tip.painPoint}</p>
                    </div>

                    <div>
                      <div className="mb-2.5 flex items-center gap-2 text-[11px] font-extrabold text-zinc-400">
                        <ListChecks className="h-3.5 w-3.5 text-sky-500" />
                        执行步骤
                      </div>
                      <ol className="space-y-2.5 pl-5">
                        {tip.steps.map((step, stepIndex) => (
                          <li key={step} className="flex gap-2.5 text-xs font-medium leading-5 text-zinc-300">
                            <span className="mt-0.5 font-mono text-[10px] font-bold text-amber-400">{String(stepIndex + 1).padStart(2, '0')}</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-zinc-950/50 p-4">
                      <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">为什么这样做</div>
                      <p className="text-[11px] font-medium leading-5 text-zinc-400">{tip.principle}</p>
                    </div>

                    {tip.example && (
                      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                        <div className="mb-1.5 text-[10px] font-extrabold text-amber-400">课程案例</div>
                        <p className="text-[11px] font-medium leading-5 text-zinc-400">{tip.example}</p>
                      </div>
                    )}

                    <div>
                      <div className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">完成前自检</div>
                      <div className="flex flex-col gap-2">
                        {tip.selfCheck.map((question) => (
                          <div key={question} className="flex items-start gap-2 text-[11px] font-medium leading-5 text-zinc-400">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            {question}
                          </div>
                        ))}
                      </div>
                    </div>

                    {tip.relatedTool && (
                      <button
                        type="button"
                        onClick={() => showCourseGroup('resources', toolTarget)}
                        className="flex items-center justify-between rounded-xl border border-border bg-zinc-950/45 px-4 py-3 text-xs font-bold text-zinc-400 transition-all hover:border-primary/30 hover:text-amber-400"
                      >
                        <span>用「{tip.relatedTool}」立即实践</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

          </>
        ) : (
          <>

      <section id="positioning-prompt" className="scroll-mt-[340px] rounded-[28px] border border-border bg-zinc-900 p-5 sm:scroll-mt-36 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="PROMPT / AI 定位陪练"
            title="让 AI 陪你聊透，而不是替你硬编"
            description="五步完成摸底、缩小方向、人设设计、对标拆解与主页包装。请在同一个对话里连续使用。"
          />
          <button
            type="button"
            onClick={() => copyText(POSITIONING_PROMPT, 'prompt')}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-extrabold text-primary-foreground shadow-lg shadow-primary/15 transition-transform hover:-translate-y-0.5"
          >
            {copied === 'prompt' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied === 'prompt' ? '已复制完整提示词' : '复制完整提示词'}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {['摸底体检', '窄到切口', '设计人设', '拆解对标', '收敛全家福'].map((step, index) => (
            <div key={step} className="rounded-xl border border-border/70 bg-zinc-950/55 p-4">
              <div className="font-mono text-[10px] font-bold text-amber-400">STEP 0{index + 1}</div>
              <div className="mt-2 text-xs font-extrabold text-zinc-200">{step}</div>
            </div>
          ))}
        </div>

        <div className="prompt-window mt-5 overflow-hidden rounded-2xl border border-border bg-zinc-950">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono text-[10px] text-zinc-600">positioning-coach.txt</span>
          </div>
          <pre className={`whitespace-pre-wrap px-5 py-5 font-sans text-xs font-medium leading-6 text-zinc-400 ${showFullPrompt ? '' : 'max-h-64 overflow-hidden'}`}>
            {POSITIONING_PROMPT}
          </pre>
          {!showFullPrompt && <div className="prompt-fade pointer-events-none" />}
          <button
            type="button"
            onClick={() => setShowFullPrompt((current) => !current)}
            className="relative z-10 flex w-full items-center justify-center border-t border-border bg-zinc-900 px-4 py-3 text-xs font-bold text-zinc-400 hover:text-amber-400"
          >
            {showFullPrompt ? '收起提示词' : '展开查看完整提示词'}
          </button>
        </div>
      </section>

      <section id="positioning-card" className="scroll-mt-[340px] sm:scroll-mt-36">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="WORKSHEET / 定位卡模板"
            title="把聊出来的结果，落进一张可执行的卡"
            description="先填一句话定位和主页包装就能开始；想继续深挖，再补齐观众、内容与变现。内容会自动保存在当前浏览器。"
          />
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-zinc-900 px-3 py-2 font-mono text-[10px] text-zinc-500">
              {completedFields}/{Object.keys(EMPTY_FORM).length} 已填写
            </span>
            <button type="button" onClick={resetForm} className="rounded-xl border border-border bg-zinc-900 p-2.5 text-zinc-500 hover:text-zinc-200" title="清空定位卡">
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={copyCard} className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2.5 text-xs font-bold text-amber-400 hover:bg-primary/15">
              {copied === 'card' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === 'card' ? '已复制' : '复制定位卡'}
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-border bg-zinc-900">
          <div className="flex items-center gap-3 border-b border-border bg-zinc-950/60 px-5 py-4">
            <ListChecks className="h-4 w-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-extrabold text-zinc-100">定位卡使用说明</h3>
              <p className="mt-0.5 text-[10px] font-medium text-zinc-500">先完成底线版本，再用真实内容迭代</p>
            </div>
          </div>

          <div className="grid gap-px bg-border/60 md:grid-cols-5">
            {[
              ['01', '跑完 AI 陪练', '先在“AI 定位陪练”中完成整场对话。'],
              ['02', '填写定位卡', '把对话里聊出来的结果填进下方表格。'],
              ['03', '补齐空白项', '哪一格还空着，就回到同一场对话让 AI 接着聊。'],
              ['04', '做电梯测试', '说给朋友听，看他能否一句话复述“你是干嘛的”。'],
              ['05', '提交结果', '把填好的定位卡连同主页截图一起交群。'],
            ].map(([number, title, description]) => (
              <div key={number} className="bg-zinc-900 p-4 md:p-5">
                <div className="font-mono text-[10px] font-bold text-amber-400">STEP {number}</div>
                <div className="mt-2 text-xs font-extrabold text-zinc-200">{title}</div>
                <p className="mt-2 text-[11px] font-medium leading-5 text-zinc-500">{description}</p>
              </div>
            ))}
          </div>

          <div className="grid border-t border-border md:grid-cols-2">
            <div className="p-5 md:border-r md:border-border">
              <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-200">
                <Target className="h-3.5 w-3.5 text-emerald-400" />
                完成心态
              </div>
              <p className="mt-2 text-xs font-medium leading-6 text-zinc-400">
                <strong className="text-emerald-400">不要求完美，要完成。</strong>
                先定一个够用的版本，发布 10 条再迭代；做到 20 条仍然不行，换方向也不丢人。
              </p>
            </div>
            <div className="border-t border-border p-5 md:border-t-0">
              <div className="flex items-center gap-2 text-xs font-extrabold text-zinc-200">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                两档完成标准
              </div>
              <p className="mt-2 text-xs font-medium leading-6 text-zinc-400">
                <strong className="text-amber-400">底线：</strong>完成“一句话定位”和“主页包装”。
                <strong className="ml-2 text-amber-400">进阶：</strong>填满整张卡。下节课会把定位卡交给 AI 量产选题，填得越全越省事。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-border bg-zinc-900">
          <div className="grid grid-cols-[0.75fr_1.35fr] border-b border-border bg-zinc-950/60 px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 md:grid-cols-[0.65fr_1.35fr_1fr]">
            <span>字段</span><span>你的答案</span><span className="hidden md:block">自检问题</span>
          </div>
          {POSITIONING_FIELDS.map((field) => (
            <div key={field.id} className="grid grid-cols-[0.75fr_1.35fr] border-b border-border/60 last:border-b-0 md:grid-cols-[0.65fr_1.35fr_1fr]">
              <label htmlFor={`field-${field.id}`} className="p-4 text-xs font-extrabold text-zinc-200 md:p-5">{field.label}</label>
              <div className="border-l border-border/60 p-3 md:p-4">
                <textarea id={`field-${field.id}`} value={form[field.id]} onChange={(event) => updateField(field.id, event.target.value)} placeholder={field.placeholder} rows={field.id === 'audience' || field.id === 'branches' ? 4 : 3} className="min-h-full w-full resize-y rounded-xl border border-border bg-zinc-950/65 px-3 py-2.5 text-xs font-medium leading-5 text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-primary" />
              </div>
              <p className="hidden border-l border-border/60 p-5 text-[11px] font-medium leading-5 text-zinc-500 md:block">{field.check}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-[24px] border border-border bg-zinc-900">
          <div className="flex items-center gap-2 border-b border-border bg-zinc-950/60 px-5 py-4">
            <User className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-extrabold text-zinc-100">主页包装</h3>
            <span className="text-[10px] font-medium text-zinc-500">从 AI 给出的方案中挑一套，再统一调整</span>
          </div>
          <div className="grid md:grid-cols-2">
            {PROFILE_FIELDS.map((field, index) => (
              <div key={field.id} className={`p-5 ${index % 2 === 0 ? 'md:border-r md:border-border/60' : ''} ${index < 2 ? 'border-b border-border/60' : ''}`}>
                <label htmlFor={`field-${field.id}`} className="mb-2 flex items-center justify-between text-xs font-extrabold text-zinc-200">
                  {field.label}<span className="text-[9px] font-medium text-zinc-600">{field.check}</span>
                </label>
                <textarea id={`field-${field.id}`} value={form[field.id]} onChange={(event) => updateField(field.id, event.target.value)} placeholder={field.placeholder} rows={3} className="w-full resize-y rounded-xl border border-border bg-zinc-950/65 px-3 py-2.5 text-xs font-medium leading-5 text-zinc-200 outline-none transition-colors placeholder:text-zinc-600 focus:border-primary" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="positioning-example" className="scroll-mt-[340px] rounded-[28px] border border-border bg-zinc-900 p-5 sm:scroll-mt-36 md:p-8">
        <SectionHeading
          eyebrow="REFERENCE / 老师示例"
          title="参考颗粒度，不照抄答案"
          description="这份示例展示一张完整定位卡应该具体到什么程度。最终账号方案仍以真实测试结果为准。"
        />
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          {TEACHER_EXAMPLE.map(([label, content], index) => (
            <div key={label} className={`grid gap-2 p-4 md:grid-cols-[180px_1fr] md:gap-6 md:p-5 ${index % 2 === 0 ? 'bg-zinc-950/45' : 'bg-zinc-900'} ${index !== TEACHER_EXAMPLE.length - 1 ? 'border-b border-border/60' : ''}`}>
              <div className="text-xs font-extrabold text-amber-400">{label}</div>
              <div className="text-xs font-medium leading-6 text-zinc-400">{content}</div>
            </div>
          ))}
        </div>
      </section>
          </>
        )}
      </div>
    </div>
  );
}

function CourseCatalog({ onOpenPositioning }: { onOpenPositioning: () => void }) {
  return (
    <div className="ai-media-shell flex flex-col gap-7 animate-fade-in">
      <section className="course-catalog-hero relative overflow-hidden rounded-[30px] border border-border bg-zinc-900 px-6 py-9 md:px-10 md:py-12">
        <div className="ai-orbit ai-orbit-one" aria-hidden="true" />
        <div className="ai-orbit ai-orbit-two" aria-hidden="true" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-extrabold tracking-[0.16em] text-amber-400">
                AI 自媒体 · 林纸巾
              </span>
              <span className="text-xs font-medium text-zinc-500">课程资料库</span>
            </div>
            <h2 className="max-w-3xl text-3xl font-black leading-[1.14] tracking-[-0.04em] text-zinc-100 md:text-5xl">
              每一门大课，
              <br />
              都整理成一套<span className="ai-marker">能反复使用的方法。</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-zinc-400">
              按课程进入独立学习空间。每门课分成“课程内容”和“配套资源”两组：前者负责学懂方法，后者负责立即实践，后续增加新课程也不会打乱现有内容。
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-zinc-950/60 p-5 backdrop-blur-sm">
            <div className="font-mono text-[10px] font-bold tracking-[0.16em] text-zinc-600">LIBRARY STATUS</div>
            <div className="mt-4">
              <div className="rounded-xl bg-zinc-900 p-4">
                <div className="font-mono text-2xl font-bold text-amber-400">01</div>
                <div className="mt-1 text-[10px] font-bold text-zinc-500">门课程已整理</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4 px-1">
          <SectionHeading
            eyebrow="COURSE LIBRARY / 课程目录"
            title="选择一门课开始"
            description="课程之间互相独立，学习资料不会混在同一个长页面里。"
          />
          <span className="hidden rounded-full border border-border bg-zinc-900 px-3 py-2 font-mono text-[10px] text-zinc-500 sm:block">1 COURSE</span>
        </div>

        <button
          type="button"
          onClick={() => {
            onOpenPositioning();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="进入课程：自媒体账号定位"
          className="course-library-card group grid w-full overflow-hidden rounded-[28px] border border-border bg-zinc-900 text-left md:grid-cols-[0.78fr_1.22fr]"
        >
          <div className="course-cover relative min-h-64 overflow-hidden border-b border-border p-7 md:min-h-[360px] md:border-b-0 md:border-r">
            <div className="absolute inset-0 opacity-70" aria-hidden="true" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-extrabold text-amber-400">已整理</span>
                <span className="font-mono text-[10px] font-bold text-zinc-600">LIN ZHIJIN</span>
              </div>
              <div>
                <div className="font-mono text-xs font-bold tracking-[0.18em] text-amber-400">POSITIONING</div>
                <div className="mt-3 font-serif text-4xl font-black leading-tight text-zinc-100 md:text-5xl">账号<br />定位</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 md:p-9">
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.16em] text-zinc-600">自媒体账号定位</div>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.025em] text-zinc-100 md:text-3xl">从“我想拍什么”到“别人为什么关注我”</h3>
              <p className="mt-4 max-w-2xl text-xs font-medium leading-6 text-zinc-500 md:text-sm">
                学会确定赛道与小切口、设计人设记忆点、拆解对标账号，并用 AI 陪练完成定位卡和主页包装。
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['02', '课程内容'],
                  ['03', '配套资源'],
                  ['16', '知识点'],
                  ['01', 'AI 工具'],
                ].map(([number, label]) => (
                  <div key={label} className="rounded-xl border border-border/70 bg-zinc-950/45 p-3">
                    <div className="font-mono text-base font-bold text-amber-400">{number}</div>
                    <div className="mt-0.5 text-[10px] font-bold text-zinc-600">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">
                <BookOpen className="h-4 w-4" />
                课程内容 2 项 · 配套资源 3 项
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-amber-400 transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </button>
      </section>

      <section className="rounded-2xl border border-dashed border-border bg-zinc-900/55 p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-extrabold text-zinc-300">后续课程将按同一结构加入</div>
            <p className="mt-1 text-[11px] font-medium text-zinc-600">不会创建无法打开的空课程，资料准备好后再正式上线。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['文案创作', '选题策划', '拍摄表达', '账号运营'].map((course) => (
              <span key={course} className="rounded-full border border-border bg-zinc-950/45 px-3 py-1.5 text-[10px] font-bold text-zinc-600">{course}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <div className="font-mono text-[10px] font-bold tracking-[0.16em] text-amber-400">{eyebrow}</div>
      <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.025em] text-zinc-100 md:text-3xl">{title}</h2>
      <p className="mt-2 text-xs font-medium leading-6 text-zinc-500 md:text-sm">{description}</p>
    </div>
  );
}
