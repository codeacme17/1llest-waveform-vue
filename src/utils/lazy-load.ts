/** Registers a scroll event listener on the document that checks if the given
    element is in view and calls the provided handler if it is.
*/
function registerScrollHander(el: HTMLElement, handler: () => void) {
  document.addEventListener('scroll', () => lazyLoader(el, handler))
}

/** Removes the scroll event listener on the document that was previously added
    with registerScrollHandler.
*/
function canelScrollHander(el: HTMLElement, handler: () => void) {
  document.removeEventListener('scroll', () => lazyLoader(el, handler))
}

/** Checks if the given element is in view, and if it is, calls the provided handler.
 */
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
