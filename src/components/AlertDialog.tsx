import { omit } from 'lodash'
import React, { KeyboardEvent, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertDialogDescriptionProps, AlertDialogProps, AlertDialogTitleProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import AlertDialogStore from '../stores/alert.dialog.store'
import ArrayUtils from '../utils/array.utils'

/**
 * An alert dialog is a modal dialog that interrupts the user's workflow to communicate an important message and acquire a response.
 */
function Root(props: AlertDialogProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new AlertDialogStore(ref, update, props.id), [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event, props.onClose)
    props.onKeyDown && props.onKeyDown(event)
  }

  return createPortal(
    <div
      {...props}
      aria-describedby={store.descriptionElementID}
      aria-labelledby={store.titleElementID}
      className={ArrayUtils.joinStrings('absolute inset-0', props.className)}
      id={store.id}
      onKeyDown={onKeyDown}
      ref={ref}
      role='alertdialog'
      aria-modal
    >
      {props.children({ descriptionID: store.descriptionElementID, titleID: store.titleElementID })}
    </div>,
    document.body
  )
}

/**
 * The alert dialog description.
 */
function Description(props: AlertDialogDescriptionProps) {
  return <span {...omit(props, 'descriptionID', 'titleID')} id={props.descriptionID}></span>
}

/**
 * The alert dialog title.
 */
function Title(props: AlertDialogTitleProps) {
  return <span {...omit(props, 'descriptionID', 'titleID')} id={props.titleID}></span>
}

export { Root, Description, Title }
