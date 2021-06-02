import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment } from 'react'
import { MenuButton } from '../src/components/MenuButton'
import { MenuButtonChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const options = new Array(5).fill(0).map(() => Chance().country({ full: true }))

export const Raw = () => {
  return (
    <MenuButton.Root>
      {(props: MenuButtonChildrenProps) => (
        <Fragment>
          <MenuButton.Button {...props} className='focus:ring'>
            Countries
          </MenuButton.Button>
          <MenuButton.List {...props} className={ArrayUtils.joinStrings('focus:ring outline-none', !props.expanded && 'opacity-0 pointer-events-none')}>
            {options.map((v: string, k: number) => (
              <MenuButton.ListItem {...props} key={k}>
                <MenuButton.ListItemAnchor {...props} className={ArrayUtils.joinStrings('focus:ring')} index={k}>
                  {v}
                </MenuButton.ListItemAnchor>
              </MenuButton.ListItem>
            ))}
          </MenuButton.List>
        </Fragment>
      )}
    </MenuButton.Root>
  )
}

export const Styled = () => {
  return (
    <MenuButton.Root className='w-72' popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }] }}>
      {(props: MenuButtonChildrenProps) => (
        <Fragment>
          <MenuButton.Button
            {...props}
            className={ArrayUtils.joinStrings(
              'w-full flex border border-gray-200 rounded-md p-6 font-medium outline-none transition-all duration-200',
              'hover:bg-gray-100 focus:bg-gray-50',
              'focus:ring-2 ring-offset-2 ring-blue-400'
            )}
          >
            Countries
          </MenuButton.Button>
          <MenuButton.List
            {...props}
            className={ArrayUtils.joinStrings(
              'w-full border border-gray-200 rounded-md divide-y divide-gray-200 outline-none transition-all duration-200',
              'focus:ring-2 ring-offset-2 ring-blue-400',
              !props.expanded && 'opacity-0 pointer-events-none'
            )}
          >
            {options.map((v: string, k: number) => (
              <MenuButton.ListItem {...props} key={k}>
                <MenuButton.ListItemAnchor
                  {...props}
                  className={ArrayUtils.joinStrings(
                    'flex justify-between p-6 space-x-6 cursor-pointer outline-none transition-all duration-100',
                    'hover:bg-gray-100 focus:bg-gray-100'
                  )}
                  index={k}
                >
                  {v}
                </MenuButton.ListItemAnchor>
              </MenuButton.ListItem>
            ))}
          </MenuButton.List>
        </Fragment>
      )}
    </MenuButton.Root>
  )
}

export default {
  component: MenuButton.Root,
  subcomponents: { Button: MenuButton.Button, List: MenuButton.List, ListItem: MenuButton.ListItem, ListItemAnchor: MenuButton.ListItemAnchor },
  title: 'Components/MenuButton'
} as Meta
