var $ = Object.defineProperty;
var I = (i, e, t) => e in i ? $(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var l = (i, e, t) => (I(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as L, ref as d, onMounted as E, watchEffect as m, onUnmounted as P, openBlock as O, createElementBlock as X, normalizeStyle as y, createVNode as Y, Transition as V, withCtx as q, withDirectives as _, createElementVNode as C, vShow as k } from "vue";
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
      const c = e.width / a.length, u = c * o - c / 2;
      t.moveTo(
        u,
        e.height / 2 - Math.abs(n[0]) * e.height * 0.4
      ), t.lineTo(
        u,
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
    l(this, "filterData");
    l(this, "arrayBuffer");
    this.props = e, this.audioCtx = new AudioContext();
  }
  get _filterData() {
    return this.filterData;
  }
  get _audioDuration() {
    if (!this.audioBuffer)
      throw new Error("can not get duration before audio inited");
    return this.audioBuffer.duration;
  }
  async setupAudio() {
    await this.createAudioBuffer(), this.createFilterData();
  }
  async fetchAudioFile() {
    try {
      const e = await fetch(this.props.url);
      this.arrayBuffer = await e.arrayBuffer();
    } catch (e) {
      console.error(e);
    }
  }
  async createAudioBuffer() {
    this.audioBuffer = await this.audioCtx.decodeAudioData(this.arrayBuffer);
  }
  createFilterData() {
    const e = this.props.samplingRate, t = this.audioBuffer.numberOfChannels, a = [], n = [];
    for (let o = 0; o < t; o++)
      a.push(this.audioBuffer.getChannelData(o));
    for (let o = 0; o < e; o++) {
      const c = [0, 0];
      for (let u = 0; u < t; u++) {
        const r = Math.floor(a[u].length / e);
        c[u] = a[u][o * r];
      }
      n.push(c);
    }
    this.filterData = n;
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
    this.pickAt = t, this.playing && (this.stopSource(), this.play());
  }
  replay() {
    this.audioBufferSourceNode && this.stop(), this.play();
  }
  finish() {
    this.pauseAt = 0, this.stop();
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
function B(i) {
  const e = Math.floor(i / 60), t = Math.floor(i % 60);
  return `${e}:${t < 10 ? "0" : ""}${t}`;
}
function J(i, e) {
  const t = Q(() => A(i, e), 500);
  document.addEventListener("scroll", () => t());
}
function K(i, e) {
  document.removeEventListener("scroll", () => A(i, e));
}
function A(i, e) {
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
const Z = /* @__PURE__ */ L({
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
    lazy: { type: [Boolean, null], default: !0 },
    skeleton: { type: [Boolean, null], default: !0 },
    skeletonColor: { default: "#232323" },
    interact: { type: [Boolean, null], default: !0 }
  },
  emits: [
    "onInit",
    "onFetched",
    "onReady",
    "onPlay",
    "onPause",
    "onFinish",
    "onClick"
  ],
  setup(i, { expose: e, emit: t }) {
    const a = i, n = d(!1), o = d(null);
    E(async () => {
      a.lazy ? (A(o.value, c), J(
        o.value,
        c
      ), m(async () => {
        n.value && await x();
      })) : await x();
    }), P(() => {
      a.lazy && K(o.value, c);
    });
    function c() {
      n.value = !0;
    }
    const u = d(null), r = d(!1);
    let s, f;
    async function x() {
      r.value || (t("onInit", !0), await S(), await D(), r.value = !0, t("onReady", r.value));
    }
    async function S() {
      s = new G(a), await s.fetchAudioFile(), t("onFetched", !0), await s.setupAudio(), R();
    }
    async function D() {
      f = new U(
        u.value,
        a,
        s._filterData
      ), f.setupCanvas(), m(() => {
        f._props = a, f.setWaveStyle(w.value);
      });
    }
    const p = d(0), v = d(0), w = d(0);
    function g() {
      !s._playing || (requestAnimationFrame(g), v.value = s._currentTime, w.value = v.value / s._audioDuration * f._canvas.width);
    }
    function W(h) {
      !r.value || !a.interact || (h.layerX <= 0 ? p.value = 0 : h.layerX >= f._canvas.width ? p.value = f._canvas.width : p.value = h.layerX);
    }
    function T() {
      if (!r.value || !a.interact)
        return;
      w.value = p.value;
      const h = p.value / f._canvas.width * s._audioDuration;
      s.pick(h), v.value = h, t("onClick", o), t("onFinish", !1);
    }
    function b() {
      !r.value || (s.play(), t("onPlay", !0), g());
    }
    function N() {
      s.replay(), t("onFinish", !1), t("onPlay", !0), g();
    }
    function F() {
      s.pause(), t("onPause", !1);
    }
    function M() {
      s.finish(), t("onPlay", !1), t("onFinish", !0);
    }
    function R() {
      m(() => {
        v.value <= s._audioDuration || M();
      });
    }
    function z() {
      return B(v.value);
    }
    function H() {
      const h = s._audioDuration;
      return B(h);
    }
    return e({
      play: b,
      pause: F,
      replay: N,
      getCurrentTime: z,
      getDuration: H
    }), (h, at) => (O(), X("section", {
      id: "illest-wave-container",
      ref_key: "waveformContainer",
      ref: o,
      style: y(`${r.value && i.interact ? "cursor: pointer" : ""}`),
      onMousemove: W,
      onClick: T
    }, [
      Y(V, { name: "fade" }, {
        default: q(() => [
          _(C("div", {
            id: "illest-skeleton",
            style: y(`background-color: ${i.skeletonColor}`)
          }, [
            _(C("div", {
              id: "illest-skeleton__load",
              style: y(`background-color: ${i.skeletonColor}`)
            }, null, 4), [
              [k, !r.value]
            ])
          ], 4), [
            [k, a.skeleton && !r.value]
          ])
        ]),
        _: 1
      }),
      C("canvas", {
        id: "illest-wave",
        ref_key: "waveRef",
        ref: u
      }, null, 512),
      _(C("div", {
        id: "illest-cursor",
        style: y(`width:${a.cursorWidth}px; transform: translateX(${p.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [k, r.value && a.interact]
      ])
    ], 36));
  }
});
const tt = (i, e) => {
  const t = i.__vccOpts || i;
  for (const [a, n] of e)
    t[a] = n;
  return t;
}, et = /* @__PURE__ */ tt(Z, [["__scopeId", "data-v-020db612"]]), ot = {
  install: (i) => {
    i.component("IllestWaveform", et);
  }
};
export {
  et as IllestWaveform,
  ot as default
};
