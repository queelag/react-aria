class Throttle {
  static data: Map<string, number> = new Map()

  static handle<T extends string>(name: T, fn: () => any, ms: number): void {
    let previous: number

    previous = this.data.get(name) || Date.now() - ms
    if (Date.now() - previous < ms) return

    fn()

    this.data.set(name, Date.now())
  }
}

export default Throttle
