import { isWindow } from '@vill-v/vanilla'
import { wrapperRaf as raf } from './raf'
import { getScroll } from './getScroll'
import { easeInOutCubic } from './easings'

export interface ScrollToOptions {
  // 默认滚动距离，模式是window
  getContainer?: () => HTMLElement | Window | Document
  // 滚动返回函数
  callback?: () => any
  // 滚动动画持续时间，默认450
  duration?: number
}

/**
 * 滚动至纵向距离
 * @param y
 * @param options
 */
export function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options
  const container = getContainer()
  const scrollTop = getScroll(container, true)
  const startTime = Date.now()

  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration)
    if (isWindow(container)) {
      ;(container as Window).scrollTo(window.pageXOffset, nextScrollTop)
    } else if (container instanceof HTMLDocument || container.constructor.name === 'HTMLDocument') {
      ;(container as HTMLDocument).documentElement.scrollTop = nextScrollTop
    } else {
      ;(container as HTMLElement).scrollTop = nextScrollTop
    }
    if (time < duration) {
      raf(frameFunc)
    } else if (typeof callback === 'function') {
      callback()
    }
  }
  raf(frameFunc)
}
