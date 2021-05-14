import { CheckRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import * as CheckBox from '../src/components/CheckBox'
import ArrayUtils from '../src/utils/array.utils'

export const Raw = () => {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <CheckBox.Root isChecked={checked} onClick={() => setChecked(!checked)}>
      <div className='w-6 h-6 flex justify-center items-center border border-black p-1'>{checked && 'v'}</div>
      <span>{checked ? 'Checked' : 'Not Checked'}</span>
    </CheckBox.Root>
  )
}

export const Styled = () => {
  const [checked, setChecked] = useState<boolean>(false)

  return (
    <CheckBox.Root
      className='flex items-center space-x-4 rounded-md focus:ring-2 ring-offset-2 ring-blue-400 outline-none'
      isChecked={checked}
      onClick={() => setChecked(!checked)}
    >
      <div
        className={ArrayUtils.joinStrings(
          'w-8 h-8 flex justify-center items-center rounded-md border border-gray-200',
          'hover:bg-gray-100 active:bg-gray-50'
          //   'focus:ring-2 ring-offset-2 ring-blue-400'
        )}
      >
        {checked && <CheckRounded />}
      </div>
      <span className='font-medium'>{checked ? 'Checked' : 'Not Checked'}</span>
    </CheckBox.Root>
  )
}

export default {
  component: CheckBox.Root,
  title: 'Components/CheckBox'
} as Meta
