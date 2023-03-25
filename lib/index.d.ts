import { App } from 'vue'

declare const _default: {
  install: (app: App) => void
}

declare const IllGWaveform: import('vue').DefineComponent<
  {
    url: {
      type: StringConstructor
      required: true
    }
    lineWidth: {
      type: NumberConstructor
      required: false
      default: number
    }
    lineCap: {
      type: null
      required: false
      default: string
    }
    lineStyle: {
      type: StringConstructor
      required: false
      default: string
    }
    samplingRate: {
      type: NumberConstructor
      required: false
      default: number
    }
    cursorWidth: {
      type: NumberConstructor
      required: false
      default: number
    }
    cursorColor: {
      type: StringConstructor
      required: false
      default: string
    }
    maskColor: {
      type: StringConstructor
      required: false
      default: string
    }
    lazy: {
      type: BooleanConstructor
      required: false
      default: boolean
    }
  },
  {
    props: {
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
    emits: (
      event: 'onPlay' | 'onPause' | 'onFinish' | 'onReady',
      ...args: any[]
    ) => void
    renderTrigger: import('vue').Ref<boolean>
    waveformContainer: import('vue').Ref<HTMLElement | null>
    lazyLoadHandler: () => void
    ready: import('vue').Ref<boolean>
    initWaveform: () => Promise<string>
    webAudioController: WebAudioController
    initAudio: () => Promise<string>
    wave: Wave
    waveRef: import('vue').Ref<HTMLCanvasElement | null>
    initWave: () => Promise<string>
    waveMask: WaveMask
    maskRef: import('vue').Ref<HTMLCanvasElement | null>
    initWaveMask: () => Promise<void>
    play: () => void
    replay: () => void
    pause: () => void
    finish: () => void
    watchIsFinish: () => void
    moveX: import('vue').Ref<number>
    radioX: import('vue').Ref<number>
    currentTime: import('vue').Ref<number>
    maskWidth: import('vue').Ref<number>
    drawWaveMask: () => void | undefined
    mouseMoveHandler: (e: any) => void
    clickHandler: () => void
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  ('onPlay' | 'onPause' | 'onFinish' | 'onReady')[],
  'onPlay' | 'onPause' | 'onFinish' | 'onReady',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    import('vue').ExtractPropTypes<{
      url: {
        type: StringConstructor
        required: true
      }
      lineWidth: {
        type: NumberConstructor
        required: false
        default: number
      }
      lineCap: {
        type: null
        required: false
        default: string
      }
      lineStyle: {
        type: StringConstructor
        required: false
        default: string
      }
      samplingRate: {
        type: NumberConstructor
        required: false
        default: number
      }
      cursorWidth: {
        type: NumberConstructor
        required: false
        default: number
      }
      cursorColor: {
        type: StringConstructor
        required: false
        default: string
      }
      maskColor: {
        type: StringConstructor
        required: false
        default: string
      }
      lazy: {
        type: BooleanConstructor
        required: false
        default: boolean
      }
    }>
  > & {
    onOnPlay?: ((...args: any[]) => any) | undefined
    onOnPause?: ((...args: any[]) => any) | undefined
    onOnFinish?: ((...args: any[]) => any) | undefined
    onOnReady?: ((...args: any[]) => any) | undefined
  },
  {
    lineWidth: number
    lineCap: any
    lineStyle: string
    samplingRate: number
    cursorWidth: number
    cursorColor: string
    maskColor: string
    lazy: boolean
  }
>

type IllGWaveformProps = {
  url: string
  lineWidth?: number
  lineCap?: CanvasLineCap
  lineStyle?: string
  samplingRate?: number
  cursorWidth?: number
  cursorColor?: string
  maskColor?: string
  lazy?: boolean
}

export default _default

export { IllGWaveform, IllGWaveformProps }
