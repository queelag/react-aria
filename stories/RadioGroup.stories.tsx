import { noop } from '@queelag/core'
import { ReactUtils } from '@queelag/react-core'
import { IconCircle, IconDisc } from '@queelag/react-feather-icons'
import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import React, { useState } from 'react'
import * as Component from '../src/components/RadioGroup'
import { RadioGroupChildrenProps, RadioGroupProps } from '../src/definitions/props'

const Template: Story<RadioGroupProps> = (args: RadioGroupProps) => {
  const [options] = useState(new Array(3).fill(0).map(() => Chance().animal()))

  return (
    <Component.Root {...args} className='w-72 space-y-2' onCheckItem={noop}>
      {(props: RadioGroupChildrenProps) =>
        options.map((v: string, k: number) => (
          <Component.Item
            {...props}
            className={ReactUtils.joinClassNames(
              'flex items-center p-6 space-x-6 rounded-md border border-gray-200 cursor-pointer outline-none',
              'hover:bg-gray-100 active:bg-gray-50 focus:bg-gray-100',
              props.isItemChecked(k) && 'bg-gray-50'
            )}
            index={k}
            key={k}
          >
            {props.isItemChecked(k) ? <IconDisc /> : <IconCircle />}
            <span>{v}</span>
          </Component.Item>
        ))
      }
    </Component.Root>
  )
}

export const RadioGroup: Story<RadioGroupProps> = Template.bind({})
RadioGroup.args = {}
RadioGroup.storyName = 'RadioGroup'

export default {
  component: Component.Root,
  subcomponents: { Item: Component.Item },
  title: 'Components/RadioGroup'
} as Meta
