<script setup lang="ts">
import { ref, onMounted, watchEffect, onUnmounted } from 'vue'
import WebAudioController from '../modules/WebAudio/Controller'
import Wave from '../modules/Wave/index'
import WaveMask from '../modules/Wave/WaveMask'
import {
  lazyLoader,
  registerScrollHander,
  canelScrollHander,
} from '../utils/lazy-load'

type CanvasLineCap = 'butt' | 'round' | 'square'

type IllestWaveformProps = {
  url: string
  lineWidth: number
  lineCap: CanvasLineCap
  lineStyle: string
  samplingRate: number
  cursorWidth: number
  cursorColor: string
  maskColor: string
  lazy: boolean
}

const props = withDefaults(defineProps<IllestWaveformProps>(), {
  lineWidth: 2,
  lineCap: 'round',
  lineStyle: '#2e2e2e',
  cursorWidth: 2,
  cursorColor: '#fff',
  samplingRate: 1015,
  maskColor: '#fff',
  lazy: true,
})

const emits = defineEmits([
  'onInit', // start init hook
  'onReady', // ready to play, rended
  'onPlay', // start play hook
  'onPause', // pause hook
  'onFinish', // finish current track hook
])

// Render trigger can control the render time
// of current waveform
const renderTrigger = ref<boolean>(false)
const waveformContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  if (props.lazy) {
    lazyLoader(waveformContainer.value as HTMLElement, lazyLoadHandler)
    registerScrollHander(
      waveformContainer.value as HTMLElement,
      lazyLoadHandler
    )
    watchEffect(async () => {
      if (renderTrigger.value) initWaveform()
    })
  } else initWaveform()
})

onUnmounted(() => {
  if (props.lazy)
    canelScrollHander(waveformContainer.value as HTMLElement, lazyLoadHandler)
})

function lazyLoadHandler() {
  renderTrigger.value = true
}

// initialize waveform
const ready = ref<boolean>(false)
async function initWaveform(): Promise<string> {
  emits('onInit', true)
  await initAudio()
  initWave()
  initWaveMask()
  ready.value = true
  emits('onReady', ready.value)
  return Promise.resolve('finish init waveform')
}

// initialize web audio
let webAudioController: WebAudioController

async function initAudio(): Promise<string> {
  webAudioController = new WebAudioController(props)
  await webAudioController.setupAudio()
  watchIsFinish()
  return Promise.resolve('finish init audio')
}

// initialize wave canvas
let wave: Wave
const waveRef = ref<HTMLCanvasElement | null>(null)

async function initWave(): Promise<string> {
  wave = new Wave(
    waveRef.value as HTMLCanvasElement,
    props,
    await webAudioController._filterData
  )
  wave.setupCanvas()
  watchEffect(() => {
    wave._props = props
    wave.setCanvasStyle()
  })
  return Promise.resolve('finish init audio')
}

// initialize wave mask canvas
let waveMask: WaveMask
const maskRef = ref<HTMLCanvasElement | null>(null)

async function initWaveMask(): Promise<void> {
  waveMask = new WaveMask(
    maskRef.value as HTMLCanvasElement,
    props,
    await webAudioController._filterData,
    wave._canvas
  )
  waveMask.setupCanvas()
  watchEffect(() => {
    waveMask._props = props
    waveMask.setCanvasStyle()
  })
}

// Audio handlers
function play(): void {
  webAudioController.play()
  emits('onPlay', true)
  drawWaveMask()
}

function replay(): void {
  webAudioController.replay()
  emits('onFinish', false)
  emits('onPlay', true)
  drawWaveMask()
}

function pause(): void {
  webAudioController.pause()
  emits('onPause', false)
}

function finish(): void {
  emits('onFinish', true)
}

function watchIsFinish(): void {
  watchEffect(() => {
    if (currentTime.value < webAudioController._audioDuration) return
    pause()
    finish()
  })
}

// Waveform handlers
const moveX = ref<number>(0)
const currentTime = ref<number>(0)
const maskWidth = ref<number>(0)

function drawWaveMask(): void | undefined {
  if (!webAudioController._playing) return
  requestAnimationFrame(drawWaveMask)
  currentTime.value = webAudioController._currentTime
  maskWidth.value =
    (currentTime.value / webAudioController._audioDuration) * wave._canvas.width
}

function mouseMoveHandler(e: any): void {
  moveX.value = e.layerX
}

function clickHandler(): void {
  maskWidth.value = moveX.value
  const pickedTime: number =
    (moveX.value / wave._canvas.width) * webAudioController._audioDuration
  webAudioController.pick(pickedTime)
  emits('onFinish', false)
}

defineExpose({
  play,
  pause,
  replay,
})
</script>

<template>
  <section
    id="ill-wave-container"
    ref="waveformContainer"
    @mousemove="mouseMoveHandler"
    @click="clickHandler"
  >
    <canvas id="ill-wave" ref="waveRef" />

    <div id="ill-waveMask-container" :style="`width:${maskWidth}px;`">
      <canvas id="ill-waveMask" ref="maskRef" />
    </div>

    <div
      v-show="ready"
      id="ill-cursor"
      :style="`width:${props.cursorWidth}px; transform: translateX(${moveX}px);background-color: ${props.cursorColor};`"
    />
  </section>
</template>

<style>
#ill-wave-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

#ill-wave-container > #ill-wave {
  width: inherit;
  height: inherit;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

#ill-wave-container > #ill-waveMask-container {
  position: absolute;
  top: 0;
  left: 0;
  height: inherit;
  overflow: hidden;
}

#ill-wave-container > #ill-waveMask-container > #ill-waveMask {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

#ill-wave-container > #ill-cursor {
  position: absolute;
  height: inherit;
  left: 0px;
  top: 0px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

#ill-wave-container:hover #ill-cursor {
  opacity: 1;
}
</style>
