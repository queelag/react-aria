import { Logger } from '@queelag/core'
import { useID } from '@queelag/react-core'
import { omit } from 'lodash'
import React, { KeyboardEvent, useRef } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { CheckBoxProps } from '../definitions/props'

/**
 * The most common type of checkbox, it allows the user to toggle between two choices -- checked and not checked.
 */
export function Root(props: CheckBoxProps) {
  const id = useID(ComponentName.CHECK_BOX, props.id)
  const ref = useRef(document.createElement('div'))

  const handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case Key.SPACE:
        event.preventDefault()
        Logger.debug(id, 'handleKeyboardInteractions', `The default event has been prevented.`)

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
      {...omit(props, 'checked')}
      aria-checked={props.checked}
      id={id}
      onKeyDown={onKeyDown}
      ref={ref}
      role='checkbox'
      style={{ ...props.style, cursor: 'pointer' }}
      tabIndex={0}
    />
  )
}
