import { App } from 'vue'

declare const _default: {
  install: (app: App) => void
}

export declare const IllestWaveform: import('vue').DefineComponent<
  {
    url: {
      type: StringConstructor
      required: true
    }
    lineWidth: {
      type: NumberConstructor
      required: true
      default: number
    }
    lineCap: {
      type: StringConstructor
      required: true
      default: string
    }
    lineColor: {
      type: StringConstructor
      required: true
      default: string
    }
    samplingRate: {
      type: NumberConstructor
      required: true
      default: number
    }
    cursorWidth: {
      type: NumberConstructor
      required: true
      default: number
    }
    cursorColor: {
      type: StringConstructor
      required: true
      default: string
    }
    maskColor: {
      type: StringConstructor
      required: true
      default: string
    }
    lazy: {
      type: BooleanConstructor
      required: true
      default: boolean
    }
    skeleton: {
      type: BooleanConstructor
      required: true
      default: boolean
    }
    skeletonColor: {
      type: StringConstructor
      required: true
      default: string
    }
  },
  {
    props: {
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
    renderTrigger: import('vue').Ref<boolean>
    waveformContainer: import('vue').Ref<HTMLElement | null>
    lazyLoadHandler: () => void
    waveRef: import('vue').Ref<HTMLCanvasElement | null>
    maskRef: import('vue').Ref<HTMLCanvasElement | null>
    ready: import('vue').Ref<boolean>
    webAudioController: WebAudioController
    wave: Wave
    waveMask: WaveMask
    init: () => Promise<void>
    initAudio: () => Promise<void>
    initWave: () => Promise<void>
    initWaveMask: () => Promise<void>
    moveX: import('vue').Ref<number>
    currentTime: import('vue').Ref<number>
    maskWidth: import('vue').Ref<number>
    drawWaveMask: () => void | undefined
    mouseMoveHandler: (e: any) => void
    clickHandler: () => void
    play: () => void
    replay: () => void
    pause: () => void
    finish: () => void
    watchIsFinish: () => void
    getCurrentTime: () => string
    getDuration: () => string
    emits: (
      event:
        | 'onInit'
        | 'onReady'
        | 'onPlay'
        | 'onPause'
        | 'onFinish'
        | 'onClick',
      ...args: any[]
    ) => void
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  ('onInit' | 'onReady' | 'onPlay' | 'onPause' | 'onFinish' | 'onClick')[],
  'onInit' | 'onReady' | 'onPlay' | 'onPause' | 'onFinish' | 'onClick',
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
        required: true
        default: number
      }
      lineCap: {
        type: StringConstructor
        required: true
        default: string
      }
      lineColor: {
        type: StringConstructor
        required: true
        default: string
      }
      samplingRate: {
        type: NumberConstructor
        required: true
        default: number
      }
      cursorWidth: {
        type: NumberConstructor
        required: true
        default: number
      }
      cursorColor: {
        type: StringConstructor
        required: true
        default: string
      }
      maskColor: {
        type: StringConstructor
        required: true
        default: string
      }
      lazy: {
        type: BooleanConstructor
        required: true
        default: boolean
      }
      skeleton: {
        type: BooleanConstructor
        required: true
        default: boolean
      }
      skeletonColor: {
        type: StringConstructor
        required: true
        default: string
      }
    }>
  > & {
    onOnInit?: ((...args: any[]) => any) | undefined
    onOnReady?: ((...args: any[]) => any) | undefined
    onOnPlay?: ((...args: any[]) => any) | undefined
    onOnPause?: ((...args: any[]) => any) | undefined
    onOnFinish?: ((...args: any[]) => any) | undefined
    onOnClick?: ((...args: any[]) => any) | undefined
  },
  {
    lineWidth: number
    lineCap: string
    lineColor: string
    samplingRate: number
    cursorWidth: number
    cursorColor: string
    maskColor: string
    skeletonColor: string
  }
>

export type IllestWaveformProps = {
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

export default _default
