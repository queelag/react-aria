import { ReactUtils } from '@queelag/react-core'
import { IconCheck, IconChevronDown } from '@queelag/react-feather-icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React, { ChangeEvent, Fragment, useState } from 'react'
import * as Component from '../src/components/ComboBox'
import { ComboBoxChildrenProps, ComboBoxProps } from '../src/definitions/props'

const StyledTemplate: Story<ComboBoxProps> = (args: ComboBoxProps) => {
  const [options] = useState<string[]>(new Array(3).fill(0).map(() => Chance().country({ full: true })))
  const [filter, setFilter] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const onChangeFilter = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value === '' && setValue('')
    setFilter(event.target.value)
  }

  const onClick = (option: string) => {
    setFilter('')
    setValue(option)
  }

  const onCollapse = () => {
    setFilter('')
  }

  const onEscape = () => {
    setFilter('')
    setValue('')
  }

  return (
    <div className='h-96'>
      <Component.Root
        {...args}
        className='max-w-lg'
        onCollapse={onCollapse}
        onEscape={onEscape}
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }] }}
        autocomplete
      >
        {(props: ComboBoxChildrenProps) => (
          <Fragment>
            <Component.Group {...props} className='relative'>
              <Component.Input
                {...props}
                className={ReactUtils.joinClassNames(
                  'w-full border border-gray-200 rounded-md p-6 pr-12 font-medium outline-none transition-all duration-200',
                  'hover:bg-gray-100 focus:bg-gray-50',
                  'focus:ring-2 ring-offset-2 ring-blue-400'
                )}
                onChange={onChangeFilter}
                placeholder='ex. Italy'
                value={filter || value}
              />
              <Component.Button {...props} className={ReactUtils.joinClassNames('absolute top-0 right-0 w-12 min-h-full flex justify-center items-center')}>
                <IconChevronDown />
              </Component.Button>
            </Component.Group>
            <motion.div animate={{ opacity: props.expanded ? 1 : 0 }} className={ReactUtils.joinClassNames(!props.expanded && 'pointer-events-none')}>
              <Component.ListBox {...props} className='w-full bg-white rounded-md border border-gray-200 divide-y divide-gray-200'>
                {options
                  .filter((v: string) => v.toLowerCase().trim().includes(filter.toLowerCase().trim()))
                  .map((v: string, k: number) => (
                    <Component.ListBoxItem
                      {...props}
                      className={ReactUtils.joinClassNames(
                        'flex justify-between items-center p-6 transition-all duration-200',
                        'hover:bg-gray-100',
                        props.isListBoxItemFocused(k) && 'bg-gray-100',
                        v === value && 'bg-gray-50'
                      )}
                      index={k}
                      key={k}
                      onClick={() => onClick(v)}
                    >
                      <span className='font-medium'>{v}</span>
                      {v === value && <IconCheck />}
                    </Component.ListBoxItem>
                  ))}
              </Component.ListBox>
            </motion.div>
          </Fragment>
        )}
      </Component.Root>
    </div>
  )
}

export const ComboBox = StyledTemplate.bind({})
ComboBox.args = {
  autocomplete: true,
  listBoxLabel: 'Countries'
}
ComboBox.storyName = 'ComboBox'

export default {
  component: Component.Root,
  subcomponents: { Group: Component.Group, Input: Component.Input, Button: Component.Button, ListBox: Component.ListBox, ListBoxItem: Component.ListBoxItem },
  title: 'Components/ComboBox'
} as Meta
