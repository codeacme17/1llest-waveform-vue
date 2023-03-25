var L = Object.defineProperty;
var E = (i, e, t) => e in i ? L(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var u = (i, e, t) => (E(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as X, ref as h, onMounted as $, unref as c, watchEffect as y, onUnmounted as I, openBlock as O, createElementBlock as Y, createElementVNode as w, normalizeStyle as k, withDirectives as G, vShow as q } from "vue";
class U {
  constructor(e) {
    u(this, "audioCtx");
    u(this, "audioBuffer");
    u(this, "audioBufferSourceNode");
    this.props = e, this.props = e, this.audioCtx = new AudioContext(), this.audioBuffer = null, this.audioBufferSourceNode = null;
  }
  get _filterData() {
    return this.createFilterData();
  }
  get _audioDuration() {
    return this.audioBuffer.duration;
  }
  async setupAudio() {
    return await this.createAudioBuffer(), Promise.resolve("finish setup audio");
  }
  async createAudioBuffer() {
    const t = await (await fetch(this.props.url)).arrayBuffer();
    return this.audioBuffer = await this.audioCtx.decodeAudioData(t), Promise.resolve("finish create audio buffer");
  }
  createFilterData() {
    const e = this.props.samplingRate, t = this.audioBuffer.numberOfChannels, a = [], n = [];
    for (let s = 0; s < t; s++)
      a.push(this.audioBuffer.getChannelData(s));
    for (let s = 0; s < e; s++) {
      let l = [0, 0];
      for (let r = 0; r < t; r++) {
        const p = Math.floor(
          a[r].length / e
        );
        l[r] = a[r][s * p];
      }
      n.push(l);
    }
    return Promise.resolve(n);
  }
  connectDestination() {
    this.createAudioBufferSourceNode(), this.disconnectDestination(), this.audioBufferSourceNode.connect(this.audioCtx.destination);
  }
  createAudioBufferSourceNode() {
    this.audioBufferSourceNode = this.audioCtx.createBufferSource(), this.audioBufferSourceNode.buffer = this.audioBuffer;
  }
  disconnectDestination() {
    this.audioBufferSourceNode && this.audioBufferSourceNode.disconnect();
  }
}
class V extends U {
  constructor(t) {
    super(t);
    u(this, "startAt");
    u(this, "pauseAt");
    u(this, "pickAt");
    u(this, "playing");
    this.startAt = 0, this.pauseAt = 0, this.pickAt = 0, this.playing = !1;
  }
  get _playing() {
    return this.playing;
  }
  get _currentTime() {
    return this.pauseAt ? this.pauseAt : this.startAt ? this.audioCtx.currentTime - this.startAt : this.audioCtx.currentTime;
  }
  play() {
    const t = this.pickAt ? this.pickAt : this.pauseAt;
    this.connectDestination(), this.audioBufferSourceNode.start(0, t), this.startAt = this.audioCtx.currentTime - t, this.pauseAt = 0, this.playing = !0;
  }
  pause() {
    const t = this.audioCtx.currentTime - this.startAt;
    this.stop(), this.pauseAt = t;
  }
  pick(t) {
    t <= 0 && (t = 0), t >= this._audioDuration && (t = this._audioDuration), this.pickAt = t, this.playing && (this.stopSource(), this.play());
  }
  replay() {
    this.stop(), this.play();
  }
  stop() {
    this.stopSource(), this.initializeState();
  }
  stopSource() {
    this.disconnectDestination(), this.audioBufferSourceNode.stop();
  }
  initializeState() {
    this.playing = !1, this.startAt = 0, this.pauseAt = 0, this.pickAt = 0;
  }
}
class D {
  constructor(e, t, a) {
    u(this, "canvasCtx");
    this.canvas = e, this.props = t, this.filteredData = a, this.canvas = e, this.canvasCtx = this.canvas.getContext("2d"), this.props = t, this.filteredData = a;
  }
  get _canvas() {
    return this.canvas;
  }
  set _props(e) {
    this.props = e;
  }
  setupCanvas() {
    this.setCanvasBase(), this.translateCanvasCtx(), this.drawCanvasLines();
  }
  setCanvasBase() {
    this.canvas.width = this.canvas.offsetWidth, this.canvas.height = this.canvas.offsetHeight, this.canvas.style.opacity = "1";
  }
  translateCanvasCtx() {
    this.canvasCtx.translate(
      this.canvas.width / this.filteredData.length,
      this.canvas.height / 2 - this.canvas.height / 2
    );
  }
  drawCanvasLines() {
    const { canvas: e, canvasCtx: t, filteredData: a } = this;
    a.forEach((n, s) => {
      const l = e.width / a.length, r = l * s - l / 2;
      t.moveTo(
        r,
        e.height / 2 - Math.abs(n[0]) * e.height * 2
      ), t.lineTo(
        r,
        e.height / 2 + Math.abs(n[0]) * e.height * 2
      );
    });
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.lineStyle, this.canvasCtx.stroke();
  }
}
class j extends D {
  constructor(t, a, n, s) {
    super(t, a, n);
    u(this, "waveCanvas");
    this.waveCanvas = s;
  }
  setCanvasBase() {
    this.canvas.width = this.waveCanvas.width, this.canvas.height = this.waveCanvas.height, this.canvas.style.opacity = "1";
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.maskColor, this.canvasCtx.stroke();
  }
}
function J(i, e) {
  document.addEventListener("scroll", () => A(i, e));
}
function K(i, e) {
  document.removeEventListener("scroll", () => A(i, e));
}
function A(i, e) {
  let t = window.innerHeight, a = window.scrollY, n = window.pageYOffset + i.getBoundingClientRect().top;
  n >= a - t / 2 && n - a - t < t / 2 && e();
}
const Q = /* @__PURE__ */ X({
  __name: "Waveform",
  props: {
    url: null,
    lineWidth: { default: 2 },
    lineCap: { default: "round" },
    lineStyle: { default: "#2e2e2e" },
    samplingRate: { default: 2215 },
    cursorWidth: { default: 2 },
    cursorColor: { default: "#fff" },
    maskColor: { default: "#fff" },
    lazy: { type: Boolean, default: !0 }
  },
  emits: ["onPlay", "onPause", "onFinish", "onReady"],
  setup(i, { expose: e, emit: t }) {
    const a = i;
    let n = h(!1), s = h(null);
    $(() => {
      a.lazy ? (A(c(s), l), J(c(s), l), y(async () => {
        n.value && p();
      })) : p();
    }), I(() => {
      a.lazy && K(c(s), l);
    });
    function l() {
      n.value = !0;
    }
    let r = h(!1);
    async function p() {
      return await W(), M(), N(), r.value = !0, t("onReady", r.value), Promise.resolve("finish init waveform");
    }
    let o;
    async function W() {
      return o = new V(a), await o.setupAudio(), z(), Promise.resolve("finish init audio");
    }
    let f, m = h(null);
    async function M() {
      return f = new D(c(m), a, await o._filterData), f.setupCanvas(), y(() => {
        f._props = a, f.setCanvasStyle();
      }), Promise.resolve("finish init audio");
    }
    let v, B = h(null);
    async function N() {
      v = new j(
        c(B),
        a,
        await o._filterData,
        f._canvas
      ), v.setupCanvas(), y(() => {
        v._props = a, v.setCanvasStyle();
      });
    }
    function P() {
      o.play(), t("onPlay", !0), _();
    }
    function b() {
      o.replay(), t("onFinish", !1), t("onPlay", !0), _();
    }
    function S() {
      o.pause(), t("onPause", !1);
    }
    function R() {
      t("onFinish", !0);
    }
    function z() {
      y(() => {
        g.value < o._audioDuration || (S(), R());
      });
    }
    let C = h(0), F = h(0), g = h(0), x = h(0);
    function _() {
      !o._playing || (requestAnimationFrame(_), g.value = o._currentTime, x.value = g.value / o._audioDuration * f._canvas.width);
    }
    function T(d) {
      C.value = d.layerX, F.value = (d.layerX / m.value.width).toFixed(2) * 1;
    }
    function H() {
      x.value = C.value;
      const d = C.value / f._canvas.width * o._audioDuration;
      o.pick(d), t("onFinish", !1);
    }
    return e({
      play: P,
      pause: S,
      replay: b
    }), (d, Z) => (O(), Y("section", {
      id: "ill-wave-container",
      ref_key: "waveformContainer",
      ref: s,
      onMousemove: T,
      onClick: H
    }, [
      w("canvas", {
        id: "ill-wave",
        ref_key: "waveRef",
        ref: m
      }, null, 512),
      w("div", {
        id: "ill-waveMask-container",
        style: k(`width:${c(x)}px;`)
      }, [
        w("canvas", {
          id: "ill-waveMask",
          ref_key: "maskRef",
          ref: B
        }, null, 512)
      ], 4),
      G(w("div", {
        id: "ill-cursor",
        style: k(`width:${a.cursorWidth}px;
               transform: translateX(${c(C)}px);
               background-color: ${a.cursorColor};
               `)
      }, null, 4), [
        [q, c(r)]
      ])
    ], 544));
  }
});
const at = {
  install: (i) => {
    i.component("IllGWaveform", Q);
  }
};
export {
  Q as IllGWaveform,
  at as default
};
