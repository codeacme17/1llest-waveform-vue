import WebAudio from './index'
import type { IllestWaveformProps } from '../../types/waveform'

/**
 *  WebAudioController Class creates construct,
 *  which can control the web audio behaviors.
 *  It's inheirts from WebAudio Class.
 *
 */

export default class WebAudioController extends WebAudio {
  private startAt: number
  private pauseAt: number
  private pickAt: number
  private playing: boolean

  constructor(props: IllestWaveformProps) {
    super(props)
    this.startAt = 0
    this.pauseAt = 0
    this.pickAt = 0
    this.playing = false
  }

  get _playing(): boolean {
    return this.playing
  }

  get _currentTime(): number {
    if (this.pauseAt) return this.pauseAt
    if (this.startAt) return this.audioCtx.currentTime - this.startAt
    return this.audioCtx.currentTime
  }

  public play(): void {
    const offset = this.pickAt ? this.pickAt : this.pauseAt
    this.connectDestination()
    this.audioBufferSourceNode.start(0, offset)
    this.startAt = this.audioCtx.currentTime - offset
    this.pauseAt = 0
    this.playing = true
  }

  public pause(): void {
    const elapsed = this.audioCtx.currentTime - this.startAt
    this.stop()
    this.pauseAt = elapsed
  }

  public pick(pickedTime: number): void {
    if (pickedTime <= 0) pickedTime = 0
    if (pickedTime >= this._audioDuration) pickedTime = this._audioDuration
    this.pickAt = pickedTime
    if (!this.playing) return
    this.stopSource()
    this.play()
  }

  public replay(): void {
    this.stop()
    this.play()
  }

  private stop(): void {
    this.stopSource()
    this.initializeState()
  }

  private stopSource() {
    this.disconnectDestination()
    this.audioBufferSourceNode.stop()
  }

  private initializeState() {
    this.playing = false
    this.startAt = 0
    this.pauseAt = 0
    this.pickAt = 0
  }
}
