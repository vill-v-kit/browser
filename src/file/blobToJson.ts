import { isBlankString } from '@vill-v/vanilla'
import { isString } from '@vill-v/type-as'

/**
 * blob转json
 * 用于axios选择转换为blob时，对后台正常json报错进行读取
 *
 * 使用 `FileReader` 进行转换
 * @param blob
 * @param format
 */
export const blobToJsonLegacy = <T extends Record<string, any> = Record<string, any>>(
  blob: Blob,
  format = 'utf-8'
): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (res) => {
      const result = res.target?.result
      if (!isString(result)) {
        return resolve(null)
      }
      if (isBlankString(result)) {
        return resolve(null)
      }
      try {
        const json = JSON.parse(result)
        return resolve(json)
      } catch (e) {
        return reject(e)
      }
    }
    fileReader.onerror = (e) => {
      return reject(e)
    }
    fileReader.readAsText(blob, format)
  })
}

/**
 * blob转json
 * 用于axios选择转换为blob时，对后台正常json报错进行读取
 *
 * 使用 `blob.text()` 进行转换
 * @param blob
 */
export const blobToJsonModern = async <T extends Record<string, any> = Record<string, any>>(
  blob: Blob
): Promise<T> => {
  const result = await blob.text()
  return JSON.parse(result)
}

/**
 * blob转json
 * 用于axios选择转换为blob时，对后台正常json报错进行读取
 *
 *  在现代浏览器 使用 `blob.text()` 进行转换
 *  在不支持该特性的浏览器内 使用 `FileReader` 进行转换
 * @param blob
 * @param format
 */
export function blobToJson<T extends Record<string, any> = Record<string, any>>(
  blob: Blob,
  format = 'utf-8'
): Promise<T | null> {
  if (Reflect.has(Blob.prototype, 'text')) {
    return blobToJsonModern<T>(blob)
  }
  return blobToJsonLegacy<T>(blob, format)
}
