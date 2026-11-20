<script setup lang="ts">
// 首屏流水线六个节点的示意小图。纯 SVG，颜色跟主题变量走。
defineProps<{ kind: 'script' | 'subject' | 'shot' | 'voice' | 'compose' | 'work' }>()
</script>

<template>
  <svg class="hero-art" viewBox="0 0 160 64" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <!-- 剧本：一页带标题和场次标记的稿纸 -->
    <g v-if="kind === 'script'" stroke-linecap="round">
      <rect x="40" y="7" width="80" height="50" rx="6" class="art-card" />
      <path d="M50 18h28" class="art-accent" stroke-width="3" />
      <path d="M50 28h60M50 36h52M50 44h58" class="art-line" stroke-width="2.5" />
      <circle cx="108" cy="18" r="3" class="art-dot" />
    </g>

    <!-- 主体与风格：角色卡 + 三个风格色板 -->
    <g v-else-if="kind === 'subject'">
      <rect x="28" y="8" width="48" height="48" rx="8" class="art-card" />
      <circle cx="52" cy="26" r="8" class="art-fill" />
      <path d="M36 52c2-10 8-14 16-14s14 4 16 14" class="art-fill" />
      <circle cx="96" cy="20" r="8" fill="var(--accent)" opacity=".9" />
      <circle cx="118" cy="20" r="8" fill="var(--accent-2)" opacity=".9" />
      <circle cx="96" cy="42" r="8" fill="var(--accent-3)" opacity=".9" />
      <circle cx="118" cy="42" r="8" class="art-card" stroke-dasharray="3 3" />
    </g>

    <!-- 分镜：三格画面，中间一格是当前镜头 -->
    <g v-else-if="kind === 'shot'" stroke-linejoin="round">
      <rect x="12" y="14" width="40" height="36" rx="5" class="art-card" />
      <path d="M16 44l10-12 8 8 6-6 8 10z" class="art-fill" />
      <rect x="60" y="10" width="44" height="44" rx="6" class="art-card art-card--on" />
      <circle cx="92" cy="22" r="4" fill="var(--accent)" />
      <path d="M64 48l12-16 9 10 6-6 9 12z" fill="var(--accent)" opacity=".55" />
      <rect x="112" y="14" width="40" height="36" rx="5" class="art-card" />
      <circle cx="132" cy="28" r="6" class="art-fill" />
      <path d="M120 46c2-6 6-8 12-8s10 2 12 8" class="art-fill" />
    </g>

    <!-- 配音与字幕：声波 + 底部字幕条 -->
    <g v-else-if="kind === 'voice'" stroke-linecap="round">
      <path d="M30 26v6M38 20v18M46 14v30M54 22v14M62 10v38M70 18v22M78 24v10M86 14v30M94 20v18M102 8v42M110 22v14M118 16v26M126 24v10" class="art-accent" stroke-width="3.5" />
      <rect x="42" y="52" width="76" height="7" rx="3.5" class="art-fill" />
    </g>

    <!-- 时间线：三条轨道、若干片段和播放头 -->
    <g v-else-if="kind === 'compose'">
      <rect x="14" y="10" width="46" height="11" rx="3" fill="var(--accent)" opacity=".85" />
      <rect x="64" y="10" width="34" height="11" rx="3" class="art-fill" />
      <rect x="102" y="10" width="44" height="11" rx="3" fill="var(--accent-2)" opacity=".8" />
      <rect x="14" y="27" width="76" height="11" rx="3" class="art-fill" />
      <rect x="94" y="27" width="52" height="11" rx="3" fill="var(--accent-3)" opacity=".8" />
      <rect x="30" y="44" width="38" height="11" rx="3" class="art-fill" />
      <rect x="84" y="44" width="48" height="11" rx="3" class="art-fill" />
      <path d="M80 4v56" stroke="var(--fg)" stroke-width="2" stroke-linecap="round" />
      <path d="M75 4h10l-5 6z" fill="var(--fg)" />
    </g>

    <!-- 成片：播放按钮 + 走完的进度条 -->
    <g v-else>
      <rect x="34" y="6" width="92" height="52" rx="8" class="art-card art-card--on" />
      <circle cx="80" cy="28" r="13" fill="var(--accent)" />
      <path d="M76 21.5v13l11-6.5z" fill="#fff" />
      <rect x="44" y="48" width="72" height="4" rx="2" class="art-fill" />
      <rect x="44" y="48" width="72" height="4" rx="2" fill="var(--accent)" opacity=".9" />
      <circle cx="116" cy="50" r="4" fill="#fff" stroke="var(--accent)" stroke-width="2" />
    </g>
  </svg>
</template>
