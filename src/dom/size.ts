export function getBoundingClientRect(element: Element): DOMRect | undefined {
  if (!element || !element.getBoundingClientRect) {
    return
  }
  return element.getBoundingClientRect()
}
