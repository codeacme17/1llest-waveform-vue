var L = Object.defineProperty;
var M = (a, e, t) => e in a ? L(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var s = (a, e, t) => (M(a, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as O, ref as h, onMounted as G, watchEffect as g, onUnmounted as $, openBlock as V, createElementBlock as P, normalizeStyle as y, createVNode as U, Transition as X, withCtx as H, withDirectives as w, createElementVNode as m, vShow as A } from "vue";
class q {
  constructor(e, t, i) {
    s(this, "canvasCtx");
    var n;
    this.canvas = e, this.props = t, this.filteredData = i, this.canvas = e, this.canvasCtx = (n = this.canvas) == null ? void 0 : n.getContext("2d"), this.props = t, this.filteredData = i;
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
    const { canvas: e, canvasCtx: t, filteredData: i } = this;
    i.forEach((n, c) => {
      const d = e.width / i.length, v = d * c - d / 2;
      t.moveTo(
        v,
        e.height / 2 - Math.abs(n) * e.height * 0.4
      ), t.lineTo(
        v,
        e.height / 2 + Math.abs(n) * e.height * 0.4
      );
    });
  }
  drawMask(e) {
    const { canvas: t, canvasCtx: i, props: n } = this;
    i.globalCompositeOperation = "destination-atop", i.fillStyle = n.maskColor, i.fillRect(0, 0, e, t.height);
  }
  drawWave() {
    const { canvasCtx: e, props: t } = this;
    e.lineWidth = t.lineWidth, e.lineCap = t.lineCap, e.strokeStyle = t.lineColor, e.stroke();
  }
  setWaveStyle(e) {
    const { canvas: t, canvasCtx: i } = this;
    i.clearRect(0, 0, t.width, t.height), this.drawMask(e), this.drawWave();
  }
}
class Y {
  constructor(e) {
    s(this, "props");
    s(this, "audioCtx");
    s(this, "audioBuffer");
    s(this, "gainNode");
    s(this, "filteredData");
    s(this, "arrayBuffer");
    this.props = e, this.audioCtx = new AudioContext();
  }
  get _filteredData() {
    return this.filteredData;
  }
  get _audioDuration() {
    if (!this.audioBuffer)
      throw new Error("can not get duration before audio inited");
    return this.audioBuffer.duration;
  }
  async setupAudio() {
    await this.createAudioBuffer(), this.createFilterData(), this.createGainNode();
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
  createGainNode() {
    this.gainNode = this.audioCtx.createGain(), this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
  }
  createFilterData() {
    const e = this.props.samplingRate, t = [], i = this.audioBuffer.getChannelData(0);
    for (let n = 0; n < e; n++) {
      const c = Math.floor(i.length / e), d = i[n * c];
      t.push(d);
    }
    this.filteredData = t;
  }
}
function j(a) {
  return new Promise((e) => setTimeout(e, a));
}
class J extends Y {
  constructor(t) {
    super(t);
    s(this, "startAt");
    s(this, "pauseAt");
    s(this, "pickAt");
    s(this, "playing");
    s(this, "audioBufferSourceNode");
    s(this, "FADE_DURATION");
    this.startAt = 0, this.pauseAt = 0, this.pickAt = 0, this.playing = !1, this.FADE_DURATION = this.props.fade ? 0.08 : 0;
  }
  get _playing() {
    return this.playing;
  }
  get _currentTime() {
    return this.pauseAt ? this.pauseAt : this.startAt ? this.audioCtx.currentTime - this.startAt : this.audioCtx.currentTime;
  }
  play() {
    this.disconnectDestination(), this.createAudioBufferSourceNode(), this.connectDestination();
    const t = this.pickAt ? this.pickAt : this.pauseAt;
    this.audioBufferSourceNode.start(0, t), this.startAt = this.audioCtx.currentTime - t, this.pauseAt = 0, this.playing = !0, this.props.fade ? (this.setGainValue(0), this.setGainLinearRamp(1)) : this.setGainValue(1);
  }
  async pause() {
    const t = this.audioCtx.currentTime - this.startAt;
    this.props.fade && (this.setGainLinearRamp(0), await j(this.FADE_DURATION * 1e3)), this.disconnectDestination(), this.initializeState(), this.pauseAt = t + this.FADE_DURATION;
  }
  pick(t) {
    this.pickAt = t, this.playing && (this.disconnectDestination(), this.play());
  }
  replay() {
    this.audioBufferSourceNode && (this.disconnectDestination(), this.initializeState()), this.play();
  }
  finish() {
    this.pauseAt = 0, this.disconnectDestination(), this.initializeState();
  }
  initializeState() {
    this.playing = !1, this.startAt = 0, this.pauseAt = 0, this.pickAt = 0;
  }
  createAudioBufferSourceNode() {
    this.audioBufferSourceNode || (this.audioBufferSourceNode = this.audioCtx.createBufferSource(), this.audioBufferSourceNode.buffer = this.audioBuffer);
  }
  connectDestination() {
    !this.audioBufferSourceNode || (this.audioBufferSourceNode.connect(this.gainNode), this.gainNode.connect(this.audioCtx.destination));
  }
  disconnectDestination() {
    !this.audioBufferSourceNode || (this.audioBufferSourceNode.disconnect(), this.audioBufferSourceNode.stop(), this.audioBufferSourceNode = null);
  }
  setGainValue(t) {
    this.gainNode.gain.setValueAtTime(t, this.audioCtx.currentTime);
  }
  setGainLinearRamp(t) {
    this.gainNode.gain.linearRampToValueAtTime(
      t,
      this.audioCtx.currentTime + this.FADE_DURATION
    );
  }
}
function x(a) {
  const e = Math.floor(a / 60), t = Math.floor(a % 60);
  return `${e}:${t < 10 ? "0" : ""}${t}`;
}
class K {
  constructor(e, t) {
    s(this, "el");
    s(this, "handler");
    s(this, "intersectionObserver");
    s(this, "timer");
    s(this, "rended");
    this.el = e, this.handler = t, this.timer = null, this.rended = !1;
  }
  observe() {
    const e = (t) => {
      if (this.rended)
        return this.unobserve();
      const i = t[0], n = 260;
      i.intersectionRatio > 0 ? this.timer = setTimeout(() => {
        this.handler(), this.rended = !0;
      }, n) : this.timer && (clearTimeout(this.timer), this.timer = null);
    };
    this.intersectionObserver = new IntersectionObserver(e), this.intersectionObserver.observe(this.el);
  }
  unobserve() {
    this.intersectionObserver.unobserve(this.el);
  }
}
let D;
function Q(a, e) {
  D = new K(a, e), D.observe();
}
function Z() {
  D.unobserve();
}
const tt = /* @__PURE__ */ O({
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
    interact: { type: [Boolean, null], default: !0 },
    fade: { type: [Boolean, null], default: !0 }
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
  setup(a, { expose: e, emit: t }) {
    const i = a, n = h(!1), c = h(null);
    G(async () => {
      i.lazy ? (Q(c.value, d), g(async () => {
        n.value && await k();
      })) : await k();
    }), $(() => {
      i.lazy && Z(), o && o.pause();
    });
    function d() {
      n.value = !0;
    }
    const v = h(null), r = h(!1);
    let o, l;
    async function k() {
      r.value || (t("onInit", !0), await B(), await T(), r.value = !0, t("onReady", r.value));
    }
    async function B() {
      o = new J(i), await o.fetchAudioFile(), t("onFetched", !0), await o.setupAudio(), I();
    }
    async function T() {
      l = new q(
        v.value,
        i,
        o._filteredData
      ), l.setupCanvas(), g(() => {
        l._props = i, l.setWaveStyle(_.value);
      });
    }
    const f = h(0), p = h(0), _ = h(0);
    function C() {
      !o._playing || (requestAnimationFrame(C), p.value = o._currentTime, _.value = p.value / o._audioDuration * l._canvas.width);
    }
    function N(u) {
      !r.value || !i.interact || (u.layerX <= 0 ? f.value = 0 : u.layerX >= l._canvas.width ? f.value = l._canvas.width : f.value = u.layerX);
    }
    function S() {
      if (!r.value || !i.interact)
        return;
      _.value = f.value;
      const u = f.value / l._canvas.width * o._audioDuration;
      o.pick(u), p.value = u, t("onClick", c), t("onFinish", !1);
    }
    function b() {
      !r.value || (o.play(), t("onPlay", !0), C());
    }
    function W() {
      o.replay(), t("onFinish", !1), t("onPlay", !0), C();
    }
    function R() {
      o.pause(), t("onPause", !1);
    }
    function F() {
      o.finish(), t("onPlay", !1), t("onFinish", !0);
    }
    function I() {
      g(() => {
        p.value <= o._audioDuration || F();
      });
    }
    function z() {
      return x(p.value);
    }
    function E() {
      const u = o._audioDuration;
      return x(u);
    }
    return e({
      play: b,
      pause: R,
      replay: W,
      getCurrentTime: z,
      getDuration: E
    }), (u, at) => (V(), P("section", {
      id: "illest-waveform",
      ref_key: "__illestWaveformRef__",
      ref: c,
      style: y(`${r.value && a.interact ? "cursor: pointer" : ""}`),
      onMousemove: N,
      onClick: S
    }, [
      U(X, { name: "fade" }, {
        default: H(() => [
          w(m("div", {
            id: "illest-waveform__skeleton",
            style: y(`background-color: ${a.skeletonColor}`)
          }, [
            w(m("div", {
              id: "illest-waveform__skeleton__load",
              style: y(`background-color: ${a.skeletonColor}`)
            }, null, 4), [
              [A, !r.value]
            ])
          ], 4), [
            [A, i.skeleton && !r.value]
          ])
        ]),
        _: 1
      }),
      m("canvas", {
        id: "illest-waveform__view",
        ref_key: "waveRef",
        ref: v
      }, null, 512),
      w(m("div", {
        id: "illest-waveform__cursor",
        style: y(`width:${i.cursorWidth}px; transform: translateX(${f.value}px);background-color: ${i.cursorColor}; `)
      }, null, 4), [
        [A, r.value && i.interact]
      ])
    ], 36));
  }
});
const et = (a, e) => {
  const t = a.__vccOpts || a;
  for (const [i, n] of e)
    t[i] = n;
  return t;
}, it = /* @__PURE__ */ et(tt, [["__scopeId", "data-v-6d613eae"]]), ot = {
  install: (a) => {
    a.component("IllestWaveform", it);
  }
};
export {
  it as IllestWaveform,
  ot as default
};
