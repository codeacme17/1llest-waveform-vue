class LazyLoader {
  private el: HTMLElement
  private handler: () => void
  private intersectionObserver!: IntersectionObserver
  private timer: NodeJS.Timeout | null
  private rended: boolean

  constructor(el: HTMLElement, handler: () => void) {
    this.el = el
    this.handler = handler
    this.timer = null
    this.rended = false
  }

  public observe() {
    const cb = (entries: IntersectionObserverEntry[]) => {
      if (this.rended) return this.unobserve()

      const entry = entries[0]
      const DELAY_TIME = 260

      if (entry.intersectionRatio > 0) {
        this.timer = setTimeout(() => {
          this.handler()
          this.rended = true
        }, DELAY_TIME)
      } else {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
      }
    }

    this.intersectionObserver = new IntersectionObserver(cb)
    this.intersectionObserver.observe(this.el)
  }

  public unobserve() {
    this.intersectionObserver.unobserve(this.el)
  }
}

let lz: LazyLoader

function lazyLoader(el: HTMLElement, handler: () => void) {
  lz = new LazyLoader(el, handler)
  lz.observe()
}

function unobserve() {
  lz.unobserve()
}

export { lazyLoader, unobserve }
