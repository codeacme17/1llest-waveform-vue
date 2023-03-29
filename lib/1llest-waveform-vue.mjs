var I = Object.defineProperty;
var L = (i, e, t) => e in i ? I(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var l = (i, e, t) => (L(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as $, ref as d, onMounted as E, watchEffect as g, onUnmounted as P, openBlock as O, createElementBlock as X, createVNode as Y, Transition as V, withCtx as q, withDirectives as m, createElementVNode as y, normalizeStyle as _, vShow as A } from "vue";
class U {
  constructor(e, t, a) {
    l(this, "canvasCtx");
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
    this.canvas.width = this.canvas.offsetWidth, this.canvas.height = this.canvas.offsetHeight, this.canvas.style.opacity = "1", this.canvasCtx.fillStyle = "transparent", this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  translateCanvasCtx() {
    this.canvasCtx.translate(
      this.canvas.width / this.filteredData.length,
      this.canvas.height / 2 - this.canvas.height / 2
    );
  }
  drawCanvasLines() {
    const { canvas: e, canvasCtx: t, filteredData: a } = this;
    a.forEach((n, o) => {
      const c = e.width / a.length, r = c * o - c / 2;
      t.moveTo(
        r,
        e.height / 2 - Math.abs(n[0]) * e.height * 0.4
      ), t.lineTo(
        r,
        e.height / 2 + Math.abs(n[0]) * e.height * 0.4
      );
    });
  }
  drawMask(e) {
    const { canvas: t, canvasCtx: a, props: n } = this;
    a.globalCompositeOperation = "destination-atop", a.fillStyle = n.maskColor, a.fillRect(0, 0, e, t.height);
  }
  drawWave() {
    const { canvasCtx: e, props: t } = this;
    e.lineWidth = t.lineWidth, e.lineCap = t.lineCap, e.strokeStyle = t.lineColor, e.stroke();
  }
  setWaveStyle(e) {
    const { canvas: t, canvasCtx: a } = this;
    a.clearRect(0, 0, t.width, t.height), this.drawMask(e), this.drawWave();
  }
}
class j {
  constructor(e) {
    l(this, "props");
    l(this, "audioCtx");
    l(this, "audioBuffer");
    l(this, "audioBufferSourceNode");
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
    for (let o = 0; o < t; o++)
      a.push(this.audioBuffer.getChannelData(o));
    for (let o = 0; o < e; o++) {
      const c = [0, 0];
      for (let r = 0; r < t; r++) {
        const u = Math.floor(a[r].length / e);
        c[r] = a[r][o * u];
      }
      n.push(c);
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
class G extends j {
  constructor(t) {
    super(t);
    l(this, "startAt");
    l(this, "pauseAt");
    l(this, "pickAt");
    l(this, "playing");
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
function S(i) {
  const e = Math.floor(i / 60), t = Math.floor(i % 60);
  return `${e}:${t < 10 ? "0" : ""}${t}`;
}
function J(i, e) {
  const t = Q(() => k(i, e), 500);
  document.addEventListener("scroll", () => t());
}
function K(i, e) {
  document.removeEventListener("scroll", () => k(i, e));
}
function k(i, e) {
  const t = window.innerHeight, a = window.scrollY, n = window.pageYOffset + i.getBoundingClientRect().top;
  n >= a - t / 4 && n - a - t < t / 4 && e();
}
function Q(i, e) {
  let t;
  return () => {
    t || (t = setTimeout(() => {
      i(), t = void 0;
    }, e));
  };
}
const Z = /* @__PURE__ */ $({
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
    const a = i, n = d(!1), o = d(null);
    E(async () => {
      a.lazy ? (k(o.value, c), J(
        o.value,
        c
      ), g(async () => {
        n.value && await x();
      })) : await x();
    }), P(() => {
      a.lazy && K(o.value, c);
    });
    function c() {
      n.value = !0;
    }
    const r = d(null), u = d(!1);
    let s, h;
    async function x() {
      u.value || (t("onInit", !0), await D(), await Promise.all([W()]), u.value = !0, t("onReady", u.value));
    }
    async function D() {
      s = new G(a), await s.setupAudio(), z();
    }
    async function W() {
      h = new U(
        r.value,
        a,
        await s._filterData
      ), h.setupCanvas(), g(() => {
        h._props = a, h.setWaveStyle(w.value);
      });
    }
    const v = d(0), p = d(0), w = d(0);
    function C() {
      !s._playing || (requestAnimationFrame(C), p.value = s._currentTime, w.value = p.value / s._audioDuration * h._canvas.width);
    }
    function T(f) {
      !u.value || !a.interact || (f.layerX <= 0 ? v.value = 0 : f.layerX >= h._canvas.width ? v.value = h._canvas.width : v.value = f.layerX);
    }
    function b() {
      if (!u.value || !a.interact)
        return;
      w.value = v.value;
      const f = v.value / h._canvas.width * s._audioDuration;
      s.pick(f), p.value = f, t("onClick", o), t("onFinish", !1);
    }
    function N() {
      !u.value || (s.play(), t("onPlay", !0), C());
    }
    function M() {
      s.replay(), t("onFinish", !1), t("onPlay", !0), C();
    }
    function B() {
      s.pause(), t("onPause", !1);
    }
    function R() {
      t("onFinish", !0);
    }
    function z() {
      g(() => {
        p.value < s._audioDuration || (B(), R());
      });
    }
    function H() {
      return S(p.value);
    }
    function F() {
      const f = s._audioDuration;
      return S(f);
    }
    return e({
      play: N,
      pause: B,
      replay: M,
      getCurrentTime: H,
      getDuration: F
    }), (f, at) => (O(), X("section", {
      id: "illest-wave-container",
      ref_key: "waveformContainer",
      ref: o,
      onMousemove: T,
      onClick: b
    }, [
      Y(V, { name: "fade" }, {
        default: q(() => [
          m(y("div", {
            id: "illest-skeleton",
            style: _(`background-color: ${i.skeletonColor}`)
          }, [
            m(y("div", {
              id: "illest-skeleton__load",
              style: _(`background-color: ${i.skeletonColor}`)
            }, null, 4), [
              [A, !u.value]
            ])
          ], 4), [
            [A, a.skeleton && !u.value]
          ])
        ]),
        _: 1
      }),
      y("canvas", {
        id: "illest-wave",
        ref_key: "waveRef",
        ref: r
      }, null, 512),
      m(y("div", {
        id: "illest-cursor",
        style: _(`width:${a.cursorWidth}px; transform: translateX(${v.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [A, u.value && a.interact]
      ])
    ], 544));
  }
});
const tt = (i, e) => {
  const t = i.__vccOpts || i;
  for (const [a, n] of e)
    t[a] = n;
  return t;
}, et = /* @__PURE__ */ tt(Z, [["__scopeId", "data-v-d8823252"]]), ot = {
  install: (i) => {
    i.component("IllestWaveform", et);
  }
};
export {
  et as IllestWaveform,
  ot as default
};
