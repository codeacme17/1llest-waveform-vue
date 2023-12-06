import WebAudio from './Audio';
import type { IllestWaveformProps } from '../types/waveform';
/**
 *  WebAudioController Class creates construct,
 *  which can control the web audio behaviors.
 *  It's inheirts from WebAudio Class.
 *
 */
export default class WebAudioController extends WebAudio {
    private startAt;
    private pauseAt;
    private pickAt;
    private playing;
    private audioBufferSourceNode;
    private FADE_DURATION;
    constructor(props: IllestWaveformProps);
    get _playing(): boolean;
    get _currentTime(): number;
    play(): void;
    pause(): Promise<void>;
    pick(pickedTime: number): void;
    replay(): void;
    finish(): void;
    private initializeState;
    private createAudioBufferSourceNode;
    private connectDestination;
    private disconnectDestination;
    private setGainValue;
    private setGainLinearRamp;
}
