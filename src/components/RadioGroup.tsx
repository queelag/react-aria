import { omit } from 'lodash'
import React, { KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { ComponentName } from '../definitions/enums'
import { RadioGroupChildrenProps, RadioGroupItemProps, RadioGroupProps } from '../definitions/props'
import useForceUpdate from '../hooks/use.force.update'
import useID from '../hooks/use.id'
import RadioGroupStore from '../stores/radio.group.store'

const RADIO_GROUP_CHILDREN_PROPS_KEYS: (keyof RadioGroupChildrenProps)[] = ['deleteItemRef', 'isItemChecked', 'setCheckedItemIndex', 'setItemRef']

function Root(props: RadioGroupProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new RadioGroupStore(update, props.id), [])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event)
    props.onKeyDown && props.onKeyDown(event)
  }

  return (
    <div {...props} onKeyDown={onKeyDown} role='radiogroup'>
      {props.children({
        checkedItemIndex: store.checkedItemIndex,
        deleteItemRef: store.deleteItemRef,
        isItemChecked: store.isItemChecked,
        setCheckedItemIndex: store.setCheckedItemIndex,
        setItemRef: store.setItemRef
      })}
    </div>
  )
}

function Item(props: RadioGroupItemProps) {
  const id = useID(ComponentName.RADIO_GROUP_ITEM, props.id)
  const ref = useRef(document.createElement('div'))

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    props.setCheckedItemIndex(props.index)
    props.onClick && props.onClick(event)
  }

  useEffect(() => {
    props.setItemRef(props.index, ref)
    return () => props.deleteItemRef(props.index)
  }, [])

  return (
    <div
      {...omit(props, RADIO_GROUP_CHILDREN_PROPS_KEYS, 'index')}
      aria-checked={props.isItemChecked(props.index)}
      id={id}
      onClick={onClick}
      ref={ref}
      role='radio'
      tabIndex={props.checkedItemIndex < 0 || props.isItemChecked(props.index) ? 0 : -1}
    />
  )
}

const RadioGroup = { Root, Item }
export { RadioGroup }
