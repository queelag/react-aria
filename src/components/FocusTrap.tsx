import { omit } from 'lodash'
import React, { KeyboardEvent, useLayoutEffect, useMemo, useRef } from 'react'
import { FocusTrapProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import noop from '../modules/noop'
import FocusTrapStore from '../stores/focus.trap.store'

/**
 * A focus trap is an element which overrides the default tab behaviour, allowing only the elements inside it to be focused.
 */
function Root(props: FocusTrapProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new FocusTrapStore(ref, update, props.id), [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  useLayoutEffect(() => store.readFocusables(), [props])
  useLayoutEffect(() => (props.restoreFocus ? store.readOriginalFocusedAndReturnFocuser() : noop), [props.restoreFocus])
  useLayoutEffect(() => (props.autoFocus ? store.focusFirstFocusable() : noop), [props.autoFocus])

  return <div {...omit(props, 'autoFocus', 'restoreFocus')} id={store.id} onKeyDown={onKeyDown} ref={ref} />
}

export { Root }
