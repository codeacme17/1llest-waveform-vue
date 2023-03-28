import type { IllestWaveformProps } from '../../types/waveform'

export default class Wave {
  protected canvasCtx!: CanvasRenderingContext2D

  constructor(
    protected canvas: HTMLCanvasElement,
    protected props: IllestWaveformProps,
    protected filteredData: number[][]
  ) {
    this.canvas = canvas
    this.canvasCtx = this.canvas?.getContext('2d') as CanvasRenderingContext2D
    this.props = props
    this.filteredData = filteredData
  }

  get _canvas(): HTMLCanvasElement {
    return this.canvas
  }

  set _props(props: IllestWaveformProps) {
    this.props = props
  }

  get _props(): IllestWaveformProps {
    return this.props
  }

  public setupCanvas(): void {
    this.setCanvasBase()
    this.translateCanvasCtx()
    this.drawCanvasLines()
  }

  protected setCanvasBase(): void {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.canvas.style.opacity = '1'
    this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private translateCanvasCtx(): void {
    this.canvasCtx.translate(
      this.canvas.width / this.filteredData.length,
      this.canvas.height / 2 - this.canvas.height / 2
    )
  }

  private drawCanvasLines(): void {
    const { canvas, canvasCtx, filteredData } = this
    filteredData.forEach((items: number[], index: number) => {
      const singleLineWidth = canvas.width / filteredData.length
      const x = singleLineWidth * index - singleLineWidth / 2
      canvasCtx.moveTo(
        x,
        canvas.height / 2 - Math.abs(items[0]) * canvas.height * 0.4
      )
      canvasCtx.lineTo(
        x,
        canvas.height / 2 + Math.abs(items[0]) * canvas.height * 0.4
      )
    })
  }

  public setCanvasStyle(): void {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.canvasCtx.lineWidth = this.props.lineWidth as number
    this.canvasCtx.lineCap = this.props.lineCap as CanvasLineCap
    this.canvasCtx.strokeStyle = this.props.lineColor as string
    this.canvasCtx.stroke()
  }
}
