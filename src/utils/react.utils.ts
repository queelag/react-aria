class ReactUtils {
  static setInputValue(input: HTMLInputElement, value: string): void {
    let descriptor: PropertyDescriptor | undefined, setter: ((v: any) => void) | undefined

    descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
    if (!descriptor) return

    setter = descriptor.set
    if (!setter) return

    setter.call(input, value)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}

export default ReactUtils
