import { VolumeMuteRounded, VolumeUpRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import React, { useState } from 'react'
import * as ToggleButton from '../src/components/ToggleButton'
import ArrayUtils from '../src/utils/array.utils'

export const Raw = () => {
  const [toggled, setToggled] = useState<boolean>(false)

  return (
    <ToggleButton.Root isToggled={toggled} onClick={() => setToggled(!toggled)}>
      {toggled ? 'Toggled' : 'Not Toggled'}
    </ToggleButton.Root>
  )
}

export const Styled = () => {
  const [toggled, setToggled] = useState<boolean>(false)

  return (
    <ToggleButton.Root
      className={ArrayUtils.joinStrings(
        'flex bg-white px-12 py-6 space-x-2 rounded-md border border-gray-200 font-medium transition-all duration-200',
        'ring-offset-2 ring-blue-400 focus:ring-2',
        'hover:bg-gray-100 active:bg-gray-50'
      )}
      isToggled={toggled}
      onClick={() => setToggled(!toggled)}
    >
      <span className='font-medium'>{toggled ? 'Muted' : 'Not Muted'}</span>
      {toggled ? <VolumeMuteRounded /> : <VolumeUpRounded />}
    </ToggleButton.Root>
  )
}

export default {
  component: ToggleButton.Root,
  title: 'Components/ToggleButton'
} as Meta
