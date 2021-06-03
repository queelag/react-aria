import { Meta, Story } from '@storybook/react'
import React from 'react'
import * as Component from '../src/components/FocusTrap'
import { FocusTrapProps } from '../src/definitions/props'

const Template: Story<FocusTrapProps> = (args: FocusTrapProps) => (
  <Component.Root {...args} className='w-64 flex flex-col space-y-2'>
    <label htmlFor='input'>Label</label>
    <input className='border border-black focus:ring-2' id='input' type='text' />
    <button className='border border-black focus:ring-2' type='button'>
      Button
    </button>
  </Component.Root>
)

export const FocusTrap = Template.bind({})
FocusTrap.args = { autoFocus: false }
FocusTrap.storyName = 'FocusTrap'

export default {
  component: Component.Root,
  title: 'Components/FocusTrap'
} as Meta
