import { Meta, Story } from '@storybook/react'
import React from 'react'
import { FocusTrap } from '../src/components/FocusTrap'
import { FocusTrapProps } from '../src/definitions/props'

const Template: Story<FocusTrapProps> = (args) => (
  <FocusTrap.Root {...args} className='w-64 flex flex-col space-y-2'>
    <label htmlFor='input'>Label</label>
    <input className='border border-black focus:ring-2' id='input' type='text' />
    <button className='border border-black focus:ring-2' type='button'>
      Button
    </button>
  </FocusTrap.Root>
)

export const Raw = Template.bind({})
Raw.args = { autoFocus: false }

export default {
  component: FocusTrap.Root,
  title: 'Components/FocusTrap'
} as Meta
