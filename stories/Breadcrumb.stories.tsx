import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import React from 'react'
import { Breadcrumb } from '../src/components/Breadcrumb'

const links: string[] = new Array(5).fill(0).map(() => Chance().sentence({ words: 2 }))

export const Raw = () => (
  <Breadcrumb.Root>
    <Breadcrumb.List className='flex divide-x divide-black'>
      {links.map((v: string, k: number) => (
        <Breadcrumb.ListItem className='px-2' key={k}>
          <Breadcrumb.ListItemLink className={k >= links.length - 1 ? 'text-blue-600' : ''} href='#' isCurrent={k >= links.length - 1}>
            {v}
          </Breadcrumb.ListItemLink>
        </Breadcrumb.ListItem>
      ))}
    </Breadcrumb.List>
  </Breadcrumb.Root>
)

export default {
  component: Breadcrumb.Root,
  subcomponents: { List: Breadcrumb.List, ListItem: Breadcrumb.ListItem, ListItemLink: Breadcrumb.ListItemLink },
  title: 'Components/Breadcrumb'
} as Meta
