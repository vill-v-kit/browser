import { LinkTargetContext } from '@vill-v/ts'

export function openWindow(
  url: string,
  opt?: { target?: LinkTargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
  const { target = '_blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  return window.open(url, target, feature.join(','))
}

export function openNewTag(url: string, opt?: { target?: LinkTargetContext | string }) {
  const { target = '_blank' } = opt || {}
  let link: HTMLAnchorElement | null = document.createElement('a')
  link.href = url
  link.target = target
  link.click()
  link = null
}
