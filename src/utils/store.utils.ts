import { forEach, get, set, some } from 'lodash'

class StoreUtils {
  static updateFromProps<T extends object, U extends object>(store: T, props: U, update: () => void, ...whitelist: (keyof T)[]): void {
    let updated: boolean | undefined

    forEach(props, (v: any, k: any) => {
      if (whitelist.includes(k) && this.shouldUpdateKey(store, k, v)) {
        set(store, k, v)
        updated = true
      }
    })

    updated && update()
  }

  static shouldUpdateKeys<T extends object, U extends object>(store: T, props: U, ...whitelist: (keyof T)[]): boolean {
    return some(whitelist, (v: keyof T) => this.shouldUpdateKey(store, v, get(props, v)))
  }

  static shouldUpdateKey<T extends object>(store: T, key: keyof T, prop: any): prop is T {
    return prop !== undefined && get(store, key) !== prop
  }
}

export default StoreUtils
