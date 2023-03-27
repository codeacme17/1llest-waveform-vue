var P = Object.defineProperty;
var O = (i, e, t) => e in i ? P(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var u = (i, e, t) => (O(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as X, ref as h, onMounted as Y, watchEffect as g, onUnmounted as V, openBlock as q, createElementBlock as U, createVNode as j, Transition as G, withCtx as J, withDirectives as x, createElementVNode as v, normalizeStyle as m, vShow as A } from "vue";
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
    if (!this.audioBuffer)
      throw new Error("can not get duration before audio inited");
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
    const e = this.props.samplingRate, t = this.audioBuffer.numberOfChannels, a = [], n = [];
    for (let s = 0; s < t; s++)
      a.push(this.audioBuffer.getChannelData(s));
    for (let s = 0; s < e; s++) {
      const l = [0, 0];
      for (let r = 0; r < t; r++) {
        const C = Math.floor(a[r].length / e);
        l[r] = a[r][s * C];
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
    this.audioBufferSourceNode && this.stop(), this.play();
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
    var n;
    this.canvas = e, this.props = t, this.filteredData = a, this.canvas = e, this.canvasCtx = (n = this.canvas) == null ? void 0 : n.getContext("2d"), this.props = t, this.filteredData = a;
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
    a.forEach((n, s) => {
      const l = e.width / a.length, r = l * s - l / 2;
      t.moveTo(
        r,
        e.height / 2 - Math.abs(n[0]) * e.height * 0.4
      ), t.lineTo(
        r,
        e.height / 2 + Math.abs(n[0]) * e.height * 0.4
      );
    });
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.lineColor, this.canvasCtx.stroke();
  }
}
class Z extends M {
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
function W(i) {
  const e = Math.floor(i / 60), t = Math.floor(i % 60);
  return `${e}:${t < 10 ? "0" : ""}${t}`;
}
function tt(i, e) {
  const t = at(() => B(i, e), 500);
  document.addEventListener("scroll", () => t());
}
function et(i, e) {
  document.removeEventListener("scroll", () => B(i, e));
}
function B(i, e) {
  const t = window.innerHeight, a = window.scrollY, n = window.pageYOffset + i.getBoundingClientRect().top;
  n >= a - t / 4 && n - a - t < t / 4 && e();
}
function at(i, e) {
  let t;
  return () => {
    t || (t = setTimeout(() => {
      i(), t = void 0;
    }, e));
  };
}
const it = /* @__PURE__ */ X({
  __name: "IllestWaveform",
  props: {
    url: null,
    lineWidth: { default: 0.5 },
    lineCap: { default: "round" },
    lineColor: { default: "#5e5e5e" },
    samplingRate: { default: 22050 },
    cursorWidth: { default: 2 },
    cursorColor: { default: "#fff" },
    maskColor: { default: "#fff" },
    lazy: { type: Boolean, default: !0 },
    skeleton: { type: Boolean, default: !0 },
    skeletonColor: { default: "#232323" },
    interact: { type: Boolean, default: !0 }
  },
  emits: [
    "onInit",
    "onReady",
    "onPlay",
    "onPause",
    "onFinish",
    "onClick"
  ],
  setup(i, { expose: e, emit: t }) {
    const a = i, n = h(!1), s = h(null);
    Y(async () => {
      a.lazy ? (B(s.value, l), tt(
        s.value,
        l
      ), g(async () => {
        n.value && await S();
      })) : await S();
    }), V(() => {
      a.lazy && et(s.value, l);
    });
    function l() {
      n.value = !0;
    }
    const r = h(null), C = h(null), c = h(!1);
    let o, f, y;
    async function S() {
      c.value || (t("onInit", !0), await T(), await Promise.all([N(), b()]), c.value = !0, t("onReady", c.value));
    }
    async function T() {
      o = new Q(a), await o.setupAudio(), I();
    }
    async function N() {
      f = new M(
        r.value,
        a,
        await o._filterData
      ), f.setupCanvas(), g(() => {
        f._props = a, f.setCanvasStyle();
      });
    }
    async function b() {
      y = new Z(
        C.value,
        a,
        await o._filterData,
        f._canvas
      ), y.setupCanvas(), g(() => {
        y._props = a, y.setCanvasStyle();
      });
    }
    const w = h(0), p = h(0), _ = h(0);
    function k() {
      !o._playing || (requestAnimationFrame(k), p.value = o._currentTime, _.value = p.value / o._audioDuration * f._canvas.width);
    }
    function R(d) {
      !c.value || !a.interact || (w.value = d.layerX);
    }
    function z() {
      if (!c.value || !a.interact)
        return;
      _.value = w.value;
      const d = w.value / f._canvas.width * o._audioDuration;
      o.pick(d), p.value = d, t("onClick", s), t("onFinish", !1);
    }
    function H() {
      !c.value || (o.play(), t("onPlay", !0), k());
    }
    function $() {
      o.replay(), t("onFinish", !1), t("onPlay", !0), k();
    }
    function D() {
      o.pause(), t("onPause", !1);
    }
    function F() {
      t("onFinish", !0);
    }
    function I() {
      g(() => {
        p.value < o._audioDuration || (D(), F());
      });
    }
    function L() {
      return W(p.value);
    }
    function E() {
      const d = o._audioDuration;
      return W(d);
    }
    return e({
      play: H,
      pause: D,
      replay: $,
      getCurrentTime: L,
      getDuration: E
    }), (d, ot) => (q(), U("section", {
      id: "ill-wave-container",
      ref_key: "waveformContainer",
      ref: s,
      onMousemove: R,
      onClick: z
    }, [
      j(G, { name: "fade" }, {
        default: J(() => [
          x(v("div", {
            id: "ill-skeleton",
            style: m(`background-color: ${i.skeletonColor}`)
          }, [
            x(v("div", {
              id: "ill-skeleton__load",
              style: m(`background-color: ${i.skeletonColor}`)
            }, null, 4), [
              [A, !c.value]
            ])
          ], 4), [
            [A, a.skeleton && !c.value]
          ])
        ]),
        _: 1
      }),
      v("canvas", {
        id: "ill-wave",
        ref_key: "waveRef",
        ref: r
      }, null, 512),
      v("div", {
        id: "ill-waveMask-container",
        style: m(`width:${_.value}px;`)
      }, [
        v("canvas", {
          id: "ill-waveMask",
          ref_key: "maskRef",
          ref: C
        }, null, 512)
      ], 4),
      x(v("div", {
        id: "ill-cursor",
        style: m(`width:${a.cursorWidth}px; transform: translateX(${w.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [A, c.value && a.interact]
      ])
    ], 544));
  }
});
const nt = (i, e) => {
  const t = i.__vccOpts || i;
  for (const [a, n] of e)
    t[a] = n;
  return t;
}, st = /* @__PURE__ */ nt(it, [["__scopeId", "data-v-5260ed6e"]]), lt = {
  install: (i) => {
    i.component("IllestWaveform", st);
  }
};
export {
  st as IllestWaveform,
  lt as default
};
