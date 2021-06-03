import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React from 'react'
import * as Component from '../src/components/Breadcrumb'
import { BreadcrumbProps } from '../src/definitions/props'

const Template: Story<BreadcrumbProps> = (args: BreadcrumbProps) => {
  const links: string[] = new Array(5).fill(0).map(() => Chance().sentence({ words: 2 }))

  return (
    <Component.Root {...args}>
      <Component.List className='flex divide-x divide-black'>
        {links.map((v: string, k: number) => (
          <Component.ListItem className='px-2' key={k}>
            <Component.ListItemLink className={k >= links.length - 1 ? 'text-blue-600' : ''} href='#' isCurrent={k >= links.length - 1}>
              {v}
            </Component.ListItemLink>
          </Component.ListItem>
        ))}
      </Component.List>
    </Component.Root>
  )
}

export const Breadcrumb = Template.bind({})
Breadcrumb.args = {}

export default {
  component: Component.Root,
  subcomponents: { List: Component.List, ListItem: Component.ListItem, ListItemLink: Component.ListItemLink },
  title: 'Components/Breadcrumb'
} as Meta
