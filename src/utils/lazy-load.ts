// Registers a scroll event listener on the document that checks if the given
// element is in view and calls the provided handler if it is.
function registerScrollHander(el: HTMLElement, handler: () => void) {
  const throttledHandler = throttle(() => lazyLoader(el, handler), 500)
  document.addEventListener('scroll', () => throttledHandler())
}

// Removes the scroll event listener on the document that was previously added
// with registerScrollHandler.
function canelScrollHander(el: HTMLElement, handler: () => void) {
  document.removeEventListener('scroll', () => lazyLoader(el, handler))
}

// Checks if the given element is in view, and if it is, calls the provided handler.
function lazyLoader(el: HTMLElement, handler: () => void): void {
  const windowHeight: number = window.innerHeight
  const windowOffY: number = window.scrollY
  const elDistanceToTop: number =
    window.pageYOffset + el.getBoundingClientRect().top

  if (
    elDistanceToTop >= windowOffY - windowHeight / 4 &&
    elDistanceToTop - windowOffY - windowHeight < windowHeight / 4
  )
    handler()
}

// Throttle function that delays the execution of the given function until a certain time has passed since the last time it was called.
function throttle(func: () => void, delay: number): () => void {
  let timeout: NodeJS.Timeout | undefined
  return () => {
    if (!timeout)
      timeout = setTimeout(() => {
        func()
        timeout = undefined
      }, delay)
  }
}

export { registerScrollHander, canelScrollHander, lazyLoader }
