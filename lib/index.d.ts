import { Component } from 'vue'

declare const _default: {
  install: (app: Component) => void
}

type CanvasLineCap = 'butt' | 'round' | 'square'

export declare const IllestWaveform: import('vue').DefineComponent<
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
      type: StringConstructor
      required: false
      default: string
    }
    lineColor: {
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
    skeleton: {
      type: BooleanConstructor
      required: false
      default: boolean
    }
    skeletonColor: {
      type: StringConstructor
      required: false
      default: string
    }
    interact: {
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
      lineColor: string
      samplingRate: number
      cursorWidth: number
      cursorColor: string
      maskColor: string
      lazy: boolean
      skeleton: boolean
      skeletonColor: string
      interact: boolean
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
        required: false
        default: number
      }
      lineCap: {
        type: StringConstructor
        required: false
        default: string
      }
      lineColor: {
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
      skeleton: {
        type: BooleanConstructor
        required: false
        default: boolean
      }
      skeletonColor: {
        type: StringConstructor
        required: false
        default: string
      }
      interact: {
        type: BooleanConstructor
        required: false
        default: boolean
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
    lazy: boolean
    skeleton: boolean
    skeletonColor: string
    interact: boolean
  }
>

export type IllestWaveformProps = {
  url: string
  lineWidth?: number
  lineCap?: CanvasLineCap
  lineColor?: string
  samplingRate?: number
  cursorWidth?: number
  cursorColor?: string
  maskColor?: string
  lazy?: boolean
  skeleton?: boolean
  skeletonColor?: string
  interact?: boolean
}

export default _default
