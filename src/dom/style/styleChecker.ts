/**
 * @licence https://github.com/vueComponent/ant-design-vue
 */
export function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement)
}

export const canUseDocElement = () => canUseDom() && window.document.documentElement

export const isStyleSupport = (styleName: string | Array<string>): boolean => {
  if (canUseDocElement()) {
    const styleNameList = Array.isArray(styleName) ? styleName : [styleName]
    const { documentElement } = window.document

    return styleNameList.some((name) => name in documentElement.style)
  }
  return false
}
