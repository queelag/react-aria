import { Meta, Story } from '@storybook/react'
import { motion } from 'framer-motion'
import React from 'react'
import * as Component from '../src/components/Meter'
import { MeterChildrenProps, MeterProps } from '../src/definitions/props'

const Template: Story<MeterProps> = (args: MeterProps) => {
  return (
    <Component.Root {...args} className='h-8 max-w-lg bg-gray-100 rounded-md overflow-hidden'>
      {(props: MeterChildrenProps) => <motion.div animate={{ width: props.percentual + '%' }} className='h-full bg-blue-400' initial={{ width: 0 }} />}
    </Component.Root>
  )
}

export const Meter = Template.bind({})
Meter.args = { minimum: 0, maximum: 100, value: 75 }

export default {
  component: Component.Root,
  title: 'Components/Meter'
} as Meta
