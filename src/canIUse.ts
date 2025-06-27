import { isAllItemVerified } from '@vill-v/vanilla'
import { isNil, isString } from '@vill-v/type-as'

/**
 * 这个api是否可以使用
 * @param api
 */
export function canIUse(api: keyof typeof window | (keyof typeof window)[]) {
  if (isNil(api)) {
    return false
  }
  if (isString(api) && window[api]) {
    return true
  }
  if (Array.isArray(api)) {
    return isAllItemVerified(api, (item) => isString(item) && window[item])
  }
  return false
}
