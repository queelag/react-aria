import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/Menu'
import { MenuChildrenProps, MenuItemChildrenProps, MenuProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const Template: Story<MenuProps> = (args: MenuProps) => {
  const [items] = useState([
    {
      items: new Array(3).fill(0).map(() => Chance().first()),
      title: 'Names'
    },
    {
      items: new Array(5).fill(0).map(() => Chance().country({ full: true })),
      title: 'Countries'
    },
    {
      items: new Array(4).fill(0).map(() => Chance().animal()),
      title: 'Animals'
    }
  ])

  return (
    <Component.Root {...args} className='flex space-x-px' label='Random Stuff'>
      {(props: MenuChildrenProps) =>
        items.map((v, k) => (
          <Component.Item
            {...props}
            className='flex'
            index={k}
            key={k}
            popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }], placement: 'bottom-start' }}
          >
            {(props: MenuItemChildrenProps) => (
              <Fragment>
                <Component.ItemAnchor
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'bg-gray-100 p-6 cursor-pointer outline-none transition-all duration-200',
                    'hover:bg-blue-700 focus:bg-blue-700 hover:text-white focus:text-white',
                    k <= 0 && 'rounded-l-md',
                    k >= items.length - 1 && 'rounded-r-md'
                  )}
                >
                  {v.title}
                </Component.ItemAnchor>
                <Component.ItemMenu
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'border border-gray-200 divide-y divide-gray-200 rounded-md',
                    'transition-opacity duration-200',
                    !props.expanded && 'opacity-0 pointer-events-none'
                  )}
                >
                  {v.items.map((v, k) => (
                    <Component.ItemMenuItem {...props} className='flex' key={k}>
                      <Component.ItemMenuItemAnchor
                        {...props}
                        className={ArrayUtils.joinStrings(
                          'w-64 p-6 whitespace-nowrap cursor-pointer outline-none transition-all duration-200',
                          'hover:bg-gray-100 focus:bg-gray-100'
                        )}
                        index={k}
                      >
                        {v}
                      </Component.ItemMenuItemAnchor>
                    </Component.ItemMenuItem>
                  ))}
                </Component.ItemMenu>
              </Fragment>
            )}
          </Component.Item>
        ))
      }
    </Component.Root>
  )
}

export const Menu = Template.bind({})
Menu.args = { autoOpen: true, itemMenuHideDelay: 200 }

export default {
  component: Component.Root,
  subcomponents: {
    Item: Component.Item,
    ItemAnchor: Component.ItemAnchor,
    ItemMenu: Component.ItemMenu,
    ItemMenuItem: Component.ItemMenuItem,
    ItemMenuItemAnchor: Component.ItemMenuItemAnchor
  },
  title: 'Components/Menu'
} as Meta
