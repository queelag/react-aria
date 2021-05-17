import { MutableRefObject } from 'react'
import { ComponentName } from '../definitions/enums'
import ComponentStore from './component.store'

class ComponentRefStore<T extends HTMLElement = HTMLElement> extends ComponentStore {
  ref: MutableRefObject<T>

  constructor(name: ComponentName, ref: MutableRefObject<T>, update: () => void, id?: string) {
    super(name, update, id)
    this.ref = ref
  }

  update(): void {}

  get element(): T {
    return this.ref.current || document.createElement('div')
  }
}

export default ComponentRefStore
