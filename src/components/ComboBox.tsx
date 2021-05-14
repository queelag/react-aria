import { omit } from 'lodash'
import React, { useMemo, useRef } from 'react'
import { Root as _Button } from '../components/Button'
import { ComboBoxInputProps, ComboBoxProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import ComboBoxStore from '../stores/combo.box.store'

function Root(props: ComboBoxProps) {
  const update = useForceUpdate()
  const ref = useRef(document.createElement('div'))
  const store = useMemo(() => new ComboBoxStore(ref, update, props.id), [])

  return (
    <div {...omit(props)}>
      {props.children({
        activeItem: store.activeItem,
        expanded: store.expanded,
        listBoxID: store.listBoxID
      })}
    </div>
  )
}

function Input(props: ComboBoxInputProps) {
  return (
    <input
      {...omit(props, 'expanded', 'listBoxID')}
      aria-activedescendant={props.activeItem}
      aria-autocomplete='list'
      aria-controls={props.listBoxID}
      aria-expanded={props.expanded}
      aria-haspopup='true'
      role='combobox'
      type='text'
    />
  )
}

function Button() {
  return <_Button aria-label='Open' tabIndex={-1} />
}

export { Root }
