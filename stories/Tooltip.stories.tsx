import { InfoOutlined } from '@material-ui/icons'
import { Meta, Story } from '@storybook/react'
import React, { Fragment } from 'react'
import * as Component from '../src/components/Tooltip'
import { TooltipChildrenProps, TooltipProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const Template: Story<TooltipProps> = (args: TooltipProps) => {
  return (
    <div className='flex items-center space-x-2'>
      <span>Generic Title</span>
      <Component.Root {...args} className='relative' popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 8] } }], placement: 'auto' }}>
        {(props: TooltipChildrenProps) => (
          <Fragment>
            <Component.Trigger {...props} className='flex justify-center items-center outline-none rounded-full focus:ring-2 ring-blue-400'>
              <InfoOutlined />
            </Component.Trigger>
            <Component.Element {...props}>
              <div
                className={ArrayUtils.joinStrings(
                  'p-2 bg-black text-white text-xs whitespace-nowrap rounded-md transform origin-left transition-all duration-200',
                  !props.visible && 'opacity-0 pointer-events-none scale-50'
                )}
              >
                Tooltip Content
              </div>
            </Component.Element>
          </Fragment>
        )}
      </Component.Root>
    </div>
  )
}

export const Tooltip = Template.bind({})
Tooltip.args = { hideDelay: 200 }

export default {
  component: Component.Root,
  subcomponents: { Element: Component.Element, Trigger: Component.Trigger },
  title: 'Components/Tooltip'
} as Meta
