import { ObjectUtils, StoreUtils } from '@queelag/core'
import { useForceUpdate, useID } from '@queelag/react-core'
import React, { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef } from 'react'
import { usePopper } from 'react-popper'
import { ComponentName } from '../definitions/enums'
import {
  ComboBoxButtonProps,
  ComboBoxChildrenProps,
  ComboBoxGroupProps,
  ComboBoxInputProps,
  ComboBoxListBoxItemProps,
  ComboBoxListBoxProps,
  ComboBoxProps
} from '../definitions/props'
import ComboBoxStore from '../stores/combo.box.store'

const ROOT_PROPS_KEYS: (keyof ComboBoxProps)[] = [
  'autocomplete',
  'listBoxLabel',
  'onCollapse',
  'onEscape',
  'onSelectListBoxItem',
  'popperOptions',
  'selectedListBoxItemIndexes'
]
const ROOT_CHILDREN_PROPS_KEYS: (keyof ComboBoxChildrenProps)[] = [
  'autocomplete',
  'deleteListBoxItemRef',
  'expanded',
  'focusedListBoxItemID',
  'isListBoxItemFocused',
  'isListBoxItemSelected',
  'listBoxID',
  'listBoxLabel',
  'popper',
  'setExpanded',
  'setGroupRef',
  'setInputRef',
  'setListBoxItemRef',
  'setListBoxRef',
  'setSelectedListBoxItemIndex'
]

/**
 * A combobox is an input widget with an associated popup that enables users to select a value for the combobox from a collection of possible values. In some implementations, the popup presents allowed values, while in other implementations, the popup presents suggested values, and users may either select one of the suggestions or type a value.
 */
export function Root(props: ComboBoxProps) {
  const update = useForceUpdate()
  const store = useMemo(() => new ComboBoxStore(update, props.id, props.onCollapse, props.onSelectListBoxItem, props.selectedListBoxItemIndexes), [])
  const popper = usePopper(store.groupRef.current, store.listBoxRef.current, props.popperOptions)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    store.handleKeyboardInteractions(event, props.onEscape)
    props.onKeyDown && props.onKeyDown(event)
  }

  useEffect(() => {
    StoreUtils.updateKeys(store, props, ['onCollapse', 'onSelectListBoxItem', 'selectedListBoxItemIndexes'], update)
  }, [props.onCollapse, props.onSelectListBoxItem, props.selectedListBoxItemIndexes])

  return (
    <div {...ObjectUtils.omit(props, ROOT_PROPS_KEYS)} id={store.id} onKeyDown={onKeyDown} style={{ ...props.style, position: 'relative' }}>
      {props.children({
        autocomplete: props.autocomplete,
        deleteListBoxItemRef: store.deleteListBoxItemRef,
        expanded: store.expanded,
        focusedListBoxItemID: store.focusedListBoxItemID,
        isListBoxItemFocused: store.isListBoxItemFocused,
        isListBoxItemSelected: store.isListBoxItemSelected,
        listBoxID: store.listBoxID,
        listBoxLabel: props.listBoxLabel,
        popper,
        setExpanded: store.setExpanded,
        setGroupRef: store.setGroupRef,
        setInputRef: store.setInputRef,
        setListBoxItemRef: store.setListBoxItemRef,
        setListBoxRef: store.setListBoxRef,
        setSelectedListBoxItemIndex: store.setSelectedListBoxItemIndex
      })}
    </div>
  )
}

export function Group(props: ComboBoxGroupProps) {
  const id = useID(ComponentName.COMBO_BOX_GROUP, props.id)
  const ref = useRef(document.createElement('div'))

  useEffect(() => props.setGroupRef(ref), [])

  return <div {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)} id={id} ref={ref} />
}

export function Input(props: ComboBoxInputProps) {
  const id = useID(ComponentName.COMBO_BOX_INPUT, props.id)
  const ref = useRef(document.createElement('input'))

  const onBlur = (event: FocusEvent<HTMLInputElement>) => {
    props.setExpanded(false, id, 'onBlur')
    props.onBlur && props.onBlur(event)
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.setExpanded(true, id, 'onChange')
    props.onChange && props.onChange(event)
  }

  const onClick = () => {
    props.setExpanded(!props.expanded, id, 'onClick')
  }

  useEffect(() => props.setInputRef(ref), [])

  return (
    <input
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-activedescendant={props.focusedListBoxItemID}
      aria-autocomplete={props.autocomplete ? 'list' : 'none'}
      aria-controls={props.listBoxID}
      aria-expanded={props.expanded}
      id={id}
      onBlur={onBlur}
      onChange={onChange}
      onClick={onClick}
      ref={ref}
      role='combobox'
      type='text'
      aria-haspopup
    />
  )
}

export function Button(props: ComboBoxButtonProps) {
  const id = useID(ComponentName.COMBO_BOX_BUTTON, props.id)

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    props.setExpanded(!props.expanded, id, 'onClick')
    props.onClick && props.onClick(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.onMouseDown && props.onMouseDown(event)
  }

  return (
    <button
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-label='Open'
      id={id}
      onClick={onClick}
      onMouseDown={onMouseDown}
      tabIndex={-1}
      type='button'
    />
  )
}

export function ListBox(props: ComboBoxListBoxProps) {
  const ref = useRef(document.createElement('ul'))

  useEffect(() => props.setListBoxRef(ref), [])

  return (
    <ul
      {...props.popper.attributes.popper}
      {...ObjectUtils.omit(props, ROOT_CHILDREN_PROPS_KEYS)}
      aria-label={props.listBoxLabel}
      id={props.listBoxID}
      ref={ref}
      role='listbox'
      style={{ ...props.style, ...props.popper.styles.popper }}
      tabIndex={-1}
    />
  )
}

export function ListBoxItem(props: ComboBoxListBoxItemProps) {
  const id = useID(ComponentName.COMBO_BOX_LIST_BOX_ITEM, props.id)
  const ref = useRef(document.createElement('li'))

  const onClick = (event: MouseEvent<HTMLLIElement>) => {
    props.setSelectedListBoxItemIndex(props.index, !props.isListBoxItemSelected(props.index))
    props.setExpanded(false, id, 'onClick')
    props.onClick && props.onClick(event)
  }

  const onMouseDown = (event: MouseEvent<HTMLLIElement>) => {
    event.preventDefault()
    props.onMouseDown && props.onMouseDown(event)
  }

  useEffect(() => {
    props.setListBoxItemRef(props.index, ref)
    return () => props.deleteListBoxItemRef(props.index)
  }, [])

  return (
    <li
      {...ObjectUtils.omit(props, [...ROOT_CHILDREN_PROPS_KEYS, 'index'])}
      aria-selected={props.isListBoxItemSelected(props.index)}
      id={id}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
      role='option'
      style={{ ...props.style, cursor: 'pointer' }}
    />
  )
}

export const AriaComboBox = {
  Root,
  Group,
  Input,
  Button,
  ListBox,
  ListBoxItem
}
