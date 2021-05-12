import { KeyboardEvent, MutableRefObject } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import ComponentStore from '../modules/component.store'
import Logger from '../modules/logger'

class AccordionStore extends ComponentStore {
  expandedSections: Map<number, boolean>
  sectionRefs: Map<number, MutableRefObject<HTMLDivElement>>

  constructor(ref: MutableRefObject<HTMLDivElement>) {
    super(ComponentName.ACCORDION, ref)

    this.expandedSections = new Map()
    this.sectionRefs = new Map()
  }

  expandSection(expanded: boolean, index: number, isCollapsable: boolean): void {
    if (expanded === false && isCollapsable === false) {
      Logger.debug(this.id, 'expandSection', `The isCollapsable prop is falsy, the section can't be collapsed`)
      return
    }

    this.expandedSections.clear()
    this.expandedSections.set(index, expanded)

    Logger.debug(this.id, 'expandSection', `Every section has been collapsed, the section ${index} has been ${expanded ? 'expanded' : 'collapsed'}`)
  }

  setSectionRef = (ref: MutableRefObject<HTMLDivElement>, index: number): void => {
    this.sectionRefs.set(index, ref)
  }

  handleKeyboardInteractions(e: KeyboardEvent): void {
    let sections: HTMLDivElement[], focusedSectionIndex: number

    sections = [...this.sectionRefs.values()].map((v: MutableRefObject<HTMLDivElement>) => v.current)
    if (sections.length <= 0) return Logger.error(this.id, 'handleKeyboardInteractions', `There are no sections`)

    focusedSectionIndex = sections.findIndex((v: HTMLDivElement) => document.activeElement === v)
    if (focusedSectionIndex < 0) return Logger.error(this.id, 'handleKeyboardInteractions', `Failed to find the focused section index`)

    switch (e.key) {
      case Key.ARROW_DOWN:
        let next: HTMLDivElement

        next = sections[focusedSectionIndex + 1]
        if (!next) return Logger.debug(this.id, 'handleKeyboardInteractions', `Failed to find the next element`)

        next.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', e.key, `The next element has been focused`)

        break
      case Key.ARROW_UP:
        let previous: HTMLDivElement

        previous = sections[focusedSectionIndex - 1]
        if (!previous) return Logger.debug(this.id, 'handleKeyboardInteractions', `Failed to find the previous element`)

        previous.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', e.key, `The previous element has been focused`)

        break
      case Key.END:
        let last: HTMLDivElement

        last = sections[sections.length - 1]
        if (!last) return Logger.debug(this.id, 'handleKeyboardInteractions', `Failed to find the last element`)

        last.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', e.key, `The last element has been focused`)

        break
      case Key.HOME:
        let first: HTMLDivElement

        first = sections[0]
        if (!first) return Logger.debug(this.id, 'handleKeyboardInteractions', `Failed to find the first element`)

        first.focus()
        Logger.debug(this.id, 'handleKeyboardInteractions', e.key, `The first element has been focused`)

        break
    }
  }
}

export default AccordionStore
