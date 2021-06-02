class Debounce {
  static data: Map<string, number> = new Map()

  static handle<T extends string>(name: T, fn: () => any, ms: number): void {
    let timeout: number

    timeout = window.setTimeout(fn, ms)
    clearTimeout(this.data.get(name))

    this.data.set(name, timeout)
  }
}

export default Debounce
