import type { WaveformProps } from '../../types/waveform'

export default class Wave {
  protected canvasCtx: CanvasRenderingContext2D | null

  constructor(
    protected canvas: HTMLCanvasElement | null,
    protected props: WaveformProps,
    protected filteredData: number[][]
  ) {
    this.canvas = canvas
    this.canvasCtx = this.canvas!.getContext('2d')
    this.props = props
    this.filteredData = filteredData
  }

  get _canvas(): HTMLCanvasElement | null {
    return this.canvas
  }

  set _props(props: WaveformProps) {
    this.props = props
  }

  public setupCanvas(): void {
    this.setCanvasBase()
    this.translateCanvasCtx()
    this.drawCanvasLines()
  }

  protected setCanvasBase(): void {
    this.canvas!.width = this.canvas!.offsetWidth
    this.canvas!.height = this.canvas!.offsetHeight
    this.canvas!.style.opacity = '1'
  }

  private translateCanvasCtx(): void {
    this.canvasCtx!.translate(
      this.canvas!.width / this.filteredData.length,
      this.canvas!.height / 2 - this.canvas!.height / 2
    )
  }

  private drawCanvasLines(): void {
    const { canvas, canvasCtx, filteredData } = this
    filteredData.forEach((items: number[], index: number) => {
      const singleLineWidth = canvas!.width / filteredData.length
      const x = singleLineWidth * index - singleLineWidth / 2
      canvasCtx!.moveTo(
        x,
        canvas!.height / 2 - Math.abs(items[0]) * canvas!.height * 2
      )
      canvasCtx!.lineTo(
        x,
        canvas!.height / 2 + Math.abs(items[0]) * canvas!.height * 2
      )
    })
  }

  public setCanvasStyle(): void {
    this.canvasCtx!.lineWidth = this.props.lineWidth as number
    this.canvasCtx!.lineCap = this.props.lineCap as CanvasLineCap
    this.canvasCtx!.strokeStyle = this.props.lineStyle as string
    this.canvasCtx!.stroke()
  }
}
