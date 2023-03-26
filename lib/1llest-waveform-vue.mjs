var E = Object.defineProperty;
var O = (a, e, t) => e in a ? E(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var u = (a, e, t) => (O(a, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as X, ref as h, onMounted as Y, watchEffect as m, onUnmounted as V, openBlock as q, createElementBlock as U, normalizeStyle as C, createVNode as j, Transition as G, withCtx as J, withDirectives as x, createElementVNode as v, vShow as A } from "vue";
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
    const e = this.props.samplingRate, t = this.audioBuffer.numberOfChannels, s = [], i = [];
    for (let n = 0; n < t; n++)
      s.push(this.audioBuffer.getChannelData(n));
    for (let n = 0; n < e; n++) {
      const c = [0, 0];
      for (let r = 0; r < t; r++) {
        const y = Math.floor(s[r].length / e);
        c[r] = s[r][n * y];
      }
      i.push(c);
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
  constructor(e, t, s) {
    u(this, "canvasCtx");
    var i;
    this.canvas = e, this.props = t, this.filteredData = s, this.canvas = e, this.canvasCtx = (i = this.canvas) == null ? void 0 : i.getContext("2d"), this.props = t, this.filteredData = s;
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
    const { canvas: e, canvasCtx: t, filteredData: s } = this;
    s.forEach((i, n) => {
      const c = e.width / s.length, r = c * n - c / 2;
      t.moveTo(
        r,
        e.height / 2 - Math.abs(i[0]) * e.height * 0.4
      ), t.lineTo(
        r,
        e.height / 2 + Math.abs(i[0]) * e.height * 0.4
      );
    });
  }
  setCanvasStyle() {
    this.canvasCtx.lineWidth = this.props.lineWidth, this.canvasCtx.lineCap = this.props.lineCap, this.canvasCtx.strokeStyle = this.props.lineColor, this.canvasCtx.stroke();
  }
}
class Z extends M {
  constructor(t, s, i, n) {
    super(t, s, i);
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
function W(a) {
  const e = Math.floor(a / 60), t = Math.floor(a % 60);
  return `${e}:${t < 10 ? "0" : ""}${t}`;
}
function tt(a, e) {
  const t = at(() => B(a, e), 500);
  document.addEventListener("scroll", () => t());
}
function et(a, e) {
  document.removeEventListener("scroll", () => B(a, e));
}
function B(a, e) {
  const t = window.innerHeight, s = window.scrollY, i = window.pageYOffset + a.getBoundingClientRect().top;
  i >= s - t / 4 && i - s - t < t / 4 && e();
}
function at(a, e) {
  let t;
  return () => {
    t || (t = setTimeout(() => {
      a(), t = void 0;
    }, e));
  };
}
const st = /* @__PURE__ */ X({
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
    skeletonColor: { default: "#232323" }
  },
  emits: [
    "onInit",
    "onReady",
    "onPlay",
    "onPause",
    "onFinish",
    "onClick"
  ],
  setup(a, { expose: e, emit: t }) {
    const s = a, i = h(!1), n = h(null);
    Y(async () => {
      s.lazy ? (B(n.value, c), tt(
        n.value,
        c
      ), m(async () => {
        i.value && await S();
      })) : await S();
    }), V(() => {
      s.lazy && et(n.value, c);
    });
    function c() {
      i.value = !0;
    }
    const r = h(null), y = h(null), l = h(!1);
    let o, f, w;
    async function S() {
      l.value || (t("onInit", !0), await T(), await Promise.all([b(), N()]), l.value = !0, t("onReady", l.value));
    }
    async function T() {
      o = new Q(s), await o.setupAudio(), I();
    }
    async function b() {
      f = new M(
        r.value,
        s,
        await o._filterData
      ), f.setupCanvas(), m(() => {
        f._props = s, f.setCanvasStyle();
      });
    }
    async function N() {
      w = new Z(
        y.value,
        s,
        await o._filterData,
        f._canvas
      ), w.setupCanvas(), m(() => {
        w._props = s, w.setCanvasStyle();
      });
    }
    const g = h(0), p = h(0), _ = h(0);
    function k() {
      !o._playing || (requestAnimationFrame(k), p.value = o._currentTime, _.value = p.value / o._audioDuration * f._canvas.width);
    }
    function R(d) {
      !l.value || (g.value = d.layerX);
    }
    function $() {
      if (!l.value)
        return;
      _.value = g.value;
      const d = g.value / f._canvas.width * o._audioDuration;
      o.pick(d), p.value = d, t("onClick", n), t("onFinish", !1);
    }
    function z() {
      !l.value || (o.play(), t("onPlay", !0), k());
    }
    function H() {
      o.replay(), t("onFinish", !1), t("onPlay", !0), k();
    }
    function D() {
      o.pause(), t("onPause", !1);
    }
    function F() {
      t("onFinish", !0);
    }
    function I() {
      m(() => {
        p.value < o._audioDuration || (D(), F());
      });
    }
    function L() {
      return W(p.value);
    }
    function P() {
      const d = o._audioDuration;
      return W(d);
    }
    return e({
      play: z,
      pause: D,
      replay: H,
      getCurrentTime: L,
      getDuration: P
    }), (d, ot) => (q(), U("section", {
      id: "ill-wave-container",
      ref_key: "waveformContainer",
      ref: n,
      style: C(`${l.value ? "cursor: pointer" : "cursor: progress;"}`),
      onMousemove: R,
      onClick: $
    }, [
      j(G, { name: "fade" }, {
        default: J(() => [
          x(v("div", {
            id: "ill-skeleton",
            style: C(`background-color: ${a.skeletonColor}`)
          }, [
            x(v("div", {
              id: "ill-skeleton__load",
              style: C(`background-color: ${a.skeletonColor}`)
            }, null, 4), [
              [A, !l.value]
            ])
          ], 4), [
            [A, s.skeleton && !l.value]
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
        style: C(`width:${_.value}px;`)
      }, [
        v("canvas", {
          id: "ill-waveMask",
          ref_key: "maskRef",
          ref: y
        }, null, 512)
      ], 4),
      x(v("div", {
        id: "ill-cursor",
        style: C(`width:${s.cursorWidth}px; transform: translateX(${g.value}px);background-color: ${s.cursorColor}; `)
      }, null, 4), [
        [A, l.value]
      ])
    ], 36));
  }
});
const it = (a, e) => {
  const t = a.__vccOpts || a;
  for (const [s, i] of e)
    t[s] = i;
  return t;
}, nt = /* @__PURE__ */ it(st, [["__scopeId", "data-v-528b7817"]]), lt = {
  install: (a) => {
    a.component("IllestWaveform", nt);
  }
};
export {
  nt as IllestWaveform,
  lt as default
};
