import { StorageCache, StorageCacheStoreParseType, fallbackStorage } from './storage'

/**
 * sessionStorage缓存商店
 */
export class SessionStorageCache<T = any> extends StorageCache<T> {
  constructor(key: string, parse?: StorageCacheStoreParseType<T> | true) {
    super(window?.sessionStorage || fallbackStorage, key, parse)
  }
}

/**
 * sessionStorage缓存商店
 * @param key
 * @param parse
 */
export const createSessionStorageCache = <T = any>(
  key: string,
  parse?: StorageCacheStoreParseType<T> | true
) => new SessionStorageCache(key, parse)
