/** 
 * Represents an actual DOM element or some sort of supported reference to it, like a React ref or a RefProxy.
 */
export type DOMTarget<T extends Element = Element> =
  T |
  React.RefObject<T>;