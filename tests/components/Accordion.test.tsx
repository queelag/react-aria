import { cleanup, fireEvent, render, RenderResult, screen } from '@testing-library/react'
import { Chance } from 'chance'
import React, { Fragment } from 'react'
import { Accordion, AccordionSection, AccordionSectionHeader, AccordionSectionPanel } from '../../src/components/Accordion'
import { ComponentName, Key, LoggerLevel } from '../../src/definitions/enums'
import { AccordionChildrenProps, AccordionSectionChildrenProps } from '../../src/definitions/props'
import Logger from '../../src/modules/logger'

type Section = {
  header: string
  isCollapsable?: boolean
  isExpanded?: boolean
  panel: string
}

describe('Accordion', () => {
  let dummies: Section[],
    renderComponent: Function,
    body: RenderResult,
    root: HTMLElement,
    sections: HTMLElement[],
    sectionHeaders: HTMLElement[],
    sectionPanels: HTMLElement[]

  beforeAll(() => {
    renderComponent = () =>
      render(
        <Accordion data-testid={ComponentName.ACCORDION} size={dummies.length}>
          {(props: AccordionChildrenProps) => (
            <Fragment>
              {dummies.map((v: Section, k: number) => (
                <AccordionSection
                  {...props}
                  data-testid={ComponentName.ACCORDION_SECTION}
                  index={k}
                  isCollapsable={v.isCollapsable}
                  isExpanded={v.isExpanded}
                  key={k}
                >
                  {(props: AccordionSectionChildrenProps) => (
                    <Fragment>
                      <AccordionSectionHeader {...props} data-testid={ComponentName.ACCORDION_SECTION_HEADER}>
                        {v.header}
                      </AccordionSectionHeader>
                      <AccordionSectionPanel {...props} data-testid={ComponentName.ACCORDION_SECTION_PANEL}>
                        {props.expanded && v.panel}
                      </AccordionSectionPanel>
                    </Fragment>
                  )}
                </AccordionSection>
              ))}
            </Fragment>
          )}
        </Accordion>
      )
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    dummies = new Array(3).fill(0).map(() => ({ header: Chance().sentence(), panel: Chance().paragraph() }))
    body = renderComponent()
    root = screen.getByTestId(ComponentName.ACCORDION)
    sections = screen.getAllByTestId(ComponentName.ACCORDION_SECTION)
    sectionHeaders = screen.getAllByTestId(ComponentName.ACCORDION_SECTION_HEADER)
    sectionPanels = screen.getAllByTestId(ComponentName.ACCORDION_SECTION_PANEL)
  })

  it('contains as many sections as the dummies length', () => {
    expect(root.children).toHaveLength(dummies.length)
    expect(sections).toHaveLength(dummies.length)
  })

  it('contains as many section headers and panels as the dummies length', () => {
    expect(sectionHeaders).toHaveLength(dummies.length)
    expect(sectionPanels).toHaveLength(dummies.length)
  })

  it('every section is collapsed', () => {
    sections.forEach((v: HTMLElement) => {
      let header: Element, panel: Element

      header = v.children[0]
      panel = v.children[1]

      expect(header.getAttribute('aria-expanded')).toBe('false')
      expect(panel.innerHTML).toHaveLength(0)
    })
  })

  it('every section header has the correct aria attributes and children', () => {
    sectionHeaders.forEach((v: HTMLElement, k: number) => {
      expect(v.getAttribute('aria-controls')).toContain(ComponentName.ACCORDION_SECTION_PANEL)
      expect(v.getAttribute('aria-expanded')).toBe('false')
      expect(v.innerHTML).toBe(dummies[k].header)
    })
  })

  it('every section panel has the correct aria attributes and children', () => {
    sectionPanels.forEach((v: HTMLElement) => {
      expect(v.getAttribute('aria-labelledby')).toContain(ComponentName.ACCORDION_SECTION_HEADER)
      expect(v.getAttribute('role')).toBe('region')
      expect(v.innerHTML).toHaveLength(0)
    })
  })

  it('clicking on a section header expands it and collapses the other ones, clicking again collapses it', () => {
    let header: HTMLElement, panel: HTMLElement

    header = sectionHeaders[0]
    fireEvent.click(header)
    expect(header.getAttribute('aria-expanded')).toBe('true')

    sectionHeaders.slice(1).forEach((v: HTMLElement) => expect(v.getAttribute('aria-expanded')).toBe('false'))
    sectionPanels.slice(1).forEach((v: HTMLElement) => expect(v.innerHTML).toHaveLength(0))

    panel = sectionPanels[0]
    expect(panel.innerHTML).toBe(dummies[0].panel)

    fireEvent.click(header)
    expect(header.getAttribute('aria-expanded')).toBe('false')

    expect(panel.innerHTML).toHaveLength(0)
  })

  it('expands automatically a section with isExpanded set to true', () => {
    let header: HTMLElement, panel: HTMLElement | null

    dummies[0].isExpanded = true
    cleanup()
    renderComponent()

    sectionHeaders = screen.getAllByTestId(ComponentName.ACCORDION_SECTION_HEADER)
    sectionPanels = screen.getAllByTestId(ComponentName.ACCORDION_SECTION_PANEL)

    header = sectionHeaders[0]
    panel = sectionPanels[0]

    expect(header.getAttribute('aria-expanded')).toBe('true')
    expect(panel.innerHTML).toBe(dummies[0].panel)

    delete dummies[0].isExpanded
  })

  it('collapses only the sections which do not have isCollapsable set to false', () => {
    let header: HTMLElement, panel: HTMLElement | null

    dummies[0].isCollapsable = false
    cleanup()
    renderComponent()

    sectionHeaders = screen.getAllByTestId(ComponentName.ACCORDION_SECTION_HEADER)
    sectionPanels = screen.getAllByTestId(ComponentName.ACCORDION_SECTION_PANEL)

    header = sectionHeaders[0]
    panel = sectionPanels[0]

    fireEvent.click(header)
    fireEvent.click(header)
    expect(header.getAttribute('aria-expanded')).toBe('true')
    expect(panel.innerHTML).toBe(dummies[0].panel)

    delete dummies[0].isCollapsable
  })

  it('handles the keyboard events', async () => {
    sectionHeaders[0].focus()
    expect(sectionHeaders[0]).toBe(document.activeElement)
    fireEvent.keyDown(root, { key: Key.ARROW_DOWN })
    expect(sectionHeaders[1]).toBe(document.activeElement)
    fireEvent.keyDown(root, { key: Key.ARROW_UP })
    expect(sectionHeaders[0]).toBe(document.activeElement)
    fireEvent.keyDown(root, { key: Key.ARROW_DOWN })
    fireEvent.keyDown(root, { key: Key.ARROW_DOWN })
    expect(sectionHeaders[2]).toBe(document.activeElement)
    fireEvent.keyDown(root, { key: Key.ARROW_UP })
    fireEvent.keyDown(root, { key: Key.ARROW_UP })
    expect(sectionHeaders[0]).toBe(document.activeElement)
    fireEvent.keyDown(root, { key: Key.END })
    expect(sectionHeaders[2]).toBe(document.activeElement)
    fireEvent.keyDown(root, { key: Key.HOME })
    expect(sectionHeaders[0]).toBe(document.activeElement)
  })
})
