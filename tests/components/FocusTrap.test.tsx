import { fireEvent, render, RenderResult, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import * as FocusTrap from '../../src/components/FocusTrap'
import { LoggerLevel } from '../../src/definitions/enums'
import Logger from '../../src/modules/logger'

function Component() {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <div>
      <button data-testid='BUTTON_1' onClick={() => setVisible(true)} type='button' autoFocus />
      {visible && (
        <FocusTrap.Root autoFocus restoreFocus>
          <a data-testid='A' href='#' />
          <input data-testid='INPUT' type='text' />
          <button data-testid='BUTTON_2' onClick={() => setVisible(false)} type='button' />
        </FocusTrap.Root>
      )}
    </div>
  )
}

describe('FocusTrap', () => {
  let body: RenderResult, button: HTMLElement

  beforeAll(() => {
    Logger.level = LoggerLevel.ERROR
  })

  beforeEach(() => {
    body = render(<Component />)
    button = screen.getByTestId('BUTTON_1')
  })

  it('has the focus on the toggle button', () => {
    expect(button).toBe(document.activeElement)
  })

  it('auto focuses the first element inside the trap', () => {
    fireEvent.click(button)
    expect(screen.getByTestId('A')).toBe(document.activeElement)
  })

  it('keeps the focus trapped', () => {
    let trapped: [HTMLElement, HTMLElement, HTMLElement]

    fireEvent.click(button)
    trapped = [screen.getByTestId('A'), screen.getByTestId('INPUT'), screen.getByTestId('BUTTON_2')]

    userEvent.tab()
    expect(trapped[1]).toBe(document.activeElement)
    userEvent.tab()
    expect(trapped[2]).toBe(document.activeElement)
    userEvent.tab()
    expect(trapped[0]).toBe(document.activeElement)
    userEvent.tab({ shift: true })
    expect(trapped[2]).toBe(document.activeElement)
    userEvent.tab({ shift: true })
    expect(trapped[1]).toBe(document.activeElement)
    userEvent.tab({ shift: true })
    expect(trapped[0]).toBe(document.activeElement)
  })

  it('restores the focus to the original element', () => {
    fireEvent.click(button)
    fireEvent.click(screen.getByTestId('BUTTON_2'))
    expect(button).toBe(document.activeElement)
  })
})
