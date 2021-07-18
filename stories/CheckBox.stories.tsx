import { ReactUtils } from '@queelag/core'
import { IconCheck } from '@queelag/react-feather-icons'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import * as Component from '../src/components/CheckBox'
import { CheckBoxProps } from '../src/definitions/props'

const Template: Story<CheckBoxProps> = (args: CheckBoxProps) => {
  const [checked, setChecked] = useState<boolean>(args.checked)

  return (
    <Component.Root
      className='flex items-center space-x-4 rounded-md focus:ring-2 ring-offset-2 ring-blue-400 outline-none'
      checked={checked}
      onClick={() => setChecked(!checked)}
    >
      <div
        className={ReactUtils.joinClassNames(
          'w-8 h-8 flex justify-center items-center rounded-md border border-gray-200',
          'hover:bg-gray-100 active:bg-gray-50'
          //   'focus:ring-2 ring-offset-2 ring-blue-400'
        )}
      >
        {checked && <IconCheck />}
      </div>
      <span className='font-medium'>{checked ? 'Checked' : 'Not Checked'}</span>
    </Component.Root>
  )
}

export const CheckBox = Template.bind({})
CheckBox.args = { checked: false }
CheckBox.storyName = 'CheckBox'

export default {
  component: Component.Root,
  title: 'Components/CheckBox'
} as Meta
