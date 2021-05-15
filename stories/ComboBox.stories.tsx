import { DoneRounded, KeyboardArrowDownRounded } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import { omit } from 'lodash'
import React, { ChangeEvent, Fragment, useState } from 'react'
import * as ComboBox from '../src/components/ComboBox'
import { ComboBoxChildrenProps, ComboBoxProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const RawTemplate: Story<ComboBoxProps & { options: string[] }> = (args) => {
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

  const onEscape = () => {
    setFilter('')
    setValue('')
  }

  return (
    <ComboBox.Root {...omit(args, 'options')} onEscape={onEscape} autocomplete>
      {(props: ComboBoxChildrenProps) => (
        <Fragment>
          <ComboBox.Group {...props} className='border border-black'>
            <ComboBox.Input {...props} onChange={onChangeFilter} value={filter || value} />
            <ComboBox.Button {...props}>v</ComboBox.Button>
          </ComboBox.Group>
          <ComboBox.ListBox {...props} className={ArrayUtils.joinStrings(!props.expanded && 'opacity-0 pointer-events-none')}>
            {args.options
              .filter((v: string) => v.toLowerCase().trim().includes(filter.toLowerCase().trim()))
              .map((v: string, k: number) => (
                <ComboBox.ListBoxItem
                  {...props}
                  className={ArrayUtils.joinStrings(props.isListBoxItemFocused(k) && 'border border-black')}
                  index={k}
                  key={k}
                  onClick={() => onClick(v)}
                >
                  {v}
                </ComboBox.ListBoxItem>
              ))}
          </ComboBox.ListBox>
        </Fragment>
      )}
    </ComboBox.Root>
  )
}

export const Raw = RawTemplate.bind({})
Raw.args = { autocomplete: false, listBoxLabel: 'Countries', options: new Array(5).fill(0).map(() => Chance().country({ full: true })) }

const StyledTemplate: Story<ComboBoxProps & { options: string[] }> = (args) => {
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

  const onEscape = () => {
    setFilter('')
    setValue('')
  }

  return (
    <ComboBox.Root
      {...omit(args, 'options')}
      onEscape={onEscape}
      popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 16] } }] }}
      autocomplete
    >
      {(props: ComboBoxChildrenProps) => (
        <Fragment>
          <ComboBox.Group {...props} className='relative'>
            <ComboBox.Input
              {...props}
              className={ArrayUtils.joinStrings(
                'border border-gray-200 rounded-md p-4 pr-12 font-medium outline-none transition-all duration-200',
                'hover:bg-gray-100 focus:bg-gray-50',
                'focus:ring-2 ring-offset-2 ring-blue-400'
              )}
              onChange={onChangeFilter}
              placeholder='ex. Italy'
              value={filter || value}
            />
            <ComboBox.Button {...props} className={ArrayUtils.joinStrings('absolute top-0 right-0 w-12 min-h-full flex justify-center items-center')}>
              <KeyboardArrowDownRounded />
            </ComboBox.Button>
          </ComboBox.Group>
          <motion.div animate={{ opacity: props.expanded ? 1 : 0 }} className={ArrayUtils.joinStrings(!props.expanded && 'pointer-events-none')}>
            <ComboBox.ListBox {...props} className='w-full bg-white rounded-md border border-gray-200'>
              {args.options
                .filter((v: string) => v.toLowerCase().trim().includes(filter.toLowerCase().trim()))
                .map((v: string, k: number) => (
                  <ComboBox.ListBoxItem
                    {...props}
                    className={ArrayUtils.joinStrings(
                      'flex justify-between p-4 transition-all duration-200',
                      'hover:bg-gray-100',
                      props.isListBoxItemFocused(k) && 'bg-gray-100',
                      v === value && 'bg-gray-50'
                    )}
                    index={k}
                    key={k}
                    onClick={() => onClick(v)}
                  >
                    <span className='font-medium'>{v}</span>
                    {v === value && <DoneRounded />}
                  </ComboBox.ListBoxItem>
                ))}
            </ComboBox.ListBox>
          </motion.div>
        </Fragment>
      )}
    </ComboBox.Root>
  )
}

export const Styled = StyledTemplate.bind({})
Styled.args = { autocomplete: false, listBoxLabel: 'Countries', options: new Array(5).fill(0).map(() => Chance().country({ full: true })) }

export default {
  component: ComboBox.Root,
  subcomponents: { Group: ComboBox.Group, Input: ComboBox.Input, Button: ComboBox.Button, ListBox: ComboBox.ListBox, ListBoxItem: ComboBox.ListBoxItem },
  title: 'Components/ComboBox'
} as Meta
