import { InfoOutlined } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import React, { Fragment } from 'react'
import { Tooltip } from '../src/components/Tooltip'
import { TooltipChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

export const Raw = () => {
  return (
    <Tooltip.Root>
      {(props: TooltipChildrenProps) => (
        <Fragment>
          <Tooltip.Trigger {...props}>Hover Me</Tooltip.Trigger>
          <Tooltip.Element {...props} className={ArrayUtils.joinStrings(!props.visible && 'opacity-0 pointer-events-none')}>
            Tooltip Content
          </Tooltip.Element>
        </Fragment>
      )}
    </Tooltip.Root>
  )
}

export const Styled = () => {
  return (
    <div className='flex items-center space-x-2'>
      <span>Generic Title</span>
      <Tooltip.Root popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [0, 8] } }] }}>
        {(props: TooltipChildrenProps) => (
          <Fragment>
            <Tooltip.Trigger {...props} className='flex justify-center items-center outline-none rounded-full focus:ring-2 ring-blue-400'>
              <InfoOutlined />
            </Tooltip.Trigger>
            <Tooltip.Element
              {...props}
              className={ArrayUtils.joinStrings(
                'p-2 bg-black text-white text-xs whitespace-nowrap rounded-md transition-opacity duration-200',
                !props.visible && 'opacity-0 pointer-events-none'
              )}
            >
              Tooltip Content
            </Tooltip.Element>
          </Fragment>
        )}
      </Tooltip.Root>
    </div>
  )
}

export default {
  component: Tooltip.Root,
  subcomponents: { Element: Tooltip.Element, Trigger: Tooltip.Trigger },
  title: 'Components/Tooltip'
} as Meta
