class NumberUtils {
  static absolute(value: number): number {
    return value < 0 ? value * -1 : value
  }

  static difference(a: number, b: number): number {
    return a > b ? a - b : b - a
  }

  static limit(value: number, minimum: number = Number.MIN_SAFE_INTEGER, maximum: number = Number.MAX_SAFE_INTEGER): number {
    return value >= minimum && value <= maximum ? value : value >= minimum && value > maximum ? maximum : value < minimum && value <= maximum ? minimum : 0
  }

  static parseFloat(value: any): number {
    return isNaN(parseFloat(value)) ? 0 : parseFloat(value)
  }

  static isMultipleOf(value: number, of: number, decimals: number = 0): boolean {
    return this.toFixedNumber(value / of, decimals) % 1 === 0
  }

  static toFixedNumber(value: number, decimals: number): number {
    return this.parseFloat(value.toFixed(decimals))
  }
}

export default NumberUtils
