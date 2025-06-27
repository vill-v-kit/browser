import { isWindow } from '@vill-v/vanilla'

/**
 * 获取滚动距离<br/>
 * {@link https://github.com/vueComponent/ant-design-vue/blob/next/components/_util/getScroll.ts}
 * @param target
 * @param top
 */
export function getScroll(target: HTMLElement | Window | Document | null, top: boolean): number {
  if (typeof window === 'undefined') {
    return 0
  }
  const method = top ? 'scrollTop' : 'scrollLeft'
  let result: any = 0
  if (isWindow(target)) {
    result = (target as Window)[top ? 'pageYOffset' : 'pageXOffset']
  } else if (target instanceof Document) {
    result = target.documentElement[method]
  } else if (target) {
    result = (target as HTMLElement)[method]
  }
  if (target && !isWindow(target) && typeof result !== 'number') {
    result = ((target as HTMLElement).ownerDocument || (target as Document)).documentElement?.[
      method
    ]
  }
  return result
}
