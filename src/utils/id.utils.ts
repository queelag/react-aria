import { nanoid } from 'nanoid'

class IDUtils {
  static prefixed(prefix: string): string {
    return prefix + '_' + nanoid()
  }
}

export default IDUtils
