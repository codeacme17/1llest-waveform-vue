var G = Object.defineProperty;
var H = (i, e, t) => e in i ? G(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var o = (i, e, t) => (H(i, typeof e != "symbol" ? e + "" : e, t), t);
import { defineComponent as $, ref as f, onMounted as I, watchEffect as w, onUnmounted as V, openBlock as E, createElementBlock as P, normalizeStyle as y, createVNode as X, Transition as O, withCtx as Y, withDirectives as _, createElementVNode as g, vShow as A } from "vue";
class q {
  constructor(e, t, a) {
    o(this, "canvasCtx");
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
    a.forEach((n, u) => {
      const c = e.width / a.length, p = c * u - c / 2;
      t.moveTo(
        p,
        e.height / 2 - Math.abs(n) * e.height * 0.4
      ), t.lineTo(
        p,
        e.height / 2 + Math.abs(n) * e.height * 0.4
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
class U {
  constructor(e) {
    o(this, "props");
    o(this, "audioCtx");
    o(this, "audioBuffer");
    o(this, "gainNode");
    o(this, "filteredData");
    o(this, "arrayBuffer");
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
    const e = this.props.samplingRate, t = [], a = this.audioBuffer.getChannelData(0);
    for (let n = 0; n < e; n++) {
      const u = Math.floor(a.length / e), c = a[n * u];
      t.push(c);
    }
    this.filteredData = t;
  }
}
class j extends U {
  constructor(t) {
    super(t);
    o(this, "startAt");
    o(this, "pauseAt");
    o(this, "pickAt");
    o(this, "playing");
    o(this, "audioBufferSourceNode");
    this.startAt = 0, this.pauseAt = 0, this.pickAt = 0, this.playing = !1;
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
    if (this.audioBufferSourceNode.start(0, t), this.startAt = this.audioCtx.currentTime - t, this.pauseAt = 0, this.playing = !0, !this.props.fade) {
      this.setGainValue(1);
      return;
    }
    this.setGainValue(0), this.setGainLinearRamp(1);
  }
  pause() {
    const t = this.audioCtx.currentTime - this.startAt;
    this.disconnectDestination(), this.initializeState(), this.pauseAt = t, this.props.fade && this.setGainLinearRamp(0);
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
      this.audioCtx.currentTime + this.props.fadeDuration
    );
  }
}
function B(i) {
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
    lazy: { type: [Boolean, null], default: !0 },
    skeleton: { type: [Boolean, null], default: !0 },
    skeletonColor: { default: "#232323" },
    interact: { type: [Boolean, null], default: !0 },
    fade: { type: [Boolean, null], default: !0 },
    fadeDuration: { default: 0.2 }
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
    const a = i, n = f(!1), u = f(null);
    I(async () => {
      a.lazy ? (k(u.value, c), J(
        u.value,
        c
      ), w(async () => {
        n.value && await x();
      })) : await x();
    }), V(() => {
      a.lazy && K(
        u.value,
        c
      );
    });
    function c() {
      n.value = !0;
    }
    const p = f(null), r = f(!1);
    let s, d;
    async function x() {
      r.value || (t("onInit", !0), await D(), await S(), r.value = !0, t("onReady", r.value));
    }
    async function D() {
      s = new j(a), await s.fetchAudioFile(), t("onFetched", !0), await s.setupAudio(), z();
    }
    async function S() {
      d = new q(
        p.value,
        a,
        s._filteredData
      ), d.setupCanvas(), w(() => {
        d._props = a, d.setWaveStyle(m.value);
      });
    }
    const h = f(0), v = f(0), m = f(0);
    function C() {
      !s._playing || (requestAnimationFrame(C), v.value = s._currentTime, m.value = v.value / s._audioDuration * d._canvas.width);
    }
    function N(l) {
      !r.value || !a.interact || (l.layerX <= 0 ? h.value = 0 : l.layerX >= d._canvas.width ? h.value = d._canvas.width : h.value = l.layerX);
    }
    function T() {
      if (!r.value || !a.interact)
        return;
      m.value = h.value;
      const l = h.value / d._canvas.width * s._audioDuration;
      s.pick(l), v.value = l, t("onClick", u), t("onFinish", !1);
    }
    function W() {
      !r.value || (s.play(), t("onPlay", !0), C());
    }
    function R() {
      s.replay(), t("onFinish", !1), t("onPlay", !0), C();
    }
    function F() {
      s.pause(), t("onPause", !1);
    }
    function b() {
      s.finish(), t("onPlay", !1), t("onFinish", !0);
    }
    function z() {
      w(() => {
        v.value <= s._audioDuration || b();
      });
    }
    function L() {
      return B(v.value);
    }
    function M() {
      const l = s._audioDuration;
      return B(l);
    }
    return e({
      play: W,
      pause: F,
      replay: R,
      getCurrentTime: L,
      getDuration: M
    }), (l, at) => (E(), P("section", {
      id: "illest-waveform",
      ref_key: "__illestWaveformRef__",
      ref: u,
      style: y(`${r.value && i.interact ? "cursor: pointer" : ""}`),
      onMousemove: N,
      onClick: T
    }, [
      X(O, { name: "fade" }, {
        default: Y(() => [
          _(g("div", {
            id: "illest-waveform__skeleton",
            style: y(`background-color: ${i.skeletonColor}`)
          }, [
            _(g("div", {
              id: "illest-waveform__skeleton__load",
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
      g("canvas", {
        id: "illest-waveform__view",
        ref_key: "waveRef",
        ref: p
      }, null, 512),
      _(g("div", {
        id: "illest-waveform__cursor",
        style: y(`width:${a.cursorWidth}px; transform: translateX(${h.value}px);background-color: ${a.cursorColor}; `)
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
}, et = /* @__PURE__ */ tt(Z, [["__scopeId", "data-v-e94a6d00"]]), st = {
  install: (i) => {
    i.component("IllestWaveform", et);
  }
};
export {
  et as IllestWaveform,
  st as default
};
