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
    A lightweight and controllable audio visualization vue3 plugin
  </samp>
</p>


## Description

This component is written using the native  [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), and does not use any dependencies other than vue3 in the production environment. Of course, this means: if your target browser does not support the features of the web audio api, then my Plugins will also not apply. You can go to  [Browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#audiocontext_2)  to see the `AudioContext` line to check whether it is compatible with the target browser

**Example** - [Live Demo](https://codeacme17.github.io/1llest-waveform-vue/)

## Start
### Install
```bash
npm install 1llest-waveform-vue
```

### Usage
Global component
```javascript
// main.ts
import { createApp } from "vue"
import App from "./App.vue"

import IllestWaveform from "1llest-waveform-vue"
import "1llest-waveform-vue/lib/style.css"

const app = createApp(App)

app.use(IllestWaveform)
app.mount("#app")
```
Local component
```js
// example.vue
import { IllestWaveform } from "1llest-waveform-vue"
import "1llest-waveform-vue/lib/style.css"
```
### Component
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
  import { onMounted, reactive, ref, watchEffect } from "vue"
  import type { Ref } from "vue"
  import { IllestWaveform } from "1llest-waveform-vue"
  import type { IllestWaveformProps } from "1llest-waveform-vue"
  import "1llest-waveform-vue/lib/style.css"
  
  const waveOptions = reactive<IllestWaveformProps>({
    url: "example.mp3"
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
  const currentTime = ref("0:00")
  const durationTime = ref("0:00")

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


## Documentation
### Component Props

| prop          | description                                                  | type            | default   |
| :------------ | :----------------------------------------------------------- | :-------------- | :-------- |
| url           | the url of the audio file                                    | `String`        | -         |
| lineWidth     | the width of each vertical line that makes up the waveform   | `Number`        | `0.5`     |
| lineCap       | the style at the end of each vertical line that makes up the waveform | `CanvasLineCap` | `round`   |
| lineColor     | the color of each vertical line that makes up the waveform   | `String`        | `#5e5e5e` |
| samplingRate  | indicates your audio sampling rate. The larger the value, the more lines the waveform will present and the higher the accuracy. But this value is not recommended to be too large, because too large a value will slow down rendering efficiency, the recommended value is between ` 8000 - 44100 ` | `Number`        | `22050`   |
| cursorWidth   | indicates your cursor width                                  | `Number`        | `2`       |
| cursorColor   | the color of your cursor                                     | `String`        | `#fff`    |
| maskColor     | the color of the waveform mask layer                         | `String`        | `#fff`    |
| lazy          | whether to enable lazy loading mode, if you want to display multiple waveforms as a list, this property is very useful | `Boolean`       | `true`    |
| skeleton      | whether to enable the skeleton during waveform loading       | `Boolean`       | `true`    |
| skeletonColor | the color of the skeleton                                    | `String`        | `#232323` |
| interact      | indicates whether you want the user to interact with the waveform | `Boolean`       | `true`    |
| fade          | achieve fade-in and fade-out effects when playing and pausing audio, this can give the user a smoother listening experience | `Boolean`       | `true`    |

### Events

> When using the following events, you need to add the `on-` prefix in front, such as `@on-init="initHandler"` 

| event   | description                                                  | params             |
| :------ | :----------------------------------------------------------- | :----------------- |
| init    | the hook event before the waveform starts to initialize      | `Boolean`          |
| fetched | the hook event after accepting the audio file                | `Boolean`          |
| ready   | the hook event triggered after the waveform completes all initialization and rendering to the page | `Boolean`          |
| play    | event fired when playback starts                             | `Boolean`          |
| pause   | event fired when playback is paused                          | `Boolean`          |
| finish  | the event triggered when the playback is completed (the playback completion refers to the completion of the entire audio) | `Boolean`          |
| click   | event triggered when waveform is clicked                     | `Ref<HTMLElement>` |

### Methods

> You can call these methods directly on the waveform component instance, such like `waveform_ref.value.play()`

| method        | description                                                  | return   |
| :------------- | :----------------------------------------------------------- | -------- |
| play           | trigger the playback method of the waveform so that it starts playing the current audio | -        |
| pause          | trigger the pause method of the waveform to make it pause playback | -        |
| replay         | this method can restart playing the current audio again      | -        |
| getCurrentTime | this method can get the current playing time. If you want to get the current playback time in real time, you can wrap it in the `watchEffect` hook | `string` |
| getDuration    | this method can get the duration of the current audio, but **this method must be placed after the `ready` hook event is triggered to get the correct duration** | `string` |



## Contributing

Contributions to the project are welcome! If you find a bug or have an idea for a new feature, please submit an issue or pull request.



## License
[MIT](https://github.com/codeacme17/1llg-terminal-GPT/blob/main/LICENSE) License © 2023-Present [leyoonafr](https://github.com/codeacme17)
