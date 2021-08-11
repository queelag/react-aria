import { ReactUtils } from '@queelag/react-core'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React, { Fragment } from 'react'
import * as Component from '../src/components/Tabber'
import { TabberChildrenProps, TabberProps } from '../src/definitions/props'

type Item = {
  content: string
  title: string
}

const items: Item[] = new Array(3).fill(0).map(() => ({ content: Chance().paragraph(), title: Chance().first() }))

const Template: Story<TabberProps> = (args: TabberProps) => (
  <Component.Root {...args} className='max-w-lg'>
    {(props: TabberChildrenProps) => (
      <Fragment>
        <Component.List {...props} className='flex border border-gray-200 divide-x divide-gray-200 rounded-lg overflow-hidden' label='People'>
          {items.map((v: Item, k: number) => (
            <Component.ListItem
              {...props}
              className={ReactUtils.joinClassNames(
                'flex justify-center p-6 transition-all duration-200',
                'hover:bg-gray-100 active:bg-gray-50 focus:bg-gray-100',
                props.isTabSelected(k) && 'bg-gray-50'
              )}
              index={k}
              key={k}
              style={{ width: 100 / items.length + '%' }}
            >
              {v.title}
            </Component.ListItem>
          ))}
        </Component.List>
        <div className='mt-6 rounded-lg'>
          <motion.div
            animate={{ translateX: props.selectedListItemIndex * -100 + '%' }}
            className='flex'
            initial={{ translateX: props.selectedListItemIndex * -100 + '%' }}
          >
            {items.map((v: Item, k: number) => (
              <Component.Panel
                {...props}
                className={ReactUtils.joinClassNames(
                  'min-w-full border border-gray-100 p-6 bg-gray-50 text-sm rounded-lg transition-all duration-200',
                  'focus:ring-2 ring-offset-2 ring-blue-400',
                  !props.isTabSelected(k) && 'opacity-0'
                )}
                index={k}
                key={k}
              >
                {v.content}
              </Component.Panel>
            ))}
          </motion.div>
        </div>
      </Fragment>
    )}
  </Component.Root>
)

export const Tabber: Story<TabberProps> = Template.bind({})
Tabber.args = {
  listItemsLength: items.length
}

export default {
  component: Component.Root,
  subcomponents: { List: Component.List, ListItem: Component.ListItem, Panel: Component.Panel },
  title: 'Components/Tabber'
} as Meta
