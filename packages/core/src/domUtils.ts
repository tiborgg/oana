import { DOMTarget } from './domSchema';

function unwrapTarget<T extends Element = Element, TResult = any>(
  target: DOMTarget<T>,
  func: (elem: T) => TResult): TResult | null {

  const elem = resolveDomTarget<T>(target);
  if (!elem)
    return null;
  return func(elem);
}

/**
 * Utility for resolving a reference to a DOM element to the element itself.
 * The reference can already be the element itself.
 * @param target  The reference to resolve.
 * @returns       The HTMLElement or SVGElement if the reference is valid and null otherwise.
 */
export function resolveDomTarget<T extends Element = Element>(
  target: DOMTarget<T>): T | null {

  if (
    target instanceof HTMLElement ||
    target instanceof SVGElement)
    return target as T;

  if ('current' in target)
    return target.current || null;

  return null;
}


// #region Scrolling
export function isScrolled<T extends Element = Element>(
  elem: T,
  delta: number = 0) {

  return elem.scrollTop > delta;
}

/** 
 * Returns true if a container is scrolled to the bottom of its scrollable region.
 * @param target  The container element.
 * @param delta   The threshold value, in pixels, below which the function will return true.
 *                Used when you want to already trigger an event shortly before the user reaches 
 *                the actual bottom of the scrollable region.
 * @returns       The result of the computation, or false if the target cannot be resolved to a valid element.
 */
export function isScrolledToBottom<T extends Element = Element>(
  elem: T,
  delta: number = 0) {

  return (elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) <= delta;
}

/** 
 * Returns true if a container is scrolled to the right of its scrollable region.
 * @param target  The container element.
 * @param delta   The threshold value, in pixels, below which the function will return true.
 *                Used when you want to already trigger an event shortly before the user reaches 
 *                the actual bottom of the scrollable region.
 * @returns       The result of the computation, or false if the target cannot be resolved to a valid element.
 */
export function isScrolledToRight(
  elem: Element,
  delta: number = 0) {

  return (elem.scrollWidth - (elem.scrollLeft + elem.clientWidth)) <= delta;
}

/** Helper for `isScrolledToBottom` in which the container can be a DOMTarget. */
export function isTargetScrolledToBottom<T extends Element = Element>(
  target: DOMTarget<T>,
  delta: number = 0) {
  return unwrapTarget(target, (elem) => isScrolledToBottom(elem, delta)) || false;
}

/** Helper for `isScrolled` in which the container can be a DOMTarget. */
export function isTargetScrolled<T extends Element = Element>(
  target: DOMTarget<T>,
  delta: number = 0) {
  return unwrapTarget(target, (elem) => isScrolled(elem, delta)) || false;
}

/** Helper for `isScrolledToRight` in which the container can be a DOMTarget. */
export function isTargetScrolledToRight<T extends Element = Element>(
  target: DOMTarget<T>,
  delta: number = 0) {
  return unwrapTarget(target, (elem) => isScrolledToRight(elem, delta)) || false;
}
// #endregion