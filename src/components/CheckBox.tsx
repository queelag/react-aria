import { Logger, ObjectUtils } from '@queelag/core'
import { useID, useSafeRef } from '@queelag/react-core'
import React, { KeyboardEvent } from 'react'
import { ComponentName, Key } from '../definitions/enums'
import { CheckBoxProps } from '../definitions/props'

const ROOT_PROPS_KEYS: (keyof CheckBoxProps)[] = ['checked']

/**
 * The most common type of checkbox, it allows the user to toggle between two choices -- checked and not checked.
 */
export function Root(props: CheckBoxProps) {
  const id = useID(ComponentName.CHECK_BOX, props.id)
  const ref = useSafeRef('div')

  const handleKeyboardInteractions = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case Key.SPACE:
        event.preventDefault()
        event.stopPropagation()
        Logger.debug(id, 'handleKeyboardInteractions', `The default event has been prevented and the propagation has been stopped.`)

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
      {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)}
      aria-checked={props.checked}
      id={id}
      onKeyDown={onKeyDown}
      ref={ref}
      role='checkbox'
      style={{ cursor: 'pointer', ...props.style }}
      tabIndex={0}
    />
  )
}

export const AriaCheckBox = {
  Root
}
