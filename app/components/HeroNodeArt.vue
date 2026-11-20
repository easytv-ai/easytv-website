<script setup lang="ts">
// 首屏流水线六个节点的示意图：用同一条示例片（雨夜街头的橘猫）的真实画面，
// 拼成各环节的小界面。图片在 public/images/hero/，裁自作品页的演示作品。
defineProps<{ kind: 'script' | 'subject' | 'shot' | 'voice' | 'compose' | 'work' }>()
const { t } = useI18n()
const bars = [5, 9, 14, 8, 17, 11, 6, 13, 18, 9, 15, 7, 12, 16, 8, 5, 11, 14, 7, 10]
</script>

<template>
  <div class="node-art" :class="`node-art--${kind}`" aria-hidden="true">
    <!-- 剧本：一句话输入 + 拆出来的三场戏 -->
    <template v-if="kind === 'script'">
      <p class="na-prompt">{{ t('hero.demo_prompt') }}<i class="na-caret" /></p>
      <div class="na-scenes">
        <span v-for="n in 3" :key="n"><b>S{{ n }}</b><i :style="{ width: `${[72, 54, 64][n - 1]}%` }" /></span>
      </div>
    </template>

    <!-- 主体与风格：锁定的角色卡 + 风格色板 -->
    <template v-else-if="kind === 'subject'">
      <div class="na-subject">
        <img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="7" height="5" rx="1.2" /><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" /></svg>
      </div>
      <div class="na-styles">
        <span class="is-on" style="background: linear-gradient(135deg, #1f4b57, #b96a1c)" />
        <span style="background: linear-gradient(135deg, #d86bd0, #4d8ff0)" />
        <span style="background: linear-gradient(135deg, #5b5750, #bdb7ac)" />
        <span style="background: linear-gradient(135deg, #3a332f, #a3261f)" />
      </div>
    </template>

    <!-- 分镜：同一场戏的三个镜头，中间是正在生成的一镜 -->
    <template v-else-if="kind === 'shot'">
      <figure><img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async" style="object-position: 20% 20%; transform: scale(1.9); transform-origin: 20% 15%"><figcaption>01</figcaption></figure>
      <figure class="is-on"><img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async"><figcaption>02</figcaption></figure>
      <figure><img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async" style="transform: scale(2.6); transform-origin: 62% 34%"><figcaption>03</figcaption></figure>
    </template>

    <!-- 配音与字幕：画面上压字幕，底部是声波 -->
    <template v-else-if="kind === 'voice'">
      <img class="na-bg" src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async" style="transform: scale(1.7); transform-origin: 62% 30%">
      <span class="na-sub">{{ t('hero.demo_subtitle') }}</span>
      <div class="na-wave"><i v-for="(h, i) in bars" :key="i" :style="{ height: `${h}px` }" /></div>
    </template>

    <!-- 时间线：画面轨、配音轨、字幕轨和播放头 -->
    <template v-else-if="kind === 'compose'">
      <div class="na-track na-track--video">
        <span style="flex: 3"><img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async" style="transform: scale(1.9); transform-origin: 20% 15%"></span>
        <span style="flex: 4"><img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async"></span>
        <span style="flex: 3"><img src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async" style="transform: scale(2.6); transform-origin: 62% 34%"></span>
      </div>
      <div class="na-track na-track--audio"><i v-for="(h, i) in bars" :key="i" :style="{ height: `${Math.max(3, h / 2)}px` }" /></div>
      <div class="na-track na-track--sub"><span style="flex: 2" /><span style="flex: 3" /><span style="flex: 2" /></div>
      <i class="na-playhead" />
    </template>

    <!-- 成片：播放器 -->
    <template v-else>
      <img class="na-bg" src="/images/hero/cat.jpg" alt="" loading="lazy" decoding="async">
      <span class="na-play"><svg viewBox="0 0 12 12"><path d="M4 2.5v7l6-3.5z" fill="currentColor" /></svg></span>
      <span class="na-badge">0:30</span>
      <span class="na-progress"><i /></span>
    </template>
  </div>
</template>
