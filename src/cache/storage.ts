import { isNil } from '@vill-v/type-as'
import { forceJsonParse } from '@vill-v/vanilla'
import { createStorageLikeCache } from '@void-cache/storage-like'
import { type CacheModel } from '@void-cache/core'

export interface StorageCacheStoreParseType<T = any> {
  get: (value: string) => T
  set: (value: T) => string
}

const NormalStorageCacheStoreParse = {
  get: (value) => value,
  set: (value) => value,
}

const JSONStorageCacheStoreParse = {
  get: (value) => forceJsonParse(value, 'null'),
  set: (value) => JSON.stringify(value),
}

/**
 * 一个如果当前平台不存在 `Storage` 的实现时的，后备选项
 * 主要为了兼容 ssr
 */
export const fallbackStorage: Storage = {
  length: 0,
  clear() {},
  getItem() {
    return null
  },
  key() {
    return null
  },
  removeItem() {},
  setItem() {},
}

/**
 * Storage缓存商店
 * 提供自动json数据处理功能
 */
export class StorageCache<T = any> {
  /**
   * Storage实例
   * @private
   */
  private readonly storage: CacheModel<string | null>
  /**
   * 解析器
   * @private
   */
  private readonly parse: StorageCacheStoreParseType<T>
  private readonly _key: string

  constructor(storage: Storage, key: string, parse?: StorageCacheStoreParseType<T> | true) {
    this.storage = createStorageLikeCache({ storageLike: storage })
    this.parse = this._changeParse(parse)
    this._key = key
  }

  private _changeParse(parse?: StorageCacheStoreParseType<T> | true) {
    if (!parse) {
      return NormalStorageCacheStoreParse
    }
    if (parse === true) {
      return JSONStorageCacheStoreParse
    }
    return parse
  }

  get key() {
    return this._key
  }

  /**
   * 是否存在该缓存
   */
  has() {
    return this.storage.has(this._key)
  }

  /**
   * 获取原始值
   */
  rawGet() {
    return this.storage.get(this._key)
  }

  /**
   * 设置原始值
   * @param value
   */
  rawSet(value?: string | null) {
    if (isNil(value)) {
      this.remove()
      return
    }
    this.storage.set(this._key, value)
  }

  get(): T | null {
    const value = this.rawGet()
    if (!value) {
      return null
    }
    return this.parse.get(value)
  }

  set(value?: T | null) {
    if (isNil(value)) {
      this.remove()
      return
    }

    const setValue = this.parse.set(value)

    this.rawSet(setValue)
  }

  get value(): T | null {
    return this.get()
  }

  set value(value: T | null | undefined) {
    this.set(value)
  }

  get rawValue() {
    return this.rawGet()
  }

  set rawValue(value: string | null | undefined) {
    this.rawSet(value)
  }

  remove() {
    this.storage.remove(this._key)
  }

  /**
   * 原值是否相等
   * @param value
   */
  rawEq(value?: string | null) {
    return this.rawValue === value
  }

  /**
   * 值是否相等
   * 暂时只是用===比较
   * @param value
   */
  eq(value?: string | null) {
    return this.value === value
  }
}

export const createStorageCache = <T = any>(
  storage: Storage,
  key: string,
  parse?: StorageCacheStoreParseType<T> | true
) => new StorageCache<T>(storage, key, parse)
