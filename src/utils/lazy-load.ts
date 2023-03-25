function registerScrollHander(el: HTMLElement, handler: () => void) {
  document.addEventListener('scroll', () => lazyLoader(el, handler))
}

function canelScrollHander(el: HTMLElement, handler: () => void) {
  document.removeEventListener('scroll', () => lazyLoader(el, handler))
}

function lazyLoader(el: HTMLElement, handler: () => void): void {
  const windowHeight: number = window.innerHeight
  const windowOffY: number = window.scrollY
  const elDistanceToTop: number =
    window.pageYOffset + el.getBoundingClientRect().top

  if (
    elDistanceToTop >= windowOffY - windowHeight / 2 &&
    elDistanceToTop - windowOffY - windowHeight < windowHeight / 2
  )
    handler()
}

export { registerScrollHander, canelScrollHander, lazyLoader }
