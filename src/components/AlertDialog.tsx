import { omit } from 'lodash'
import React, { KeyboardEvent, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertDialogDescriptionProps, AlertDialogProps, AlertDialogTitleProps } from '../definitions/props'
import AlertDialogStore from '../stores/alert.dialog.store'
import ArrayUtils from '../utils/array.utils'

function AlertDialog(props: AlertDialogProps) {
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new AlertDialogStore(ref), [])

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

function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  return <span {...omit(props, 'descriptionID', 'titleID')} id={props.descriptionID}></span>
}

function AlertDialogTitle(props: AlertDialogTitleProps) {
  return <span {...omit(props, 'descriptionID', 'titleID')} id={props.titleID}></span>
}

export { AlertDialog, AlertDialogDescription, AlertDialogTitle }
