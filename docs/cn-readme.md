<br />
<p align="center">
  <img width="200" alt="logo" src="https://raw.githubusercontent.com/codeacme17/repo-assets/ebe95dad5e4904d000cf8a7d3642a0739cb708c7/waveform/logo.svg"/> 
</p>

<h3 align="center">
  <samp>
    1llest-waveform-vue
  </samp>
</h3>

<p align="center">
  <samp>
    一款轻量可视的 Vue3 音频播放插件
  </samp>
</p>

## 描述

该组件是使用原生的 [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) 编写的，在生产环境中除了依赖于 Vue 3 之外没有使用任何其他依赖。当然，这意味着：如果您的目标浏览器不支持 Web Audio API 的功能，那么我的插件也将无法应用。您可以前往 [浏览器兼容性](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#audiocontext_2) 页面查看 AudioContext 一行，以检查它是否与目标浏览器兼容。

**样本** - [Live Demo](https://codeacme17.github.io/1llest-waveform-vue/)

## 开始

### 下载

```bash
npm install 1llest-waveform-vue
```

### 使用

全局组件使用

```javascript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'

import IllestWaveform from '1llest-waveform-vue'
import '1llest-waveform-vue/lib/style.css'

const app = createApp(App)

app.use(IllestWaveform)
app.mount('#app')
```

本地组件使用

```js
// example.vue
import { IllestWaveform } from '1llest-waveform-vue'
import '1llest-waveform-vue/lib/style.css'
```

### 组件使用方式

```vue
<template>
  <IllestWaveform
    ref="waveformRef"
    v-bind="waveOptions"
    @on-init="initHandler"
    @on-fetched="fetchedHandler"
    @on-ready="readyHandler"
    @on-play="(v: boolean) => (playing = v)"
    @on-pause="(v: boolean) => (playing = v)"
    @on-finish="finishHandler"
    @on-click="clickHandler"
  />
  <div>{{ currentTime }} - {{ durationTime }}</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watchEffect } from 'vue'
import type { Ref } from 'vue'
import { IllestWaveform } from '1llest-waveform-vue'
import type { IllestWaveformProps } from '1llest-waveform-vue'
import '1llest-waveform-vue/lib/style.css'

const waveOptions = reactive<IllestWaveformProps>({
  url: 'example.mp3',
})

const waveformRef = ref<typeof IllestWaveform | null>(null)

onMounted(() => {
  getCurrentTime()
})

const init = ref(false)
const fetched = ref(false)
const playing = ref(false)
const finished = ref(false)
const ready = ref(false)
const currentTime = ref('0:00')
const durationTime = ref('0:00')

const initHandler = (v: boolean) => {
  init.value = v
}

const fetchedHandler = (v: boolean) => {
  fetched.value = v
}

const readyHandler = (v: boolean) => {
  ready.value = v
  getDuration()
}

const finishHandler = (v: boolean) => {
  finished.value = v
}

const clickHandler = (el: Ref<HTMLElement>) => {
  console.log(el)
}

const play = () => {
  waveformRef.value!.play()
}

const replay = () => {
  waveformRef.value!.replay()
}

const pause = () => {
  waveformRef.value!.pause()
}

const getCurrentTime = () => {
  watchEffect(() => {
    const current = waveformRef.value!.getCurrentTime()
    currentTime.value = current
  })
}

const getDuration = () => {
  const duration = waveformRef.value!.getDuration()
  durationTime.value = duration
}
</script>
```

## 文档

### 组件属性

| 属性          | 描述                                                                                                                                                         | 类型            | 默认值    |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------- | :-------- |
| url           | 音频文件的 URL 地址                                                                                                                                          | `String`        | -         |
| lineWidth     | 组成波形的每条垂直线的宽度                                                                                                                                   | `Number`        | `0.5`     |
| lineCap       | 组成波形的每条垂直线末端的样式                                                                                                                               | `CanvasLineCap` | `round`   |
| lineColor     | 组成波形的每条垂直线的颜色                                                                                                                                   | `String`        | `#5e5e5e` |
| samplingRate  | 指示您的音频采样率。值越大，波形将呈现出更多的线条，并具有更高的准确性。但不建议将此值设置得太大，因为过大的值会降低渲染效率，推荐值介于 `8000 - 44100` 之间 | `Number`        | `22050`   |
| cursorWidth   | 指示光标的宽度                                                                                                                                               | `Number`        | `2`       |
| cursorColor   | 光标的颜色                                                                                                                                                   | `String`        | `#fff`    |
| maskColor     | 波形遮罩层的颜色                                                                                                                                             | `String`        | `#fff`    |
| lazy          | 是否启用延迟加载模式，如果您想将多个波形显示为列表，此属性非常有用                                                                                           | `Boolean`       | `true`    |
| skeleton      | 是否在波形加载期间启用骨架屏效果                                                                                                                             | `Boolean`       | `true`    |
| skeletonColor | 骨架屏的颜色                                                                                                                                                 | `String`        | `#232323` |
| interact      | 是否允许用户与波形进行交互                                                                                                                                   | `Boolean`       | `true`    |
| fade          | 在播放和暂停音频时实现淡入淡出效果，这可以为用户提供更流畅的听觉体验                                                                                         | `Boolean`       | `true`    |

### 事件

> 在使用以下事件时，您需要在前面添加 `on-` 前缀，例如 `@on-init="initHandler"`

| 事件    | 描述                                                   | 参数               |
| :------ | :----------------------------------------------------- | :----------------- |
| init    | 波形开始初始化之前的钩子事件                           | `Boolean`          |
| fetched | 接受音频文件后的钩子事件                               | `Boolean`          |
| ready   | 在波形完成所有初始化和页面渲染后触发的钩子事件         | `Boolean`          |
| play    | 在播放开始时触发的事件                                 | `Boolean`          |
| pause   | 在播放暂停时触发的事件                                 | `Boolean`          |
| finish  | 在播放完成时触发的事件（播放完成是指整个音频播放完毕） | `Boolean`          |
| click   | 在单击波形时触发的事件                                 | `Ref<HTMLElement>` |

### 方法

> 您可以直接在波形组件实例上调用这些方法，例如 `waveform_ref.value.play()`

| 方法           | 描述                                                                                                | 返回值   |
| :------------- | :-------------------------------------------------------------------------------------------------- | -------- |
| play           | 触发波形的播放方法，使其开始播放当前音频                                                            | -        |
| pause          | 触发波形的暂停方法，使其暂停播放                                                                    | -        |
| replay         | 此方法可以重新开始播放当前音频                                                                      | -        |
| getCurrentTime | 此方法可以获取当前播放时间。如果您想实时获取当前播放时间，可以将其包装在 `watchEffect` 钩子中       | `string` |
| getDuration    | 此方法可以获取当前音频的持续时间，但是**此方法必须在 `ready` 钩子事件触发后才能获得正确的持续时间** | `string` |
