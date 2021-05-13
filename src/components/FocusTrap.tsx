import { omit } from 'lodash'
import React, { KeyboardEvent, useLayoutEffect, useMemo, useRef } from 'react'
import { FocusTrapProps } from '../definitions/props'
import noop from '../modules/noop'
import FocusTrapStore from '../stores/focus.trap.store'

function Root(props: FocusTrapProps) {
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new FocusTrapStore(ref), [])

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
