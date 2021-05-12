import { MutableRefObject } from 'react'
import { ComponentName } from '../definitions/enums'
import ComponentStore from './component.store'

class PortalComponentStore<T extends HTMLElement = HTMLDivElement> extends ComponentStore<T> {
  container: HTMLDivElement

  constructor(name: ComponentName, ref: MutableRefObject<T>) {
    super(name, ref)

    this.container = document.createElement('div')
  }

  appendContainerToBodyAndReturnRemover(): () => void {
    document.body.appendChild(this.container)
    return () => this.container.remove()
  }
}

export default PortalComponentStore
