import { render, screen } from '@testing-library/react'
import { Chance } from 'chance'
import React from 'react'
import { Breadcrumb } from '../../src/components/Breadcrumb'
import { ComponentName, LoggerLevel } from '../../src/definitions/enums'
import Logger from '../../src/modules/logger'

describe('Breadcrumb', () => {
  let links: string[], root: HTMLElement, listItemLinks: HTMLElement[]

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    links = new Array(5).fill(0).map(() => Chance().sentence({ words: 2 }))
    render(
      <Breadcrumb.Root data-testid={ComponentName.BREADCRUMB}>
        <Breadcrumb.List data-testid={ComponentName.BREADCRUMB_LIST}>
          {links.map((v: string, k: number) => (
            <Breadcrumb.ListItem data-testid={ComponentName.BREADCRUMB_LIST_ITEM} key={k}>
              <Breadcrumb.ListItemLink data-testid={ComponentName.BREADCRUMB_LIST_ITEM_LINK} href='#' isCurrent={k >= links.length - 1}>
                {v}
              </Breadcrumb.ListItemLink>
            </Breadcrumb.ListItem>
          ))}
        </Breadcrumb.List>
      </Breadcrumb.Root>
    )
    root = screen.getByTestId(ComponentName.BREADCRUMB)
    listItemLinks = screen.getAllByTestId(ComponentName.BREADCRUMB_LIST_ITEM_LINK)
  })

  it('has the correct aria attributes', () => {
    expect(root.getAttribute('aria-label')).toBe('Breadcrumb')
    expect(listItemLinks[links.length - 1].getAttribute('aria-current')).toBe('page')
  })
})
