import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/MenuButton'
import { MenuButtonChildrenProps, MenuButtonProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const Template: Story<MenuButtonProps> = (args: MenuButtonProps) => {
  const [options] = useState(new Array(5).fill(0).map(() => Chance().country({ full: true })))

  return (
    <Component.Root {...args} className='w-72' popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }] }}>
      {(props: MenuButtonChildrenProps) => (
        <Fragment>
          <Component.Button
            {...props}
            className={ArrayUtils.joinStrings(
              'w-full flex border border-gray-200 rounded-md p-6 font-medium outline-none transition-all duration-200',
              'hover:bg-gray-100 focus:bg-gray-50',
              'focus:ring-2 ring-offset-2 ring-blue-400'
            )}
          >
            Countries
          </Component.Button>
          <Component.List
            {...props}
            className={ArrayUtils.joinStrings(
              'w-full border border-gray-200 rounded-md divide-y divide-gray-200 outline-none transition-all duration-200',
              'focus:ring-2 ring-offset-2 ring-blue-400',
              !props.expanded && 'opacity-0 pointer-events-none'
            )}
          >
            {options.map((v: string, k: number) => (
              <Component.ListItem {...props} key={k}>
                <Component.ListItemAnchor
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'flex justify-between p-6 space-x-6 cursor-pointer outline-none transition-all duration-100',
                    'hover:bg-gray-100 focus:bg-gray-100'
                  )}
                  index={k}
                >
                  {v}
                </Component.ListItemAnchor>
              </Component.ListItem>
            ))}
          </Component.List>
        </Fragment>
      )}
    </Component.Root>
  )
}

export const MenuButton = Template.bind({})
MenuButton.args = {}
MenuButton.storyName = 'MenuButton'

export default {
  component: Component.Root,
  subcomponents: { Button: Component.Button, List: Component.List, ListItem: Component.ListItem, ListItemAnchor: Component.ListItemAnchor },
  title: 'Components/MenuButton'
} as Meta
