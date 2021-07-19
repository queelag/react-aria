import { Logger } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { KeyboardEvent } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import DOMUtils from '../utils/dom.utils'

class FocusTrapStore extends ComponentStore<HTMLDivElement> {
  focusables: Element[]
  originalFocused: Element

  constructor(props: ComponentStoreProps<HTMLDivElement>) {
    super(ComponentName.FOCUS_TRAP, props)

    this.focusables = []
    this.originalFocused = document.createElement('div')
  }

  readFocusables(): void {
    this.focusables = [...this.element.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])')].filter(
      (v: Element) =>
        v.hasAttribute('disabled') === false &&
        v.getAttribute('tabindex') !== '-1' &&
        getComputedStyle(v).display !== 'none' &&
        getComputedStyle(v).visibility !== 'hidden'
    )
    Logger.debug(this.id, 'readFocusables', `The focusable elements have been set`, this.focusables)
  }

  readOriginalFocused(): void {
    this.originalFocused = document.activeElement || document.createElement('div')
    Logger.debug(this.id, 'readOriginalFocused', `The original focused element has been set`)
  }

  focusOriginalFocused(): void {
    DOMUtils.focus(this.originalFocused)
    Logger.debug(this.id, 'focusOriginalFocused', `The original focused element has been focused`)
  }

  readOriginalFocusedAndReturnFocuser(): () => void {
    this.readOriginalFocused()
    return () => this.focusOriginalFocused()
  }

  focusFirstFocusable(): void {
    let first: Element

    first = this.focusables[0]
    if (!first) return Logger.error(this.id, 'focusFirstFocusable', `Failed to find the first focusable element`)

    DOMUtils.focus(first)
  }

  handleKeyboardInteractions = (event: KeyboardEvent): void => {
    switch (event.key) {
      case Key.TAB:
        let focusedIndex: number

        event.preventDefault()
        Logger.debug(this.id, 'handleKeyboardInteractions', `The default event has been prevented`)

        focusedIndex = this.focusables.findIndex((v: Element) => v === document.activeElement)
        if (focusedIndex < 0) return Logger.error(this.id, 'handleKeyboardInteractions', 'Failed to find the focused element index')

        if (event.shiftKey) {
          let previous: Element

          previous = this.focusables[focusedIndex - 1]
          if (!previous) {
            let last: Element

            last = this.focusables[this.focusables.length - 1]
            if (!last) return Logger.debug(this.id, 'handleKeyboardInteractions', `Failed to find the last focusable element`)

            DOMUtils.focus(last)
            Logger.debug(this.id, 'handleKeyboardInteractions', `The last focusable element has been focused`)

            break
          }

          DOMUtils.focus(previous)
          Logger.debug(this.id, 'handleKeyboardInteractions', `The previous focusable element has been focused`)
        } else {
          let next: Element

          next = this.focusables[focusedIndex + 1]
          if (!next) {
            let first: Element

            first = this.focusables[0]
            if (!first) return Logger.debug(this.id, 'handleKeyboardInteractions', `Failed to find the first focusable element`)

            DOMUtils.focus(first)
            Logger.debug(this.id, 'handleKeyboardInteractions', `The first focusable element has been focused`)

            break
          }

          DOMUtils.focus(next)
          Logger.debug(this.id, 'handleKeyboardInteractions', `The next focusable element has been focused`)
        }

        break
    }
  }
}

export default FocusTrapStore
