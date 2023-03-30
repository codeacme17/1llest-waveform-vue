var $ = Object.defineProperty;
var I = (i, e, t) => e in i ? $(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var u = (i, e, t) => (I(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as L, ref as d, onMounted as E, watchEffect as m, onUnmounted as O, openBlock as P, createElementBlock as X, normalizeStyle as y, createVNode as Y, Transition as V, withCtx as q, withDirectives as _, createElementVNode as C, vShow as A } from "vue";
class U {
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
      const c = e.width / a.length, l = c * o - c / 2;
      t.moveTo(
        l,
        e.height / 2 - Math.abs(n[0]) * e.height * 0.4
      ), t.lineTo(
        l,
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
    u(this, "props");
    u(this, "audioCtx");
    u(this, "audioBuffer");
    u(this, "audioBufferSourceNode");
    u(this, "filterData");
    u(this, "response");
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
      this.response = await fetch(this.props.url);
    } catch (e) {
      console.error(e);
    }
  }
  async createAudioBuffer() {
    const e = await this.response.arrayBuffer();
    this.audioBuffer = await this.audioCtx.decodeAudioData(e);
  }
  createFilterData() {
    const e = this.props.samplingRate, t = this.audioBuffer.numberOfChannels, a = [], n = [];
    for (let o = 0; o < t; o++)
      a.push(this.audioBuffer.getChannelData(o));
    for (let o = 0; o < e; o++) {
      const c = [0, 0];
      for (let l = 0; l < t; l++) {
        const r = Math.floor(a[l].length / e);
        c[l] = a[l][o * r];
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
function D(i) {
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
      a.lazy ? (k(o.value, c), J(
        o.value,
        c
      ), m(async () => {
        n.value && await x();
      })) : await x();
    }), O(() => {
      a.lazy && K(o.value, c);
    });
    function c() {
      n.value = !0;
    }
    const l = d(null), r = d(!1);
    let s, f;
    async function x() {
      r.value || (t("onInit", !0), await S(), await W(), r.value = !0, t("onReady", r.value));
    }
    async function S() {
      s = new G(a), await s.fetchAudioFile(), t("onFetched", !0), await s.setupAudio(), R();
    }
    async function W() {
      f = new U(
        l.value,
        a,
        s._filterData
      ), f.setupCanvas(), m(() => {
        f._props = a, f.setWaveStyle(w.value);
      });
    }
    const v = d(0), p = d(0), w = d(0);
    function g() {
      !s._playing || (requestAnimationFrame(g), p.value = s._currentTime, w.value = p.value / s._audioDuration * f._canvas.width);
    }
    function T(h) {
      !r.value || !a.interact || (h.layerX <= 0 ? v.value = 0 : h.layerX >= f._canvas.width ? v.value = f._canvas.width : v.value = h.layerX);
    }
    function N() {
      if (!r.value || !a.interact)
        return;
      w.value = v.value;
      const h = v.value / f._canvas.width * s._audioDuration;
      s.pick(h), p.value = h, t("onClick", o), t("onFinish", !1);
    }
    function b() {
      !r.value || (s.play(), t("onPlay", !0), g());
    }
    function F() {
      s.replay(), t("onFinish", !1), t("onPlay", !0), g();
    }
    function B() {
      s.pause(), t("onPause", !1);
    }
    function M() {
      t("onFinish", !0);
    }
    function R() {
      m(() => {
        p.value < s._audioDuration || (B(), M());
      });
    }
    function z() {
      return D(p.value);
    }
    function H() {
      const h = s._audioDuration;
      return D(h);
    }
    return e({
      play: b,
      pause: B,
      replay: F,
      getCurrentTime: z,
      getDuration: H
    }), (h, at) => (P(), X("section", {
      id: "illest-wave-container",
      ref_key: "waveformContainer",
      ref: o,
      style: y(`${r.value && i.interact ? "cursor: pointer" : ""}`),
      onMousemove: T,
      onClick: N
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
              [A, !r.value]
            ])
          ], 4), [
            [A, a.skeleton && !r.value]
          ])
        ]),
        _: 1
      }),
      C("canvas", {
        id: "illest-wave",
        ref_key: "waveRef",
        ref: l
      }, null, 512),
      _(C("div", {
        id: "illest-cursor",
        style: y(`width:${a.cursorWidth}px; transform: translateX(${v.value}px);background-color: ${a.cursorColor}; `)
      }, null, 4), [
        [A, r.value && a.interact]
      ])
    ], 36));
  }
});
const tt = (i, e) => {
  const t = i.__vccOpts || i;
  for (const [a, n] of e)
    t[a] = n;
  return t;
}, et = /* @__PURE__ */ tt(Z, [["__scopeId", "data-v-10d3d361"]]), ot = {
  install: (i) => {
    i.component("IllestWaveform", et);
  }
};
export {
  et as IllestWaveform,
  ot as default
};
