import { ID } from '@queelag/core'
import { ComponentStore, ComponentStoreProps } from '@queelag/react-core'
import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { AccordionProps } from '../definitions/props'
import { StoreLogger } from '../loggers/store.logger'

export class AccordionStore extends ComponentStore {
  expandedSections: Map<ID, boolean>
  sectionHeaderRefs: Map<ID, MutableRefObject<HTMLButtonElement>>

  constructor(props: AccordionProps & ComponentStoreProps) {
    super(ComponentName.ACCORDION, props)

    this.expandedSections = new Map()
    this.sectionHeaderRefs = new Map()
  }

  expandSection = (expanded: boolean, id: ID, isCollapsable: boolean): void => {
    if (expanded === false && isCollapsable === false) {
      StoreLogger.verbose(this.id, 'expandSection', `The isCollapsable prop is falsy, the section can't be collapsed`)
      return
    }

    this.expandedSections.clear()
    this.expandedSections.set(id, expanded)

    StoreLogger.debug(this.id, 'expandSection', `Every section has been collapsed, the section ${id} has been ${expanded ? 'expanded' : 'collapsed'}`)

    this.dispatch()
  }

  setSectionHeaderRef = (ref: MutableRefObject<HTMLButtonElement>, id: ID): void => {
    this.sectionHeaderRefs.set(id, ref)
  }

  handleKeyboardInteractions(event: KeyboardEvent): void {
    let sections: HTMLButtonElement[], focusedSectionIndex: number

    sections = [...this.sectionHeaderRefs.values()].map((v: MutableRefObject<HTMLButtonElement>) => v.current)
    if (sections.length <= 0) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `There are no sections`)

    focusedSectionIndex = sections.findIndex((v: HTMLButtonElement) => document.activeElement?.id === v.id)
    if (focusedSectionIndex < 0) return StoreLogger.error(this.id, 'handleKeyboardInteractions', `Failed to find the focused section index`)

    switch (event.key) {
      case Key.ARROW_DOWN:
      case Key.ARROW_UP:
      case Key.END:
      case Key.HOME:
        event.preventDefault()
        event.stopPropagation()
        StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

        break
    }

    switch (event.key) {
      case Key.ARROW_DOWN:
        let next: HTMLButtonElement

        next = sections[focusedSectionIndex + 1]
        if (!next) return StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `Failed to find the next element`)

        next.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', event.key, `The next element has been focused`)

        break
      case Key.ARROW_UP:
        let previous: HTMLButtonElement

        previous = sections[focusedSectionIndex - 1]
        if (!previous) return StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `Failed to find the previous element`)

        previous.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', event.key, `The previous element has been focused`)

        break
      case Key.END:
        let last: HTMLButtonElement

        last = sections[sections.length - 1]
        if (!last) return StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `Failed to find the last element`)

        last.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', event.key, `The last element has been focused`)

        break
      case Key.HOME:
        let first: HTMLButtonElement

        first = sections[0]
        if (!first) return StoreLogger.verbose(this.id, 'handleKeyboardInteractions', `Failed to find the first element`)

        first.focus()
        StoreLogger.debug(this.id, 'handleKeyboardInteractions', event.key, `The first element has been focused`)

        break
    }
  }
}
