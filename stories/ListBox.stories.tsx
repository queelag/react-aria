import { ReactUtils } from '@queelag/core'
import { IconCheck } from '@queelag/react-feather-icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/ListBox'
import { ListBoxSelectMode } from '../src/definitions/enums'
import { ListBoxChildrenProps, ListBoxProps } from '../src/definitions/props'

const Template: Story<ListBoxProps> = (args: ListBoxProps) => {
  const [options] = useState(new Array(3).fill(0).map(() => Chance().country({ full: true })))
  const [value, setValue] = useState<string[]>([])

  const onSelectListItem = (indexes: number[]) => {
    setValue(options.filter((v, k: number) => indexes.includes(k)))
  }

  return (
    <div className={ReactUtils.joinClassNames(args.collapsable && 'h-96')}>
      <Component.Root
        {...args}
        className='max-w-lg'
        onSelectListItem={onSelectListItem}
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }] }}
        selectedListItemIndexes={value.map((v: string) => options.indexOf(v))}
      >
        {(props: ListBoxChildrenProps) => (
          <Fragment>
            {props.collapsable && (
              <Component.Button
                {...props}
                className={ReactUtils.joinClassNames(
                  'w-full flex border border-gray-200 rounded-md p-6 font-medium outline-none transition-all duration-200',
                  'hover:bg-gray-100 focus:bg-gray-50',
                  'focus:ring-2 ring-offset-2 ring-blue-400'
                )}
              >
                {value.join(', ') || 'Select a country'}
              </Component.Button>
            )}
            <Component.List
              {...props}
              className={ReactUtils.joinClassNames(
                'w-full border border-gray-200 rounded-md divide-y divide-gray-200 outline-none transition-all duration-200',
                'focus:ring-2 ring-offset-2 ring-blue-400',
                props.collapsable && !props.expanded && 'opacity-0 pointer-events-none'
              )}
            >
              {options.map((v: string, k: number) => (
                <Component.ListItem
                  {...props}
                  className={ReactUtils.joinClassNames(
                    'flex justify-between items-center p-6 space-x-6 transition-all duration-100 hover:bg-gray-100',
                    props.isListItemFocused(k) && 'bg-gray-100',
                    props.isListItemSelected(k) && 'bg-gray-50'
                  )}
                  index={k}
                  key={k}
                >
                  <span>{v}</span>
                  {props.isListItemSelected(k) && <IconCheck />}
                </Component.ListItem>
              ))}
            </Component.List>
          </Fragment>
        )}
      </Component.Root>
    </div>
  )
}

export const ListBox = Template.bind({})
ListBox.args = { collapsable: false, selectMode: ListBoxSelectMode.SINGLE }
ListBox.storyName = 'ListBox'

export default {
  component: Component.Root,
  subcomponents: { Button: Component.Button, List: Component.List, ListItem: Component.ListItem },
  title: 'Components/ListBox'
} as Meta
