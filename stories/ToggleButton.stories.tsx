import { ReactUtils } from '@queelag/core'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import { IconVolume2, IconVolumeX } from '../../react-feather-icons/dist'
import * as Component from '../src/components/ToggleButton'
import { ToggleButtonProps } from '../src/definitions/props'

const Template: Story<ToggleButtonProps> = (args: ToggleButtonProps) => {
  const [toggled, setToggled] = useState<boolean>(args.toggled)

  return (
    <Component.Root
      {...args}
      className={ReactUtils.joinClassNames(
        'flex items-center bg-white px-12 py-6 space-x-2 rounded-md border border-gray-200 font-medium transition-all duration-200',
        'ring-offset-2 ring-blue-400 focus:ring-2',
        'hover:bg-gray-100 active:bg-gray-50'
      )}
      toggled={toggled}
      onClick={() => setToggled(!toggled)}
    >
      <span className='font-medium'>{toggled ? 'Muted' : 'Not Muted'}</span>
      {toggled ? <IconVolumeX /> : <IconVolume2 />}
    </Component.Root>
  )
}

export const ToggleButton = Template.bind({})
ToggleButton.args = { toggled: false }
ToggleButton.storyName = 'ToggleButton'

export default {
  component: Component.Root,
  title: 'Components/ToggleButton'
} as Meta
