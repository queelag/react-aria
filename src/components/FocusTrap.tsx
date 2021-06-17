import { noop } from '@queelag/core'
import { useForceUpdate } from '@queelag/react-core'
import { omit } from 'lodash'
import React, { KeyboardEvent, useEffect, useMemo, useRef } from 'react'
import { FocusTrapProps } from '../definitions/props'
import FocusTrapStore from '../stores/focus.trap.store'

/**
 * A focus trap is an element which overrides the default tab behaviour, allowing only the elements inside it to be focused.
 */
export function Root(props: FocusTrapProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new FocusTrapStore(ref, update, props.id), [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => store.readFocusables(), [props])
  useEffect(() => (props.restoreFocus ? store.readOriginalFocusedAndReturnFocuser() : noop), [props.restoreFocus])
  useEffect(() => (props.autoFocus ? store.focusFirstFocusable() : noop), [props.autoFocus])

  return <div {...omit(props, 'autoFocus', 'restoreFocus')} id={store.id} onKeyDown={onKeyDown} ref={ref} />
}
