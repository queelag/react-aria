import { Meta, Story } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/Slider'
import * as Tooltip from '../src/components/Tooltip'
import { HTMLDivProps, SliderChildrenProps, SliderProps, TooltipChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

function ThumbTooltip(props: HTMLDivProps & { value: number }) {
  return (
    <Tooltip.Root {...props} popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 12] } }], placement: 'bottom' }}>
      {(childrenProps: TooltipChildrenProps) => (
        <Fragment>
          <Tooltip.Element
            {...childrenProps}
            className={ArrayUtils.joinStrings('w-6 h-6 transition-all duration-200', !childrenProps.visible && 'opacity-0 pointer-events-none')}
          >
            <div className={ArrayUtils.joinStrings('tear w-full h-full flex justify-center items-center font-semibold bg-gray-100')} style={{ fontSize: 8 }}>
              <span className='transform -rotate-45'>{props.value}</span>
            </div>
          </Tooltip.Element>
          <Tooltip.Trigger
            {...childrenProps}
            className='w-6 h-6 rounded-full bg-blue-400 cursor-pointer focus:ring-4 ring-blue-100 transition-all duration-200'
          >
            {props.children}
          </Tooltip.Trigger>
        </Fragment>
      )}
    </Tooltip.Root>
  )
}

const Template: Story<SliderProps> = (args: SliderProps) => {
  const [value, setValue] = useState<number>(args.value)

  return (
    <div className='p-6'>
      <Component.Root {...args} className='relative h-6 max-w-lg flex items-center' onChangeValue={(value: number) => setValue(value)} value={value}>
        {(props: SliderChildrenProps) => (
          <Fragment>
            <div className='w-full h-1 rounded-full bg-gray-100'></div>
            <ThumbTooltip
              className='absolute'
              style={{
                left: props.percentual + '%',
                transform: 'translateX(-50%)'
              }}
              value={value}
            >
              <Component.Thumb {...props} focusable={false} />
            </ThumbTooltip>
          </Fragment>
        )}
      </Component.Root>
    </div>
  )
}

export const Slider = Template.bind({})
Slider.args = { minimum: 0, maximum: 100, stepSize: 1, value: 25 }

export default {
  component: Component.Root,
  subcomponents: { Thumb: Component.Thumb },
  title: 'Components/Slider'
} as Meta
