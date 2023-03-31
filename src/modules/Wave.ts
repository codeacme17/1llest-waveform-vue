import type { IllestWaveformProps } from '../types/waveform'

export default class Wave {
  private canvasCtx!: CanvasRenderingContext2D

  constructor(
    private canvas: HTMLCanvasElement,
    private props: IllestWaveformProps,
    private filteredData: number[]
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

  private setCanvasBase(): void {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.canvas.style.opacity = '1'
    this.canvasCtx.fillStyle = 'transparent'
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
    filteredData.forEach((item: number, index: number) => {
      const singleLineWidth = canvas.width / filteredData.length
      const x = singleLineWidth * index - singleLineWidth / 2
      canvasCtx.moveTo(
        x,
        canvas.height / 2 - Math.abs(item) * canvas.height * 0.4
      )
      canvasCtx.lineTo(
        x,
        canvas.height / 2 + Math.abs(item) * canvas.height * 0.4
      )
    })
  }

  private drawMask(maskWidth: number): void {
    const { canvas, canvasCtx, props } = this
    canvasCtx.globalCompositeOperation = 'destination-atop'
    canvasCtx.fillStyle = props.maskColor as string
    canvasCtx.fillRect(0, 0, maskWidth, canvas.height)
  }

  private drawWave(): void {
    const { canvasCtx, props } = this
    canvasCtx.lineWidth = props.lineWidth as number
    canvasCtx.lineCap = props.lineCap as CanvasLineCap
    canvasCtx.strokeStyle = props.lineColor as string
    canvasCtx.stroke()
  }

  public setWaveStyle(maskWidth: number): void {
    const { canvas, canvasCtx } = this
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    this.drawMask(maskWidth)
    this.drawWave()
  }
}
