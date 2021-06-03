import { InfoRounded } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React from 'react'
import * as Component from '../src/components/Alert'
import { AlertProps } from '../src/definitions/props'

const Template: Story<AlertProps> = (args: AlertProps) => (
  <Component.Root {...args} className='flex items-center p-6 space-x-3 rounded-md bg-white text-blue-500 border border-gray-100'>
    <InfoRounded style={{ fontSize: 32 }} />
    <div className='flex flex-col'>
      <span className='font-medium text-lg'>Information</span>
      <span className='text-sm'>{Chance().paragraph({ sentences: 1 })}</span>
    </div>
  </Component.Root>
)

export const Alert = Template.bind({})
Alert.args = {}

export default {
  component: Component.Root,
  title: 'Components/Alert'
} as Meta
