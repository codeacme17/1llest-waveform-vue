import type { IllestWaveformProps } from '../types/waveform';
export default class Wave {
    private canvas;
    private props;
    private filteredData;
    private canvasCtx;
    constructor(canvas: HTMLCanvasElement, props: IllestWaveformProps, filteredData: number[]);
    get _canvas(): HTMLCanvasElement;
    set _props(props: IllestWaveformProps);
    get _props(): IllestWaveformProps;
    setupCanvas(): void;
    private setCanvasBase;
    private translateCanvasCtx;
    private drawCanvasLines;
    private drawMask;
    private drawWave;
    setWaveStyle(maskWidth: number): void;
}
