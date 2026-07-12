/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Shortcut } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'editing',
    name: '剪辑与基础编辑',
    description: '日常最频繁使用的视频、音频裁剪与编辑组合。',
    icon: 'Scissors',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'playback',
    name: '播放与画面导航',
    description: '控制时间轴指针、逐帧预览、快速定位与J/K/L三键播放。',
    icon: 'Play',
    color: 'from-sky-500 to-blue-600',
  },
  {
    id: 'timeline',
    name: '时间线与轨道操作',
    description: '吸附控制、轨道锁定、静音、联动、轨道高度以及时间轴缩放。',
    icon: 'Kanban',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'text-effects',
    name: '音频、变速与组合',
    description: '音频分轨、音量微调、打组/解组、关键帧以及视频变速。',
    icon: 'Sliders',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 'file-global',
    name: '文件与全局系统',
    description: '项目的导入、导出、设置、以及常用的复制粘贴。',
    icon: 'FolderOpen',
    color: 'from-indigo-500 to-violet-600',
  },
];

export const SHORTCUTS_DATA: Shortcut[] = [
  // --- Category: editing ---
  {
    id: 'split-clip',
    name: '分割素材',
    description: '在播放头所在位置将选中的视频或音频片段一分为二。',
    category: 'editing',
    keys: {
      windows: ['Ctrl', 'B'],
      macos: ['Cmd', 'B'],
    },
    tips: '剪辑中最核心的按键。按下即可瞬间将视频切断，方便进行局部删除或变速。',
  },
  {
    id: 'delete-left',
    name: '向左裁剪 (删除播放轴左侧)',
    description: '将当前播放头左侧一直到上一个分割点（剪断处）之间的素材全部删除并靠拢。',
    category: 'editing',
    keys: {
      windows: ['Q'],
      macos: ['Q'],
    },
    tips: '极高阶效率神键！按下 Q 键相当于“分割 + 选中左半边 + 删除”三步合一，能极其快速地修剪掉开头或前一段的废话。',
  },
  {
    id: 'delete-right',
    name: '向右裁剪 (删除播放轴右侧)',
    description: '将当前播放头右侧一直到下一个分割点（剪断处）之间的素材全部删除。',
    category: 'editing',
    keys: {
      windows: ['W'],
      macos: ['W'],
    },
    tips: '与 Q 键相呼应，一键修剪掉后半段无用的素材，常用于快速修剪片尾或空隙。',
  },
  {
    id: 'mouse-select-mode',
    name: '鼠标选择模式',
    description: '切换鼠标为普通选择箭头状态。',
    category: 'editing',
    keys: {
      windows: ['A'],
      macos: ['A'],
    },
    tips: '用于常规的选择、拖拽和调整素材。配合分割模式使用可以极大提高效率。',
  },
  {
    id: 'mouse-split-mode',
    name: '鼠标分割模式',
    description: '切换鼠标为快捷分割剃刀状态。',
    category: 'editing',
    keys: {
      windows: ['B'],
      macos: ['B'],
    },
    tips: '切换后鼠标会变成一把“小剪刀”，在时间线上指哪切哪。按下 A 可以切回普通选择模式。',
  },
  {
    id: 'select-left-all',
    name: '向左全选',
    description: '一键选中当前播放轴左侧轨道上的所有素材片段。',
    category: 'editing',
    keys: {
      windows: ['['],
      macos: ['['],
    },
    tips: '当项目较长时，可以使用此快捷键一次性选中左半段，方便整体向左拖动或调整。',
  },
  {
    id: 'select-right-all',
    name: '向右全选',
    description: '一键选中当前播放轴右侧轨道上的所有素材片段。',
    category: 'editing',
    keys: {
      windows: [']'],
      macos: [']'],
    },
    tips: '当需要在开头腾出空间插入片头时，这个键可以帮你一键向后挪动右侧所有素材。',
  },
  {
    id: 'delete-clip',
    name: '删除选中的素材',
    description: '删除当前在时间轴上选中的素材片段。',
    category: 'editing',
    keys: {
      windows: ['Backspace'],
      macos: ['Delete'],
    },
    tips: '如果开启了主轨道吸附，删除后后面的素材会自动向前靠拢。',
  },
  {
    id: 'enable-disable-clip',
    name: '启用 / 停用片段',
    description: '临时禁用（隐藏/静音）选中的素材，使其不参与播放和导出。',
    category: 'editing',
    keys: {
      windows: ['V'],
      macos: ['V'],
    },
    tips: '想比对“加特效”和“不加特效”的区别时，不需要删掉素材，按 V 键禁用即可，再次按 V 键即可重新启用。',
  },
  {
    id: 'reverse',
    name: '倒放素材',
    description: '将选中的视频或音频素材进行反向播放。',
    category: 'editing',
    keys: {
      windows: [],
      macos: [],
    },
    tips: '剪映中此项功能默认【无快捷键】，你可以点击软件左上角的快捷键设置，手动为其绑定你习惯的按键（如 Shift + R ）。',
  },
  {
    id: 'freeze-frame',
    name: '定格 (冻结帧)',
    description: '在当前帧截取一张静止的图片并插入到时间轴中。',
    category: 'editing',
    keys: {
      windows: [],
      macos: [],
    },
    tips: '剪映中此项功能默认【无快捷键】，支持手动自定义绑定按键。提取后默认在时间轴生成一段3秒的静止画面。',
  },

  // --- Category: playback ---
  {
    id: 'play-pause',
    name: '播放 / 暂停',
    description: '控制时间轴的实时预览播放与暂停。',
    category: 'playback',
    keys: {
      windows: ['Space'],
      macos: ['Space'],
    },
    tips: '空格键是剪辑中使用频率最高的键，用来随时检查剪切点和节奏。',
  },
  {
    id: 'play-reverse-j',
    name: '逆向播放 / 逆向倍速 (J)',
    description: '向后（倒着）播放视频，连续按可以实现2倍、4倍、8倍倒放。',
    category: 'playback',
    keys: {
      windows: ['J'],
      macos: ['J'],
    },
    tips: '与 K, L 组成三键播放系统，是专业剪辑师快速浏览素材的基本功。',
  },
  {
    id: 'play-stop-k',
    name: '停止播放 (K)',
    description: '停止当前的视频播放。',
    category: 'playback',
    keys: {
      windows: ['K'],
      macos: ['K'],
    },
    tips: '按 K 停止播放，常用来精准卡在需要剪切的帧。',
  },
  {
    id: 'play-forward-l',
    name: '正向播放 / 正向倍速 (L)',
    description: '向前正常播放视频，连续按可以实现2倍、4倍、8倍快进。',
    category: 'playback',
    keys: {
      windows: ['L'],
      macos: ['L'],
    },
    tips: '用 L 键来快速过一遍冗长素材，找到重点位置再按 K 停下，比用鼠标拉进度条快得多。',
  },
  {
    id: 'prev-frame',
    name: '向左逐帧 (上一帧)',
    description: '播放头向左移动精确的一帧。',
    category: 'playback',
    keys: {
      windows: ['Left'],
      macos: ['Left'],
    },
    tips: '在精细卡点或对齐字幕时，用键盘左右方向键逐帧微调是必不可少的手段。',
  },
  {
    id: 'next-frame',
    name: '向右逐帧 (下一帧)',
    description: '播放头向右移动精确的一帧。',
    category: 'playback',
    keys: {
      windows: ['Right'],
      macos: ['Right'],
    },
    tips: '用于精确查找动作细节或音频声波起点。',
  },
  {
    id: 'prev-clip',
    name: '跳转到上一个剪辑点',
    description: '将播放轴直接快速移动到左侧相邻的分割点（剪切位置）。',
    category: 'playback',
    keys: {
      windows: ['Up'],
      macos: ['Up'],
    },
    tips: '用键盘向上方向键，可以瞬间在剪切点间跳跃，比用鼠标拖拽精准百倍。',
  },
  {
    id: 'next-clip',
    name: '跳转到下一个剪辑点',
    description: '将播放轴直接快速移动到右侧相邻的分割点（剪切位置）。',
    category: 'playback',
    keys: {
      windows: ['Down'],
      macos: ['Down'],
    },
    tips: '用键盘向下方向键快速向右跳转到下一个视频拼接点。',
  },
  {
    id: 'goto-home',
    name: '定位到首帧',
    description: '播放头直接闪现回时间线的开头。',
    category: 'playback',
    keys: {
      windows: ['Home'],
      macos: ['Home'],
    },
    tips: '一键回到视频的最起始处，常用于整体预览。',
  },
  {
    id: 'goto-end',
    name: '定位到尾帧',
    description: '播放头直接跳到整个项目的最后。',
    category: 'playback',
    keys: {
      windows: ['End'],
      macos: ['End'],
    },
    tips: '一键前往视频结尾。',
  },

  // --- Category: timeline ---
  {
    id: 'magnet-active',
    name: '开/关主轨道吸附',
    description: '磁性时间线开关：开启时删除中间素材后段会自动接上。',
    category: 'timeline',
    keys: {
      windows: ['N'],
      macos: ['N'],
    },
    tips: '吸附开启（默认）能省去手动拼合的时间；关闭吸附后，可以留下空白，方便自由排版。',
  },
  {
    id: 'main-track-magnet',
    name: '主轨磁吸模式',
    description: '一键启用主轨道的强制磁性吸附对齐。',
    category: 'timeline',
    keys: {
      windows: ['P'],
      macos: ['P'],
    },
    tips: '让主轨道中的视频片段始终紧密贴合，防止出现漏黑现象。',
  },
  {
    id: 'link',
    name: '开 / 关联动开关',
    description: '开启或关闭附属音效、贴纸、文字等与主轨视频的绑定联动。',
    category: 'timeline',
    keys: {
      windows: ['~'],
      macos: ['~'],
    },
    tips: '联动开启时，移动主视频，其上方的贴纸、音效会同步移动。关闭后则不会联动。',
  },
  {
    id: 'skimmer-axis',
    name: '预览轴开关',
    description: '开启或关闭鼠标指针在时间轴上的即时悬停预览。',
    category: 'timeline',
    keys: {
      windows: ['S'],
      macos: ['S'],
    },
    tips: '开启后鼠标滑动到哪里，预览画面就显示到哪里；关闭后只有点击位置才刷新。',
  },
  {
    id: 'zoom-in',
    name: '轨道视图水平放大',
    description: '放大时间轴，以便精细化看清声波和每一帧画面。',
    category: 'timeline',
    keys: {
      windows: ['Ctrl', '='],
      macos: ['Cmd', '='],
    },
    tips: '放大后对齐声波最方便，尤其在需要精确裁切1帧的时候。',
  },
  {
    id: 'zoom-out',
    name: '轨道视图水平缩小',
    description: '缩小时间轴，以便纵览项目全貌。',
    category: 'timeline',
    keys: {
      windows: ['Ctrl', '-'],
      macos: ['Cmd', '-'],
    },
    tips: '快速缩小时间线可以让你一眼看清整体轨道分布。',
  },
  {
    id: 'zoom-fit',
    name: '缩放至适应窗口',
    description: '自动调整时间轴宽度，让所有素材恰好完整显示在当前屏幕中。',
    category: 'timeline',
    keys: {
      windows: ['Shift', 'Z'],
      macos: ['Shift', 'Z'],
    },
    tips: '极其实用的一键重置键！直接让整个视频完整塞满当前可视区。',
  },
  {
    id: 'increase-track-height',
    name: '增高轨道高度',
    description: '垂直方向上把轨道拉宽，让素材缩略图和音轨声波更明显。',
    category: 'timeline',
    keys: {
      windows: ['Ctrl', 'Alt', '='],
      macos: ['Cmd', 'Option', '='],
    },
    tips: '当音轨的声波太小看不清时，一键拉高轨道高度非常见效。',
  },
  {
    id: 'decrease-track-height',
    name: '降低轨道高度',
    description: '垂直方向上把轨道压窄，腾出空间展示多条轨道。',
    category: 'timeline',
    keys: {
      windows: ['Ctrl', 'Alt', '-'],
      macos: ['Cmd', 'Option', '-'],
    },
    tips: '当音轨、贴纸轨等有十几层时，调窄高度能避免频繁上下滚动屏幕。',
  },

  // --- Category: text-effects ---
  {
    id: 'detach-audio',
    name: '分离 / 还原音频',
    description: '将视频文件中的内置声音剥离出来，变成一个独立的音频轨道。',
    category: 'text-effects',
    keys: {
      windows: ['Ctrl', 'Shift', 'S'],
      macos: ['Cmd', 'Shift', 'S'],
    },
    tips: '方便对视频中的声音进行单独的倒放、裁剪或变调操作。',
  },
  {
    id: 'add-marker',
    name: '添加标记点',
    description: '在当前播放轴位置添加蓝色参考标记。',
    category: 'text-effects',
    keys: {
      windows: ['M'],
      macos: ['M'],
    },
    tips: '卡点利器！听歌找节奏时狂按 M 键即可产生鼓点视觉参考。',
  },
  {
    id: 'add-diff-marker',
    name: '添加异色标记点',
    description: '在时间轴上添加一个不同颜色的关键标记，用于特殊区分。',
    category: 'text-effects',
    keys: {
      windows: ['Alt', 'M'],
      macos: ['Option', 'M'],
    },
    tips: '适用于标记核心转场、高潮或需要修改的特定镜头。',
  },
  {
    id: 'create-group',
    name: '创建素材组合',
    description: '将多个选中的素材组合打包，使它们可以整体移动。',
    category: 'text-effects',
    keys: {
      windows: ['Ctrl', 'G'],
      macos: ['Cmd', 'G'],
    },
    tips: '类似于PPT的成组，打组后移动其中一个，整组都会跟随，非常适合把一段复杂字幕和音效打组。',
  },
  {
    id: 'ungroup',
    name: '解除素材组合',
    description: '解散选中的素材组，使它们重新成为独立的零散片段。',
    category: 'text-effects',
    keys: {
      windows: ['Ctrl', 'Shift', 'G'],
      macos: ['Cmd', 'Shift', 'G'],
    },
    tips: '想要修改组里单个文件的相对位置时，先解组，调整后再重新建组即可。',
  },
  {
    id: 'create-compound',
    name: '新建复合片段',
    description: '将选中的多个视频/音频/贴纸素材打包成一个合并的复合片段（子草稿）。',
    category: 'text-effects',
    keys: {
      windows: ['Alt', 'G'],
      macos: ['Option', 'G'],
    },
    tips: '类似于嵌套序列，能够把非常零碎的多层素材和音效合二为一，使主轨道看起来非常整洁，且双击可进入子草稿单独编辑。',
  },
  {
    id: 'cancel-compound',
    name: '解除复合片段',
    description: '解散选中的复合片段，恢复成原来的多轨多层独立素材。',
    category: 'text-effects',
    keys: {
      windows: ['Alt', 'Shift', 'G'],
      macos: ['Option', 'Shift', 'G'],
    },
    tips: '可以将复合片段拆开，使其重新变回最开始的多个层级，便于在主轨道上继续精细微调各项内容。',
  },
  {
    id: 'speed-panel-active',
    name: '唤起变速面板',
    description: '呼出视频和音频的“变速”面板。',
    category: 'text-effects',
    keys: {
      windows: ['Ctrl', 'R'],
      macos: ['Cmd', 'R'],
    },
    tips: '用于实现倍速或者进入高级曲线变速。',
  },
  {
    id: 'add-keyframe',
    name: '添加关键帧',
    description: '在当前时间点对画面属性（大小、不透明度、位置等）添加一个控制点。',
    category: 'text-effects',
    keys: {
      windows: ['Alt', 'Shift', 'K'],
      macos: ['Option', 'Shift', 'K'],
    },
    tips: '动画的基础！两个不同属性的关键帧能自动形成渐变平滑的缩放、移动、透明度动画。',
  },

  // --- Category: file-global ---
  {
    id: 'import-file',
    name: '导入媒体文件',
    description: '打开电脑文件夹选择视频、音频或图片拉入剪映库。',
    category: 'file-global',
    keys: {
      windows: ['Ctrl', 'I'],
      macos: ['Cmd', 'I'],
    },
    tips: '创作的第一步。秒开文件夹，极速录入所需资源。',
  },
  {
    id: 'export-file',
    name: '导出成品视频',
    description: '调出最终导出的属性选择框进行渲染。',
    category: 'file-global',
    keys: {
      windows: ['Ctrl', 'E'],
      macos: ['Cmd', 'E'],
    },
    tips: '大功告成！直接设置分辨率和帧率一键导出高画质成品。',
  },
  {
    id: 'copy-item',
    name: '复制',
    description: '复制选中的素材。',
    category: 'file-global',
    keys: {
      windows: ['Ctrl', 'C'],
      macos: ['Cmd', 'C'],
    },
    tips: '常用于快速复制文字字幕样式、贴纸。',
  },
  {
    id: 'paste-item',
    name: '粘贴',
    description: '粘贴素材到播放头所在位置。',
    category: 'file-global',
    keys: {
      windows: ['Ctrl', 'V'],
      macos: ['Cmd', 'V'],
    },
    tips: '它会将素材粘到当前轨道或上方的新轨道。',
  },
  {
    id: 'select-all',
    name: '全选',
    description: '选中时间线上的所有素材片段。',
    category: 'file-global',
    keys: {
      windows: ['Ctrl', 'A'],
      macos: ['Cmd', 'A'],
    },
    tips: '当需要整体移动所有内容腾出开头时，一键全选免去拉框的烦恼。',
  },
];
