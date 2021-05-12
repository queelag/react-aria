class DOMUtils {
  static focus(element: any): void {
    element.focus && element.focus()
  }
}

export default DOMUtils
