import { omit } from 'lodash'
import React, { KeyboardEvent, useRef } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { CheckBoxProps } from '../definitions/props'
import useID from '../hooks/use.id'
import Logger from '../modules/logger'

function Root(props: CheckBoxProps) {
  const id = useID(ComponentName.CHECK_BOX, props.id)
  const ref = useRef(document.createElement('div'))

  const handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case Key.SPACE:
        ref.current.click()
        Logger.debug(id, 'handleKeyboardInteractions', `The click event has been triggered.`)

        break
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div
      {...omit(props, 'isChecked')}
      aria-checked={props.isChecked}
      id={id}
      onKeyDown={onKeyDown}
      ref={ref}
      role='checkbox'
      style={{ ...props.style, cursor: 'pointer' }}
      tabIndex={0}
    />
  )
}

const CheckBox = { Root }
export { CheckBox }
