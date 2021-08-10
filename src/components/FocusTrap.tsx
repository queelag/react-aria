import { noop, ObjectUtils } from '@queelag/core'
import { useForceUpdate, useSafeRef } from '@queelag/react-core'
import React, { KeyboardEvent, useEffect, useMemo } from 'react'
import { FocusTrapProps } from '../definitions/props'
import FocusTrapStore from '../stores/focus.trap.store'

const ROOT_PROPS_KEYS: (keyof FocusTrapProps)[] = ['autoFocus', 'restoreFocus']

/**
 * A focus trap is an element which overrides the default tab behaviour, allowing only the elements inside it to be focused.
 */
export function Root(props: FocusTrapProps) {
  const update = useForceUpdate()
  const ref = useSafeRef('div')
  const store = useMemo(() => new FocusTrapStore({ ...props, ref, update }), [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => store.readFocusables(), [props])
  useEffect(() => (props.restoreFocus ? store.readOriginalFocusedAndReturnFocuser() : noop), [props.restoreFocus])
  useEffect(() => (props.autoFocus ? store.focusFirstFocusable() : noop), [props.autoFocus])

  return <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} ref={ref} />
}

export const AriaFocusTrap = {
  Root
}
