import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment } from 'react'
import { Menu } from '../src/components/Menu'
import { MenuChildrenProps, MenuItemChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const items = [
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
]

export const Raw = () => {
  return (
    <Menu.Root className='flex space-x-2' label='Random Stuff'>
      {(props: MenuChildrenProps) =>
        items.map((v, k) => (
          <Menu.Item {...props} index={k} key={k} popperOptions={{ placement: 'bottom-start' }}>
            {(props: MenuItemChildrenProps) => (
              <Fragment>
                <Menu.ItemAnchor {...props} className='cursor-pointer'>
                  {v.title}
                </Menu.ItemAnchor>
                <Menu.ItemMenu {...props} className={ArrayUtils.joinStrings(!props.expanded && 'opacity-0')}>
                  {v.items.map((v, k) => (
                    <Menu.ItemMenuItem {...props} key={k}>
                      <Menu.ItemMenuItemAnchor {...props} className='whitespace-nowrap cursor-pointer' index={k}>
                        {v}
                      </Menu.ItemMenuItemAnchor>
                    </Menu.ItemMenuItem>
                  ))}
                </Menu.ItemMenu>
              </Fragment>
            )}
          </Menu.Item>
        ))
      }
    </Menu.Root>
  )
}

export const Styled = () => {
  return (
    <Menu.Root className='flex space-x-px' label='Random Stuff'>
      {(props: MenuChildrenProps) =>
        items.map((v, k) => (
          <Menu.Item
            {...props}
            className='flex'
            index={k}
            key={k}
            popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }], placement: 'bottom-start' }}
          >
            {(props: MenuItemChildrenProps) => (
              <Fragment>
                <Menu.ItemAnchor
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'bg-gray-100 p-6 cursor-pointer outline-none transition-all duration-200',
                    'hover:bg-blue-700 focus:bg-blue-700 hover:text-white focus:text-white',
                    k <= 0 && 'rounded-l-md',
                    k >= items.length - 1 && 'rounded-r-md'
                  )}
                >
                  {v.title}
                </Menu.ItemAnchor>
                <Menu.ItemMenu
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'border border-gray-200 divide-y divide-gray-200 rounded-md',
                    'transition-opacity duration-200',
                    !props.expanded && 'opacity-0 pointer-events-none'
                  )}
                >
                  {v.items.map((v, k) => (
                    <Menu.ItemMenuItem {...props} className='flex' key={k}>
                      <Menu.ItemMenuItemAnchor
                        {...props}
                        className={ArrayUtils.joinStrings(
                          'w-64 p-6 whitespace-nowrap cursor-pointer outline-none transition-all duration-200',
                          'hover:bg-gray-100 focus:bg-gray-100'
                        )}
                        index={k}
                      >
                        {v}
                      </Menu.ItemMenuItemAnchor>
                    </Menu.ItemMenuItem>
                  ))}
                </Menu.ItemMenu>
              </Fragment>
            )}
          </Menu.Item>
        ))
      }
    </Menu.Root>
  )
}

export default {
  component: Menu.Root,
  subcomponents: {
    Item: Menu.Item,
    ItemAnchor: Menu.ItemAnchor,
    ItemMenu: Menu.ItemMenu,
    ItemMenuItem: Menu.ItemMenuItem,
    ItemMenuItemAnchor: Menu.ItemMenuItemAnchor
  },
  title: 'Components/Menu'
} as Meta
