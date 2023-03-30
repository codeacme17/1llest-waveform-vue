declare const _default: import('vue').DefineComponent<
  __VLS_WithDefaults<
    __VLS_TypePropsToRuntimeProps<{
      url: string
      lineWidth?: number | undefined
      lineCap?: ('butt' | 'round' | 'square') | undefined
      lineColor?: string | undefined
      samplingRate?: number | undefined
      cursorWidth?: number | undefined
      cursorColor?: string | undefined
      maskColor?: string | undefined
      lazy?: boolean | Ref<boolean> | undefined
      skeleton?: boolean | Ref<boolean> | undefined
      skeletonColor?: string | undefined
      interact?: boolean | Ref<boolean> | undefined
    }>,
    {
      lineWidth: number
      lineCap: string
      lineColor: string
      cursorWidth: number
      cursorColor: string
      samplingRate: number
      maskColor: string
      lazy: boolean
      skeleton: boolean
      skeletonColor: string
      interact: boolean
    }
  >,
  {
    play: () => void
    pause: () => void
    replay: () => void
    getCurrentTime: () => string
    getDuration: () => string
  },
  unknown,
  {},
  {},
  import('vue').ComponentOptionsMixin,
  import('vue').ComponentOptionsMixin,
  (
    | 'onInit'
    | 'onFetched'
    | 'onReady'
    | 'onPlay'
    | 'onPause'
    | 'onFinish'
    | 'onClick'
  )[],
  | 'onInit'
  | 'onFetched'
  | 'onReady'
  | 'onPlay'
  | 'onPause'
  | 'onFinish'
  | 'onClick',
  import('vue').VNodeProps &
    import('vue').AllowedComponentProps &
    import('vue').ComponentCustomProps,
  Readonly<
    import('vue').ExtractPropTypes<
      __VLS_WithDefaults<
        __VLS_TypePropsToRuntimeProps<{
          url: string
          lineWidth?: number | undefined
          lineCap?: ('butt' | 'round' | 'square') | undefined
          lineColor?: string | undefined
          samplingRate?: number | undefined
          cursorWidth?: number | undefined
          cursorColor?: string | undefined
          maskColor?: string | undefined
          lazy?: boolean | Ref<boolean> | undefined
          skeleton?: boolean | Ref<boolean> | undefined
          skeletonColor?: string | undefined
          interact?: boolean | Ref<boolean> | undefined
        }>,
        {
          lineWidth: number
          lineCap: string
          lineColor: string
          cursorWidth: number
          cursorColor: string
          samplingRate: number
          maskColor: string
          lazy: boolean
          skeleton: boolean
          skeletonColor: string
          interact: boolean
        }
      >
    >
  > & {
    onOnInit?: ((...args: any[]) => any) | undefined
    onOnFetched?: ((...args: any[]) => any) | undefined
    onOnReady?: ((...args: any[]) => any) | undefined
    onOnPlay?: ((...args: any[]) => any) | undefined
    onOnPause?: ((...args: any[]) => any) | undefined
    onOnFinish?: ((...args: any[]) => any) | undefined
    onOnClick?: ((...args: any[]) => any) | undefined
  },
  {
    lineWidth: number
    lineCap: 'butt' | 'round' | 'square'
    lineColor: string
    samplingRate: number
    cursorWidth: number
    cursorColor: string
    maskColor: string
    lazy: boolean | Ref<boolean>
    skeleton: boolean | Ref<boolean>
    skeletonColor: string
    interact: boolean | Ref<boolean>
  }
>
export default _default
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T
type __VLS_TypePropsToRuntimeProps<T> = {
  [K in keyof T]-?: {} extends Pick<T, K>
    ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>
      }
    : {
        type: import('vue').PropType<T[K]>
        required: true
      }
}
type __VLS_WithDefaults<P, D> = {
  [K in keyof Pick<P, keyof P>]: K extends keyof D
    ? P[K] & {
        default: D[K]
      }
    : P[K]
}
