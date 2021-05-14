import { get, set, some } from 'lodash'

class StoreUtils {
  static updateFromProps<T extends object, U extends object>(store: T, props: U, update: () => void, ...whitelist: (keyof T)[]): void {
    let keys: (keyof T)[], values: any[], key: keyof T, value: any, changes: number

    keys = Object.keys(props) as any
    values = Object.values(props)
    changes = 0

    for (let i = 0; i < keys.length; ) {
      key = keys[i]
      value = values[i]

      if (whitelist.includes(key) && value !== undefined && get(store, key) !== value) {
        set(store, key, value)
        changes++
      }

      i++
    }

    changes > 0 && update()
  }

  static shouldUpdateKeys<T extends object, U extends object>(store: T, props: U, ...whitelist: (keyof T)[]): boolean {
    return some(whitelist, (v: keyof T) => this.shouldUpdateKey(store, v, get(props, v)))
  }

  static shouldUpdateKey<T extends object>(store: T, key: keyof T, prop: any): prop is T {
    return prop !== undefined && get(store, key) !== prop
  }
}

export default StoreUtils
