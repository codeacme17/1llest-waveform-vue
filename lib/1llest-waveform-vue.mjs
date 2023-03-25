var I = Object.defineProperty;
var L = (s, e, t) => e in s ? I(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var u = (s, e, t) => (L(s, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as E, ref as c, onMounted as $, watchEffect as y, onUnmounted as O, openBlock as X, createElementBlock as Y, normalizeStyle as m, createVNode as V, Transition as q, withCtx as U, withDirectives as x, createElementVNode as f, vShow as k } from "vue";
class j {
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
    for (let o = 0; o < t; o++)
      a.push(this.audioBuffer.getChannelData(o));
    for (let o = 0; o < e; o++) {
      const l = [0, 0];
      for (let n = 0; n < t; n++) {
        const d = Math.floor(a[n].length / e);
        l[n] = a[n][o * d];
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
class G extends j {
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
    a.forEach((i, o) => {
      const l = e.width / a.length, n = l * o - l / 2;
      t.moveTo(
        n,
        e.height / 2 - Math.abs(i[0]) * e.height * 0.5
      ), t.lineTo(
        n,
        e.height / 2 + Math.abs(i[0]) * e.height * 0.5
      );
    });
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.lineStyle, this.canvasCtx.stroke();
  }
}
class J extends W {
  constructor(t, a, i, o) {
    super(t, a, i);
    u(this, "waveCanvas");
    this.waveCanvas = o;
  }
  setCanvasBase() {
    this.canvas.width = this.waveCanvas.width, this.canvas.height = this.waveCanvas.height, this.canvas.style.opacity = "1";
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.maskColor, this.canvasCtx.stroke();
  }
}
function K(s, e) {
  document.addEventListener("scroll", () => A(s, e));
}
function Q(s, e) {
  document.removeEventListener("scroll", () => A(s, e));
}
function A(s, e) {
  const t = window.innerHeight, a = window.scrollY, i = window.pageYOffset + s.getBoundingClientRect().top;
  i >= a - t / 2 && i - a - t < t / 2 && e();
}
const Z = { id: "ill-skeleton" }, tt = { id: "ill-skeleton__load" }, et = /* @__PURE__ */ E({
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
    const a = s, i = c(!1), o = c(null);
    $(() => {
      a.lazy ? (A(o.value, l), K(
        o.value,
        l
      ), y(async () => {
        i.value && d();
      })) : d();
    }), O(() => {
      a.lazy && Q(o.value, l);
    });
    function l() {
      i.value = !0;
    }
    const n = c(!1);
    async function d() {
      return t("onInit", !0), await M(), N(), b(), n.value = !0, t("onReady", n.value), Promise.resolve("finish init waveform");
    }
    let r;
    async function M() {
      return r = new G(a), await r.setupAudio(), P(), Promise.resolve("finish init audio");
    }
    let h;
    const B = c(null);
    async function N() {
      return h = new W(
        B.value,
        a,
        await r._filterData
      ), h.setupCanvas(), y(() => {
        h._props = a, h.setCanvasStyle();
      }), Promise.resolve("finish init audio");
    }
    let v;
    const S = c(null);
    async function b() {
      v = new J(
        S.value,
        a,
        await r._filterData,
        h._canvas
      ), v.setupCanvas(), y(() => {
        v._props = a, v.setCanvasStyle();
      });
    }
    function R() {
      !n.value || (r.play(), t("onPlay", !0), g());
    }
    function T() {
      r.replay(), t("onFinish", !1), t("onPlay", !0), g();
    }
    function D() {
      r.pause(), t("onPause", !1);
    }
    function z() {
      t("onFinish", !0);
    }
    function P() {
      y(() => {
        w.value < r._audioDuration || (D(), z());
      });
    }
    const p = c(0), w = c(0), _ = c(0);
    function g() {
      !r._playing || (requestAnimationFrame(g), w.value = r._currentTime, _.value = w.value / r._audioDuration * h._canvas.width);
    }
    function F(C) {
      !n.value || (p.value = C.layerX);
    }
    function H() {
      if (!n.value)
        return;
      _.value = p.value;
      const C = p.value / h._canvas.width * r._audioDuration;
      r.pick(C), t("onFinish", !1);
    }
    return e({
      play: R,
      pause: D,
      replay: T
    }), (C, it) => (X(), Y("section", {
      id: "ill-wave-container",
      ref_key: "waveformContainer",
      ref: o,
      style: m(`${n.value ? "cursor: pointer" : "cursor: progress;"}`),
      onMousemove: F,
      onClick: H
    }, [
      V(q, { name: "fade" }, {
        default: U(() => [
          x(f("div", Z, [
            x(f("div", tt, null, 512), [
              [k, !n.value]
            ])
          ], 512), [
            [k, a.skeleton && !n.value]
          ])
        ]),
        _: 1
      }),
      f("canvas", {
        id: "ill-wave",
        ref_key: "waveRef",
        ref: B
      }, null, 512),
      f("div", {
        id: "ill-waveMask-container",
        style: m(`width:${_.value}px;`)
      }, [
        f("canvas", {
          id: "ill-waveMask",
          ref_key: "maskRef",
          ref: S
        }, null, 512)
      ], 4),
      x(f("div", {
        id: "ill-cursor",
        style: m(`width:${a.cursorWidth}px; transform: translateX(${p.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [k, n.value]
      ])
    ], 36));
  }
});
const at = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [a, i] of e)
    t[a] = i;
  return t;
}, st = /* @__PURE__ */ at(et, [["__scopeId", "data-v-b7c45651"]]), rt = {
  install: (s) => {
    s.component("IllestWaveform", st);
  }
};
export {
  rt as default
};
