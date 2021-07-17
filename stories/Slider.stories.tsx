import { NumberUtils, ReactUtils } from '@queelag/core'
import { Meta, Story } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/Slider'
import * as Tooltip from '../src/components/Tooltip'
import { SliderMode, SliderOrientation } from '../src/definitions/enums'
import { HTMLDivProps, SliderChildrenProps, SliderProps, TooltipChildrenProps } from '../src/definitions/props'
import { SliderValue } from '../src/definitions/types'

function ThumbTooltip(props: HTMLDivProps & { orientation: SliderOrientation; value: number }) {
  return (
    <Tooltip.Root
      {...props}
      popperOptions={{
        modifiers: [{ name: 'offset', options: { offset: [0, 12] } }],
        placement: props.orientation === SliderOrientation.HORIZONTAL ? 'bottom' : 'right'
      }}
    >
      {(childrenProps: TooltipChildrenProps) => (
        <Fragment>
          <Tooltip.Element
            {...childrenProps}
            className={ReactUtils.joinClassNames('w-6 h-6 transition-all duration-200', !childrenProps.visible && 'opacity-0 pointer-events-none')}
          >
            <div
              className={ReactUtils.joinClassNames(
                'tear w-full h-full flex justify-center items-center font-semibold bg-gray-100 transform',
                props.orientation === SliderOrientation.HORIZONTAL ? 'rotate-45' : '-rotate-45'
              )}
              style={{ fontSize: 8 }}
            >
              <span className={ReactUtils.joinClassNames('transform', props.orientation === SliderOrientation.HORIZONTAL ? '-rotate-45' : 'rotate-45')}>
                {props.value}
              </span>
            </div>
          </Tooltip.Element>
          <Tooltip.Trigger
            {...childrenProps}
            className='w-6 h-6 rounded-full bg-blue-400 cursor-pointer hover:ring-4 focus:ring-4 active:ring-8 ring-blue-100 transition-all duration-200'
          />
        </Fragment>
      )}
    </Tooltip.Root>
  )
}

const Template: Story<SliderProps> = (args: SliderProps) => {
  const [value, setValue] = useState<SliderValue>(args.value)

  const onChangeValue = (value: SliderValue) => {
    // console.log('ON_CHANGE_VALUE', value)
    setValue(value)
  }

  return (
    <div className='p-6'>
      <Component.Root
        {...args}
        className={ReactUtils.joinClassNames(
          'relative flex justify-center items-center',
          args.orientation === SliderOrientation.HORIZONTAL ? 'h-6 max-w-lg' : 'w-6'
        )}
        onChangeValue={onChangeValue}
        value={value}
      >
        {(props: SliderChildrenProps) => (
          <Fragment>
            <div
              className={ReactUtils.joinClassNames('rounded-full bg-gray-100', props.orientation === SliderOrientation.HORIZONTAL ? 'h-1 w-full' : 'h-64 w-1')}
            />
            <div
              className={ReactUtils.joinClassNames('absolute bg-blue-100', props.orientation === SliderOrientation.HORIZONTAL ? 'h-1' : 'w-1')}
              style={
                props.orientation === SliderOrientation.HORIZONTAL
                  ? {
                      left: args.mode === SliderMode.DUAL_THUMB ? NumberUtils.pickLowest(...props.percentual) + '%' : 0,
                      width: NumberUtils.range(...props.percentual) + '%'
                    }
                  : {
                      bottom: args.mode === SliderMode.DUAL_THUMB ? NumberUtils.pickLowest(...props.percentual) + '%' : 0,
                      height: NumberUtils.range(...props.percentual) + '%'
                    }
              }
            />
            <Component.FirstThumb {...props} focusable={false}>
              <ThumbTooltip
                className='absolute z-20'
                orientation={props.orientation}
                style={{
                  bottom: props.orientation === SliderOrientation.VERTICAL ? props.percentual[0] + '%' : 0,
                  left: props.orientation === SliderOrientation.HORIZONTAL ? props.percentual[0] + '%' : 0,
                  transform: props.orientation === SliderOrientation.HORIZONTAL ? 'translateX(-50%)' : 'translateY(50%)'
                }}
                value={props.value[0]}
              />
            </Component.FirstThumb>
            {args.mode === SliderMode.DUAL_THUMB && (
              <Component.SecondThumb {...props} focusable={false}>
                <ThumbTooltip
                  className='absolute z-20'
                  orientation={props.orientation}
                  style={{
                    bottom: props.orientation === SliderOrientation.VERTICAL ? props.percentual[1] + '%' : 0,
                    left: props.orientation === SliderOrientation.HORIZONTAL ? props.percentual[1] + '%' : 0,
                    transform: props.orientation === SliderOrientation.HORIZONTAL ? 'translateX(-50%)' : 'translateY(50%)'
                  }}
                  value={props.value[1]}
                />
              </Component.SecondThumb>
            )}
          </Fragment>
        )}
      </Component.Root>
    </div>
  )
}

export const Slider = Template.bind({})
Slider.args = {
  label: 'Slider',
  minimum: 0,
  maximum: 100,
  mode: SliderMode.SINGLE_THUMB,
  orientation: SliderOrientation.HORIZONTAL,
  step: 1,
  value: [50, 0]
}

export default {
  component: Component.Root,
  subcomponents: { FirstThumb: Component.FirstThumb, SecondThumb: Component.SecondThumb },
  title: 'Components/Slider'
} as Meta
