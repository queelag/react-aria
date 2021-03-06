import { noop, ObjectUtils } from '@queelag/core'
import { useComponentStore } from '@queelag/react-core'
import React, { KeyboardEvent, useEffect } from 'react'
import { FocusTrapProps } from '../definitions/props'
import { FocusTrapStore } from '../stores/focus.trap.store'

const ROOT_PROPS_KEYS: (keyof FocusTrapProps)[] = ['autoFocus', 'getStore', 'restoreFocus']

/**
 * A focus trap is an element which overrides the default tab behaviour, allowing only the elements inside it to be focused.
 */
export function Root(props: FocusTrapProps) {
  const store = useComponentStore(FocusTrapStore, props)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => store.readFocusables(), [props])
  useEffect(() => (props.restoreFocus ? store.readOriginalFocusedAndReturnFocuser() : noop), [props.restoreFocus])
  useEffect(() => (props.autoFocus ? store.focusFirstFocusable() : noop), [props.autoFocus])

  return <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} ref={store.ref} />
}

export const AriaFocusTrap = {
  Root
}
