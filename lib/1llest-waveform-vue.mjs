var P = Object.defineProperty;
var O = (s, e, t) => e in s ? P(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var u = (s, e, t) => (O(s, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as X, ref as h, onMounted as Y, watchEffect as _, onUnmounted as V, openBlock as q, createElementBlock as U, normalizeStyle as x, createVNode as j, Transition as G, withCtx as J, withDirectives as k, createElementVNode as p, vShow as A } from "vue";
class K {
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
      for (let r = 0; r < t; r++) {
        const C = Math.floor(a[r].length / e);
        l[r] = a[r][n * C];
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
class Q extends K {
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
class M {
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
      const l = e.width / a.length, r = l * n - l / 2;
      t.moveTo(
        r,
        e.height / 2 - Math.abs(i[0]) * e.height * 0.5
      ), t.lineTo(
        r,
        e.height / 2 + Math.abs(i[0]) * e.height * 0.5
      );
    });
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.lineStyle, this.canvasCtx.stroke();
  }
}
class Z extends M {
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
function W(s) {
  const e = Math.floor(s / 60), t = Math.floor(s % 60);
  return `${e}:${t < 10 ? "0" : ""}${t}`;
}
function tt(s, e) {
  document.addEventListener("scroll", () => S(s, e));
}
function et(s, e) {
  document.removeEventListener("scroll", () => S(s, e));
}
function S(s, e) {
  const t = window.innerHeight, a = window.scrollY, i = window.pageYOffset + s.getBoundingClientRect().top;
  i >= a - t / 2 && i - a - t < t / 2 && e();
}
const at = { id: "ill-skeleton" }, st = { id: "ill-skeleton__load" }, it = /* @__PURE__ */ X({
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
    "onFinish",
    "onClock"
  ],
  setup(s, { expose: e, emit: t }) {
    const a = s, i = h(!1), n = h(null);
    Y(async () => {
      a.lazy ? (S(n.value, l), tt(
        n.value,
        l
      ), _(async () => {
        i.value && await B();
      })) : await B();
    }), V(() => {
      a.lazy && et(n.value, l);
    });
    function l() {
      i.value = !0;
    }
    const r = h(null), C = h(null), c = h(!1);
    let o, f, y;
    async function B() {
      t("onInit", !0), await T(), await N(), await R(), c.value = !0, t("onReady", c.value);
    }
    async function T() {
      o = new Q(a), await o.setupAudio(), L();
    }
    async function N() {
      f = new M(
        r.value,
        a,
        await o._filterData
      ), f.setupCanvas(), _(() => {
        f._props = a, f.setCanvasStyle();
      });
    }
    async function R() {
      y = new Z(
        C.value,
        a,
        await o._filterData,
        f._canvas
      ), y.setupCanvas(), _(() => {
        y._props = a, y.setCanvasStyle();
      });
    }
    const w = h(0), v = h(0), g = h(0);
    function m() {
      !o._playing || (requestAnimationFrame(m), v.value = o._currentTime, g.value = v.value / o._audioDuration * f._canvas.width);
    }
    function b(d) {
      !c.value || (w.value = d.layerX);
    }
    function z() {
      if (!c.value)
        return;
      g.value = w.value;
      const d = w.value / f._canvas.width * o._audioDuration;
      o.pick(d), v.value = d, t("onClock", !0), t("onFinish", !1);
    }
    function F() {
      !c.value || (o.play(), t("onPlay", !0), m());
    }
    function H() {
      o.replay(), t("onFinish", !1), t("onPlay", !0), m();
    }
    function D() {
      o.pause(), t("onPause", !1);
    }
    function I() {
      t("onFinish", !0);
    }
    function L() {
      _(() => {
        v.value < o._audioDuration || (D(), I());
      });
    }
    function $() {
      return W(v.value);
    }
    function E() {
      const d = o._audioDuration;
      return W(d);
    }
    return e({
      play: F,
      pause: D,
      replay: H,
      getCurrentTime: $,
      getDuration: E
    }), (d, rt) => (q(), U("section", {
      id: "ill-wave-container",
      ref_key: "waveformContainer",
      ref: n,
      style: x(`${c.value ? "cursor: pointer" : "cursor: progress;"}`),
      onMousemove: b,
      onClick: z
    }, [
      j(G, { name: "fade" }, {
        default: J(() => [
          k(p("div", at, [
            k(p("div", st, null, 512), [
              [A, !c.value]
            ])
          ], 512), [
            [A, a.skeleton && !c.value]
          ])
        ]),
        _: 1
      }),
      p("canvas", {
        id: "ill-wave",
        ref_key: "waveRef",
        ref: r
      }, null, 512),
      p("div", {
        id: "ill-waveMask-container",
        style: x(`width:${g.value}px;`)
      }, [
        p("canvas", {
          id: "ill-waveMask",
          ref_key: "maskRef",
          ref: C
        }, null, 512)
      ], 4),
      k(p("div", {
        id: "ill-cursor",
        style: x(`width:${a.cursorWidth}px; transform: translateX(${w.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [A, c.value]
      ])
    ], 36));
  }
});
const nt = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [a, i] of e)
    t[a] = i;
  return t;
}, ot = /* @__PURE__ */ nt(it, [["__scopeId", "data-v-9984196e"]]), ct = {
  install: (s) => {
    s.component("IllestWaveform", ot);
  }
};
export {
  ct as default
};
