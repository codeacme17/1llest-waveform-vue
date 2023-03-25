var I = Object.defineProperty;
var L = (s, e, t) => e in s ? I(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var u = (s, e, t) => (L(s, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as E, ref as c, onMounted as $, watchEffect as C, onUnmounted as O, openBlock as X, createElementBlock as Y, normalizeStyle as m, withDirectives as S, createElementVNode as f, vShow as D } from "vue";
class q {
  constructor(e) {
    u(this, "props");
    u(this, "audioCtx");
    u(this, "audioBuffer");
    u(this, "audioBufferSourceNode");
    this.props = e, this.audioCtx = new AudioContext();
  }
  get _filterData() {
    return this.createFilterData();
  }
  get _audioDuration() {
    return this.audioBuffer.duration;
  }
  async setupAudio() {
    await this.createAudioBuffer();
  }
  async createAudioBuffer() {
    const t = await (await fetch(this.props.url)).arrayBuffer();
    this.audioBuffer = await this.audioCtx.decodeAudioData(t);
  }
  createFilterData() {
    const e = this.props.samplingRate, t = this.audioBuffer.numberOfChannels, a = [], i = [];
    for (let n = 0; n < t; n++)
      a.push(this.audioBuffer.getChannelData(n));
    for (let n = 0; n < e; n++) {
      const l = [0, 0];
      for (let o = 0; o < t; o++) {
        const d = Math.floor(a[o].length / e);
        l[o] = a[o][n * d];
      }
      i.push(l);
    }
    return Promise.resolve(i);
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
class U extends q {
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
class W {
  constructor(e, t, a) {
    u(this, "canvasCtx");
    var i;
    this.canvas = e, this.props = t, this.filteredData = a, this.canvas = e, this.canvasCtx = (i = this.canvas) == null ? void 0 : i.getContext("2d"), this.props = t, this.filteredData = a;
  }
  get _canvas() {
    return this.canvas;
  }
  set _props(e) {
    this.props = e;
  }
  get _props() {
    return this.props;
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
    a.forEach((i, n) => {
      const l = e.width / a.length, o = l * n - l / 2;
      t.moveTo(
        o,
        e.height / 2 - Math.abs(i[0]) * e.height * 0.5
      ), t.lineTo(
        o,
        e.height / 2 + Math.abs(i[0]) * e.height * 0.5
      );
    });
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.lineStyle, this.canvasCtx.stroke();
  }
}
class V extends W {
  constructor(t, a, i, n) {
    super(t, a, i);
    u(this, "waveCanvas");
    this.waveCanvas = n;
  }
  setCanvasBase() {
    this.canvas.width = this.waveCanvas.width, this.canvas.height = this.waveCanvas.height, this.canvas.style.opacity = "1";
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.maskColor, this.canvasCtx.stroke();
  }
}
function j(s, e) {
  document.addEventListener("scroll", () => x(s, e));
}
function G(s, e) {
  document.removeEventListener("scroll", () => x(s, e));
}
function x(s, e) {
  const t = window.innerHeight, a = window.scrollY, i = window.pageYOffset + s.getBoundingClientRect().top;
  i >= a - t / 2 && i - a - t < t / 2 && e();
}
const J = { id: "ill-skeleton" }, K = /* @__PURE__ */ E({
  __name: "IllestWaveform",
  props: {
    url: null,
    lineWidth: { default: 2 },
    lineCap: { default: "round" },
    lineStyle: { default: "#5e5e5e" },
    samplingRate: { default: 1050 },
    cursorWidth: { default: 2 },
    cursorColor: { default: "#fff" },
    maskColor: { default: "#fff" },
    lazy: { type: Boolean, default: !0 },
    skeleton: { type: Boolean, default: !0 }
  },
  emits: [
    "onInit",
    "onReady",
    "onPlay",
    "onPause",
    "onFinish"
  ],
  setup(s, { expose: e, emit: t }) {
    const a = s, i = c(!1), n = c(null);
    $(() => {
      a.lazy ? (x(n.value, l), j(
        n.value,
        l
      ), C(async () => {
        i.value && d();
      })) : d();
    }), O(() => {
      a.lazy && G(n.value, l);
    });
    function l() {
      i.value = !0;
    }
    const o = c(!1);
    async function d() {
      return t("onInit", !0), await M(), b(), N(), o.value = !0, t("onReady", o.value), Promise.resolve("finish init waveform");
    }
    let r;
    async function M() {
      return r = new U(a), await r.setupAudio(), T(), Promise.resolve("finish init audio");
    }
    let h;
    const A = c(null);
    async function b() {
      return h = new W(
        A.value,
        a,
        await r._filterData
      ), h.setupCanvas(), C(() => {
        h._props = a, h.setCanvasStyle();
      }), Promise.resolve("finish init audio");
    }
    let p;
    const k = c(null);
    async function N() {
      p = new V(
        k.value,
        a,
        await r._filterData,
        h._canvas
      ), p.setupCanvas(), C(() => {
        p._props = a, p.setCanvasStyle();
      });
    }
    function R() {
      r.play(), t("onPlay", !0), g();
    }
    function z() {
      r.replay(), t("onFinish", !1), t("onPlay", !0), g();
    }
    function B() {
      r.pause(), t("onPause", !1);
    }
    function P() {
      t("onFinish", !0);
    }
    function T() {
      C(() => {
        w.value < r._audioDuration || (B(), P());
      });
    }
    const v = c(0), w = c(0), _ = c(0);
    function g() {
      !r._playing || (requestAnimationFrame(g), w.value = r._currentTime, _.value = w.value / r._audioDuration * h._canvas.width);
    }
    function F(y) {
      !o.value || (v.value = y.layerX);
    }
    function H() {
      if (!o.value)
        return;
      _.value = v.value;
      const y = v.value / h._canvas.width * r._audioDuration;
      r.pick(y), t("onFinish", !1);
    }
    return e({
      play: R,
      pause: B,
      replay: z
    }), (y, tt) => (X(), Y("section", {
      id: "ill-wave-container",
      ref_key: "waveformContainer",
      ref: n,
      style: m(`${o.value ? "cursor: pointer" : "cursor: progress;"}`),
      onMousemove: F,
      onClick: H
    }, [
      S(f("div", J, null, 512), [
        [D, a.skeleton && !o.value]
      ]),
      f("canvas", {
        id: "ill-wave",
        ref_key: "waveRef",
        ref: A
      }, null, 512),
      f("div", {
        id: "ill-waveMask-container",
        style: m(`width:${_.value}px;`)
      }, [
        f("canvas", {
          id: "ill-waveMask",
          ref_key: "maskRef",
          ref: k
        }, null, 512)
      ], 4),
      S(f("div", {
        id: "ill-cursor",
        style: m(`width:${a.cursorWidth}px; transform: translateX(${v.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [D, o.value]
      ])
    ], 36));
  }
});
const Q = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [a, i] of e)
    t[a] = i;
  return t;
}, Z = /* @__PURE__ */ Q(K, [["__scopeId", "data-v-8d2bd2aa"]]), st = {
  install: (s) => {
    s.component("IllestWaveform", Z);
  }
};
export {
  st as default
};
