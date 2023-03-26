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
</template>

<script setup lang="ts">
  const props = defineProps(["props"])
const waveOptions = reactive<IllestWaveformProps>({
  ...props.props,
  lazy: true,
})

const waveform_ref = ref<typeof IllestWaveform>()

onMounted(() => {
  getCurrentTime()
})

const change = () => {
  waveOptions.lineStyle = "white"
  waveOptions.maskColor = "black"
}

let init = ref(false)
let playing = ref(false)
let finished = ref(false)
let ready = ref(false)
let currentTime = ref("0:00")
let durationTime = ref("0:00")

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
### props
```typescript
type IllestWaveformProps = {
  url: string
  lineWidth: number
  lineCap: CanvasLineCap
  lineColor: string
  samplingRate: number
  cursorWidth: number
  cursorColor: string
  maskColor: string
  lazy: boolean
  skeleton: boolean
  skeletonColor: string
}
```
- `url`: the url of the audio file
- `lineWidth`: the width of each vertical line that makes up the waveform, defualt: `0.5`
- `lineCap`: the style at the end of each vertical line that makes up the waveform, default: `round`
- `lineColor`: the color of each vertical line that makes up the waveform, default: `#5e5e5e`
- `samplingRate`: indicates your audio sampling rate. The larger the value, the more lines the waveform will present and the higher the accuracy, default: `22050`
  > But this value is not recommended to be too large, because too large a value will slow down rendering efficiency, the recommended value is between 8000 - 44100
- `cursorWidth`: indicates your cursor width, default: `2`
- `cursorColor`: the color of your cursor, default: `#fff`
- `maskColor`: the color of the waveform mask layer, default: `#fff`
- `lazy`: whether to enable lazy loading mode, if you want to display multiple waveforms as a list, this property is very useful, default: `true`
- `skeleton`: whether to enable the skeleton during waveform loading, default: `true`
- `skeletonColor`: the color of the skeleton, default: `#232323`

## Contributing
Contributions to the project are welcome! If you find a bug or have an idea for a new feature, please submit an issue or pull request.



## License
[MIT](https://github.com/codeacme17/1llg-terminal-GPT/blob/main/LICENSE) License © 2023-Present [leyoonafr](https://github.com/codeacme17)
