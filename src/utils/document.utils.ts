import { ID } from '../definitions/types'

class DocumentUtils {
  static querySelector<T extends Element>(selectors: string): T {
    return document.querySelector(selectors) || (document.createElement('div') as any)
  }

  static findElementWithPrefixID<T extends Element>(id: ID): T {
    return this.querySelector(this.toPrefixIDSelector(id))
  }

  static toPrefixIDSelector(id: ID): string {
    return `[id^='${id}-']`
  }
}

export default DocumentUtils
