import { DoneRounded } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React, { Fragment, useState } from 'react'
import { ListBox } from '../src/components/ListBox'
import { ListBoxSelectMode } from '../src/definitions/enums'
import { ListBoxChildrenProps, ListBoxProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const options = new Array(5).fill(0).map(() => Chance().country({ full: true }))

const RawTemplate: Story<ListBoxProps> = (args) => {
  const [value, setValue] = useState<string>('')

  return (
    <ListBox.Root {...args}>
      {(props: ListBoxChildrenProps) => (
        <Fragment>
          {props.collapsable && (
            <ListBox.Button {...props} className='focus:ring'>
              {'Select a country' || value}
            </ListBox.Button>
          )}
          <ListBox.List
            {...props}
            className={ArrayUtils.joinStrings('focus:ring outline-none', props.collapsable && !props.expanded && 'opacity-0 pointer-events-none')}
          >
            {options.map((v: string, k: number) => (
              <ListBox.ListItem
                {...props}
                className={ArrayUtils.joinStrings(props.isListItemFocused(k) && 'ring', props.isListItemSelected(k) && 'bg-blue-100')}
                index={k}
                key={k}
                onClick={() => setValue(v)}
              >
                {v}
              </ListBox.ListItem>
            ))}
          </ListBox.List>
        </Fragment>
      )}
    </ListBox.Root>
  )
}

export const Raw = RawTemplate.bind({})
Raw.args = { collapsable: false, selectMode: ListBoxSelectMode.MULTIPLE }

const StyledTemplate: Story<ListBoxProps> = (args) => {
  const [value, setValue] = useState<string>('')

  return (
    <ListBox.Root {...args} className='w-72' popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }] }}>
      {(props: ListBoxChildrenProps) => (
        <Fragment>
          {props.collapsable && (
            <ListBox.Button
              {...props}
              className={ArrayUtils.joinStrings(
                'w-full flex border border-gray-200 rounded-md p-6 font-medium outline-none transition-all duration-200',
                'hover:bg-gray-100 focus:bg-gray-50',
                'focus:ring-2 ring-offset-2 ring-blue-400'
              )}
            >
              {'Select a country' || value}
            </ListBox.Button>
          )}
          <ListBox.List
            {...props}
            className={ArrayUtils.joinStrings(
              'w-full border border-gray-200 rounded-md divide-y divide-gray-200 outline-none transition-all duration-200',
              props.collapsable && !props.expanded && 'opacity-0 pointer-events-none'
            )}
          >
            {options.map((v: string, k: number) => (
              <ListBox.ListItem
                {...props}
                className={ArrayUtils.joinStrings(
                  'flex justify-between p-6 space-x-6 transition-all duration-100 hover:bg-gray-100',
                  props.isListItemFocused(k) && 'bg-gray-100',
                  props.isListItemSelected(k) && 'bg-gray-50'
                )}
                index={k}
                key={k}
                onClick={() => setValue(v)}
              >
                <span>{v}</span>
                {props.isListItemSelected(k) && <DoneRounded />}
              </ListBox.ListItem>
            ))}
          </ListBox.List>
        </Fragment>
      )}
    </ListBox.Root>
  )
}

export const Styled = StyledTemplate.bind({})
Styled.args = { collapsable: true, selectMode: ListBoxSelectMode.MULTIPLE }

export default {
  component: ListBox.Root,
  subcomponents: { Button: ListBox.Button, List: ListBox.List, ListItem: ListBox.ListItem },
  title: 'Components/ListBox'
} as Meta
