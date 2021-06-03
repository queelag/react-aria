import { Meta, Story } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/Slider'
import { SliderChildrenProps, SliderProps } from '../src/definitions/props'

const Template: Story<SliderProps> = (args: SliderProps) => {
  const [value, setValue] = useState<number>(args.value)

  return (
    <Component.Root {...args} className='relative max-w-lg flex items-center' onChangeValue={(value: number) => setValue(value)} value={value}>
      {(props: SliderChildrenProps) => (
        <Fragment>
          <div className='w-full h-1 rounded-full bg-gray-100'></div>
          <Component.Thumb
            {...props}
            className='absolute w-6 h-6 rounded-full bg-blue-400 cursor-pointer'
            style={{ left: (props.value / props.maximum) * 100 + '%' }}
          />
        </Fragment>
      )}
    </Component.Root>
  )
}

export const Slider = Template.bind({})
Slider.args = { minimum: 0, maximum: 100, value: 25 }

export default {
  component: Component.Root,
  subcomponents: { Thumb: Component.Thumb },
  title: 'Components/Slider'
} as Meta
