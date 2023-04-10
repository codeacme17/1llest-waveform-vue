class LazyLoader {
  private el: HTMLElement
  private handler: () => void
  private intersectionObserver!: IntersectionObserver

  constructor(el: HTMLElement, handler: () => void) {
    this.el = el
    this.handler = handler
  }

  public observe() {
    const { el, handler } = this

    const cb = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry.intersectionRatio > 0) handler()
    }

    this.intersectionObserver = new IntersectionObserver(cb)
    this.intersectionObserver.observe(el)
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
