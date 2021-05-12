import { ID } from '../definitions/types'

class DocumentUtils {
  static toPrefixIDSelector(id: ID): string {
    return `[id^="${id}-"]`
  }
}

export default DocumentUtils
