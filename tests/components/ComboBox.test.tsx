import { act, fireEvent, render, screen } from '@testing-library/react'
import { Chance } from 'chance'
import React, { Fragment } from 'react'
import { ComboBox } from '../../src/components/ComboBox'
import { ComponentName, LoggerLevel } from '../../src/definitions/enums'
import { ComboBoxChildrenProps, ComboBoxProps } from '../../src/definitions/props'
import Logger from '../../src/modules/logger'

function Component({
  onClickItem,
  onCollapse,
  onEscape,
  options
}: Omit<ComboBoxProps, 'children' | 'listBoxLabel'> & { onClickItem: () => void; options: string[] }) {
  return (
    <ComboBox.Root data-testid={ComponentName.COMBO_BOX} listBoxLabel='Countries' onCollapse={onCollapse} onEscape={onEscape} autocomplete>
      {(props: ComboBoxChildrenProps) => (
        <Fragment>
          <ComboBox.Group {...props} data-testid={ComponentName.COMBO_BOX_GROUP}>
            <ComboBox.Input {...props} data-testid={ComponentName.COMBO_BOX_INPUT} />
            <ComboBox.Button {...props} data-testid={ComponentName.COMBO_BOX_BUTTON}>
              Button
            </ComboBox.Button>
          </ComboBox.Group>
          <ComboBox.ListBox {...props} data-testid={ComponentName.COMBO_BOX_LIST_BOX}>
            {props.expanded &&
              options.map((v: string, k: number) => (
                <ComboBox.ListBoxItem {...props} data-testid={ComponentName.COMBO_BOX_LIST_BOX_ITEM} index={k} key={k} onClick={() => onClickItem()}>
                  {v}
                </ComboBox.ListBoxItem>
              ))}
          </ComboBox.ListBox>
        </Fragment>
      )}
    </ComboBox.Root>
  )
}

describe('ComboBox', () => {
  let onClickItem: () => void,
    onCollapse: () => void,
    onEscape: () => void,
    options: string[],
    root: HTMLElement,
    group: HTMLElement,
    input: HTMLElement,
    button: HTMLElement,
    listBox: HTMLElement,
    listBoxItems: HTMLElement[]

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    onClickItem = jest.fn()
    onCollapse = jest.fn()
    onEscape = jest.fn()
    options = new Array(5).fill(0).map(() => Chance().country({ full: true }))
    render(<Component onClickItem={onClickItem} onCollapse={onCollapse} onEscape={onEscape} options={options} />)
    root = screen.getByTestId(ComponentName.COMBO_BOX)
    group = screen.getByTestId(ComponentName.COMBO_BOX_GROUP)
    input = screen.getByTestId(ComponentName.COMBO_BOX_INPUT)
    button = screen.getByTestId(ComponentName.COMBO_BOX_BUTTON)
    listBox = screen.getByTestId(ComponentName.COMBO_BOX_LIST_BOX)
  })

  it('has correct aria attributes', () => {
    expect(input.getAttribute('aria-activedescendant')).toHaveLength(0)
    expect(input.getAttribute('aria-autocomplete')).toBe('list')
    expect(input.getAttribute('aria-controls')).toBe(listBox.id)
    expect(input.getAttribute('aria-expanded')).toBe('false')
    expect(input.getAttribute('aria-haspopup')).toBe('true')
    expect(input.getAttribute('role')).toBe('combobox')
    expect(input.getAttribute('type')).toBe('text')
    expect(button.getAttribute('aria-label')).toBe('Open')
    expect(button.getAttribute('tabindex')).toBe('-1')
    expect(button.getAttribute('type')).toBe('button')
    expect(listBox.getAttribute('aria-label')).toBe('Countries')
    expect(listBox.getAttribute('role')).toBe('listbox')
    expect(listBox.getAttribute('tabindex')).toBe('-1')

    act(() => {
      fireEvent.click(input)
    })

    listBoxItems = screen.getAllByTestId(ComponentName.COMBO_BOX_LIST_BOX_ITEM)
    listBoxItems.forEach((v: HTMLElement) => {
      expect(v.getAttribute('aria-selected')).toBe('false')
      expect(v.getAttribute('role')).toBe('option')
    })
  })
})
