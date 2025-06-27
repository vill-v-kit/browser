/**
 * {@link https://github.com/vueComponent/ant-design-vue/blob/next/components/_util/easings.ts}
 * @param t
 * @param b
 * @param c
 * @param d
 */
export function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return (cc / 2) * t * t * t + b
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b
}
