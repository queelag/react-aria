import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { CheckBox } from '../../src/components/CheckBox'
import { ComponentName, Key, LoggerLevel } from '../../src/definitions/enums'
import Logger from '../../src/modules/logger'

function Component() {
  const [checked, setChecked] = useState<boolean>(false)

  return <CheckBox.Root data-testid={ComponentName.CHECK_BOX} isChecked={checked} onClick={() => setChecked(!checked)} />
}

describe('CheckBox', () => {
  let root: HTMLElement

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    render(<Component />)
    root = screen.getByTestId(ComponentName.CHECK_BOX)
  })

  it('has correct aria attributes', () => {
    expect(root.getAttribute('aria-checked')).toBe('false')
    expect(root.getAttribute('role')).toBe('checkbox')
    expect(root.getAttribute('tabindex')).toBe('0')
  })

  it('handles the isChecked value changes', () => {
    fireEvent.click(root)
    expect(root.getAttribute('aria-checked')).toBe('true')
    fireEvent.click(root)
    expect(root.getAttribute('aria-checked')).toBe('false')
  })

  it('handles keyboard interactions', () => {
    root.focus()
    fireEvent.keyDown(root, { key: Key.SPACE })
    expect(root.getAttribute('aria-checked')).toBe('true')
    fireEvent.keyDown(root, { key: Key.SPACE })
    expect(root.getAttribute('aria-checked')).toBe('false')
  })
})
