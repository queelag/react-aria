import { RadioButtonCheckedRounded, RadioButtonUncheckedRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import React from 'react'
import { RadioGroup } from '../src/components/RadioGroup'
import { RadioGroupChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const options = new Array(5).fill(0).map(() => Chance().animal())

export const Raw = () => {
  return (
    <RadioGroup.Root>
      {(props: RadioGroupChildrenProps) =>
        options.map((v: string, k: number) => (
          <RadioGroup.Item {...props} className={ArrayUtils.joinStrings(props.isItemChecked(k) && 'bg-blue-100')} index={k} key={k}>
            {v}
          </RadioGroup.Item>
        ))
      }
    </RadioGroup.Root>
  )
}

export const Styled = () => {
  return (
    <RadioGroup.Root className='w-72 space-y-2'>
      {(props: RadioGroupChildrenProps) =>
        options.map((v: string, k: number) => (
          <RadioGroup.Item
            {...props}
            className={ArrayUtils.joinStrings(
              'p-6 space-x-6 rounded-md border border-gray-200 cursor-pointer outline-none',
              'hover:bg-gray-100 active:bg-gray-50 focus:bg-gray-100',
              props.isItemChecked(k) && 'bg-gray-50'
            )}
            index={k}
            key={k}
          >
            {props.isItemChecked(k) ? <RadioButtonCheckedRounded /> : <RadioButtonUncheckedRounded />}
            <span>{v}</span>
          </RadioGroup.Item>
        ))
      }
    </RadioGroup.Root>
  )
}

export default {
  component: RadioGroup.Root,
  subcomponents: { Item: RadioGroup.Item },
  title: 'Components/RadioGroup'
} as Meta
