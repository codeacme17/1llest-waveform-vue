<br />
<p align="center">
  <img width="200" alt="logo" src="https://github.com/codeacme17/repo-assets/blob/main/waveform/logo.svg "/> 
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
import "1llest-waveform-vue/dist/style.css"

const app = createApp(App)

app.use(IllestWaveform)
app.mount("#app")
```
Local component
```js
// example.vue
import { IllestWaveform } from "1llest-waveform-vue"
import "1llest-waveform-vue/dist/style.css"
```
### Component
```vue
<template>
  <IllestWaveform
    ref="waveform_ref"
    v-bind="waveOptions"
    @on-init="onInit"
    @on-play="(v: boolean) => (playing = v)"
    @on-pause="(v: boolean) => (playing = v)"
    @on-finish="onFinish"
    @on-ready="onReady"
    @on-click="onClock"
  />
	<div>{{ currentTime }} - {{ durationTime }}</div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watchEffect } from "vue"
  import type { Ref } from "vue"
  import { IllestWaveform } from "1llest-waveform-vue"
  import type { IllestWaveformProps } from "1llest-waveform-vue"
	import "1llest-waveform-vue/dist/style.css"
  
  const waveOptions = reactive<IllestWaveformProps>({
    url: "example.mp3"
  })

  const waveform_ref = ref<typeof IllestWaveform | null>(null)

  onMounted(() => {
    getCurrentTime()
  })

  const change = () => {
    waveOptions.lineStyle = "white"
    waveOptions.maskColor = "black"
  }

  const init = ref(false)
  const playing = ref(false)
  const finished = ref(false)
  const ready = ref(false)
  const currentTime = ref("0:00")
  const durationTime = ref("0:00")

  const onInit = (v: boolean) => {
    init.value = v
  }

  const onReady = (v: boolean) => {
    ready.value = v
    getDuration()
  }

  const play = () => {
    waveform_ref.value!.play()
  }

  const replay = () => {
    waveform_ref.value!.replay()
  }

  const pause = () => {
    waveform_ref.value!.pause()
  }

  const getCurrentTime = () => {
    watchEffect(() => {
      const current = waveform_ref.value!.getCurrentTime()
      currentTime.value = current
    })
  }

  const getDuration = () => {
    const duration = waveform_ref.value!.getDuration()
    durationTime.value = duration
  }

  const onFinish = (v: boolean) => {
    finished.value = v
  }

  const onClock = (el: Ref<HTMLElement>) => {
    console.log(el)
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
| maskColor     | the color of the waveform mask layer                         | `String`        | `fff`     |
| lazy          | whether to enable lazy loading mode, if you want to display multiple waveforms as a list, this property is very useful | `Boolean`       | `true`    |
| skeleton      | whether to enable the skeleton during waveform loading       | `Boolean`       | `true`    |
| skeletonColor | the color of the skeleton                                    | `String`        | `#232323` |



## Contributing

Contributions to the project are welcome! If you find a bug or have an idea for a new feature, please submit an issue or pull request.



## License
[MIT](https://github.com/codeacme17/1llg-terminal-GPT/blob/main/LICENSE) License © 2023-Present [leyoonafr](https://github.com/codeacme17)
