import { StorageCache, StorageCacheStoreParseType, fallbackStorage } from './storage'

/**
 * localStorage缓存商店
 */
export class LocalStorageCache<T = any> extends StorageCache<T> {
  constructor(key: string, parse?: StorageCacheStoreParseType<T> | true) {
    super(window?.localStorage || fallbackStorage, key, parse)
  }
}

/**
 * localStorage缓存商店
 * @param key
 * @param parse
 */
export const createLocalStorageCache = <T = any>(
  key: string,
  parse?: StorageCacheStoreParseType<T> | true
) => new LocalStorageCache(key, parse)
