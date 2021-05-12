class ArrayUtils {
  static joinStrings(...strings: any[]): string {
    return strings
      .filter((v: string) => typeof v === 'string' && v.length > 0)
      .join(' ')
      .replace(/ {2,}/gm, ' ')
  }
}

export default ArrayUtils
