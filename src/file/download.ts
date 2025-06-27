import { LinkTargetContext } from '@vill-v/ts'
import { openWindow } from '../dom'
import { imgDataURLtoBlob, imgUrlToBase64 } from './base64Convert'

/**
 * 通过url下载在线图片
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadImageByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  imgUrlToBase64(url).then((base64) => {
    downloadImageByBase64(base64, filename, mime, bom)
  })
}

/**
 * 通过base64下载图片
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadImageByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const base64Buf = imgDataURLtoBlob(buf)
  downloadByData({ data: base64Buf, filename, mime, bom })
}

/**
 * 根据后台返回的文件流下载
 * @param {*} data
 * @param target
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData({
  data,
  target = '_blank',
  filename,
  mime,
  bom,
}: {
  data: BlobPart
  target?: LinkTargetContext
  filename: string
  mime?: string
  bom?: BlobPart
}) {
  const blobData = bom !== undefined ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  // @ts-ignore
  if (window.navigator.msSaveBlob !== undefined) {
    // @ts-ignore
    window.navigator.msSaveBlob(blob, filename)
  } else {
    const blobURL = window.URL.createObjectURL(blob)
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', filename)
    if (tempLink.download === undefined) {
      tempLink.setAttribute('target', target)
    }
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    window.URL.revokeObjectURL(blobURL)
  }
}

/**
 * 通过请求的方式下载
 * @param url
 * @param target
 * @param fileName
 */
export function downloadByUrlRequest({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: LinkTargetContext
  fileName?: string
}) {
  return fetch(url, { method: 'get' })
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject()
      }
      return res.blob()
    })
    .then((data) =>
      downloadByData({
        data,
        target,
        filename: fileName || url.substring(url.lastIndexOf('/') + 1, url.length),
      })
    )
}

/**
 * 根据文件地址下载文件
 * @param url
 * @param target
 * @param fileName
 */
export function downloadByUrl({
  url,
  target = '_blank',
  fileName,
}: {
  url: string
  target?: LinkTargetContext
  fileName?: string
}): boolean {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target

    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download'
  }

  openWindow(url, { target })
  return true
}

/**
 * 简易的将文字转为文件下载
 * @param text
 * @param filename
 */
export function simpleDownloadTextFile(text: string, filename: string) {
  const file = new File([text], filename)
  downloadByData({ data: file, filename })
}
